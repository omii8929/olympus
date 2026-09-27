const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// Load local .env if present
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  });
}

const accessKey = process.env.AWS_ACCESS_KEY_ID || process.env.AMPLIFY_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AMPLIFY_SECRET_KEY;
const region = process.env.AWS_REGION || 'ap-south-1';

if (!accessKey || !secretKey) {
  console.error('Error: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set.');
  process.exit(1);
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  return crypto.createHmac('sha256', kService).update('aws4_request').digest();
}

function awsRequest(method, requestPath, bodyObj = null) {
  return new Promise((resolve, reject) => {
    const service = 'amplify';
    const host = `amplify.${region}.amazonaws.com`;
    const endpoint = `https://${host}${requestPath}`;

    const now = new Date();
    const amzdate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const datestamp = amzdate.substr(0, 8);

    const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
    const payloadHash = crypto.createHash('sha256').update(bodyStr).digest('hex');

    const canonicalHeaders =
      (bodyStr ? 'content-type:application/json\n' : '') +
      `host:${host}\n` +
      `x-amz-date:${amzdate}\n`;
    const signedHeaders = (bodyStr ? 'content-type;' : '') + 'host;x-amz-date';

    const canonicalRequest =
      `${method}\n` +
      `${requestPath}\n\n` +
      `${canonicalHeaders}\n` +
      `${signedHeaders}\n` +
      payloadHash;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${datestamp}/${region}/${service}/aws4_request`;
    const stringToSign =
      `${algorithm}\n` +
      `${amzdate}\n` +
      `${credentialScope}\n` +
      crypto.createHash('sha256').update(canonicalRequest).digest('hex');

    const signingKey = getSignatureKey(secretKey, datestamp, region, service);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    const authorizationHeader =
      `${algorithm} ` +
      `Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, ` +
      `Signature=${signature}`;

    const headers = {
      Host: host,
      'X-Amz-Date': amzdate,
      Authorization: authorizationHeader,
    };
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(endpoint, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

function uploadZipToS3(uploadUrl, zipPath) {
  return new Promise((resolve, reject) => {
    const fileStats = fs.statSync(zipPath);
    const readStream = fs.createReadStream(zipPath);

    const urlObj = new URL(uploadUrl);
    const req = https.request(
      urlObj,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/zip',
          'Content-Length': fileStats.size,
        },
      },
      (res) => {
        res.on('data', () => {});
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(true);
          } else {
            reject(new Error(`S3 upload failed with status ${res.statusCode}`));
          }
        });
      }
    );

    req.on('error', reject);
    readStream.pipe(req);
  });
}

async function main() {
  console.log('--- Deploying OLYMPUS 2026 to AWS Amplify ---');

  // 1. Create or Find App
  console.log('1. Checking existing Amplify apps...');
  const listRes = await awsRequest('GET', '/apps');
  let app = listRes.data?.apps?.find((a) => a.name === 'olympus-2026');

  if (!app) {
    console.log('Creating new Amplify app "olympus-2026"...');
    const createRes = await awsRequest('POST', '/apps', {
      name: 'olympus-2026',
      description: 'OLYMPUS 2026 ECE Department Platform (ACES)',
      customRules: [
        {
          source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>',
          target: '/index.html',
          status: '200',
        },
      ],
    });

    if (createRes.status !== 200 && createRes.status !== 201) {
      console.error('Failed to create app:', createRes);
      process.exit(1);
    }
    app = createRes.data.app;
  }
  console.log(`✅ App ID: ${app.appId}`);

  // 2. Create or Find Branch 'main'
  console.log('2. Checking branch "main"...');
  const branchesRes = await awsRequest('GET', `/apps/${app.appId}/branches`);
  let branch = branchesRes.data?.branches?.find((b) => b.branchName === 'main');

  if (!branch) {
    console.log('Creating branch "main"...');
    const createBranchRes = await awsRequest('POST', `/apps/${app.appId}/branches`, {
      branchName: 'main',
      stage: 'PRODUCTION',
    });
    branch = createBranchRes.data.branch;
  }
  console.log(`✅ Branch "main" ready.`);

  // 3. Create Deployment
  console.log('3. Requesting deployment upload URL...');
  const createDepRes = await awsRequest('POST', `/apps/${app.appId}/branches/main/deployments`);
  if (!createDepRes.data?.zipUploadUrl) {
    console.error('Failed to get zipUploadUrl:', createDepRes);
    process.exit(1);
  }

  const { jobId, zipUploadUrl } = createDepRes.data;
  console.log(`✅ Deployment Job ID: ${jobId}`);

  // 4. Upload ZIP
  const zipPath = path.join(__dirname, '../client/dist.zip');
  console.log(`4. Uploading dist.zip (${(fs.statSync(zipPath).size / 1024).toFixed(1)} KB) to AWS S3...`);
  await uploadZipToS3(zipUploadUrl, zipPath);
  console.log('✅ Upload to S3 completed!');

  // 5. Start Deployment
  console.log('5. Triggering AWS Amplify deployment...');
  const startRes = await awsRequest('POST', `/apps/${app.appId}/branches/main/deployments/start`, {
    jobId,
  });
  console.log(`✅ Deployment initiated:`, startRes.data?.jobSummary?.status || 'STARTED');

  // 6. Poll for Completion
  console.log('6. Waiting for AWS CloudFront CDN deployment to complete...');
  let attempts = 0;
  while (attempts < 30) {
    await new Promise((r) => setTimeout(r, 4000));
    const jobRes = await awsRequest('GET', `/apps/${app.appId}/branches/main/jobs/${jobId}`);
    const status = jobRes.data?.job?.summary?.status;
    process.stdout.write(`   Status: ${status}...\n`);

    if (status === 'SUCCEED') {
      const defaultDomain = app.defaultDomain;
      const liveUrl = `https://main.${defaultDomain}`;
      console.log('\n==================================================');
      console.log('🎉 OLYMPUS 2026 SUCCESSFULLY DEPLOYED TO AWS AMPLIFY!');
      console.log(`🌐 Live Website: ${liveUrl}`);
      console.log(`🔐 Admin Portal: ${liveUrl}/login`);
      console.log(`📲 QR Portal:   ${liveUrl}/qr`);
      console.log(`📷 QR Scanner:  ${liveUrl}/scanner`);
      console.log('==================================================\n');
      return;
    } else if (status === 'FAILED') {
      console.error('\n❌ Deployment failed on AWS Amplify:', jobRes.data);
      process.exit(1);
    }
    attempts++;
  }
}

main().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
