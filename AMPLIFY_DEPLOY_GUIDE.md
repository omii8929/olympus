# 🚀 Deploying OLYMPUS to AWS Amplify

This guide provides step-by-step instructions to deploy the **OLYMPUS 2026** platform to **AWS Amplify** directly from your GitHub repository (`omii8929/olympus`).

---

## 📋 Step 1: Open AWS Amplify Console
1. Log in to your [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **Amplify** and select **AWS Amplify**.
3. Click the orange **"Create new app"** button (or **"Host web app"**).

---

## 🔗 Step 2: Connect Your GitHub Repository
1. Under **"Start with an existing code repository"**, select **GitHub** and click **Next**.
2. Authorize AWS Amplify to access your GitHub account.
3. Select your repository:
   * **Repository:** `omii8929/olympus`
   * **Branch:** `main`
4. If prompted with *"Connecting a monorepo?"*:
   * Check the box or set the app root to `client` (or leave root as-is, since we configured both `amplify.yml` files!).
5. Click **Next**.

---

## ⚙️ Step 3: Configure Build Settings & Environment Variables

AWS Amplify will automatically detect the `amplify.yml` file created in your repository:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd client
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: client/dist
    files:
      - '**/*'
  cache:
    paths:
      - client/node_modules/**/*
```

### Environment Variables:
Under **"Advanced settings"** -> **"Environment variables"**, add:
* **Key:** `VITE_API_URL`
* **Value:** Your deployed backend API URL (e.g. `https://olympus-api.yourdomain.com/api` or your Render/AWS App Runner URL).
  *(Note: If testing frontend only initially, leave it as `/api` or point to your backend).*

Click **Next**, review the configuration, and click **"Save and deploy"**.

---

## 🔀 Step 4: CRITICAL — Configure SPA Single-Page App Rewrites
Because OLYMPUS uses React Router for client-side routing (`/events`, `/register`, `/qr`, `/scanner`, `/pass/:code`, `/admin`), you **must** configure redirect/rewrite rules in AWS Amplify so direct URL links and page refreshes don't return a 404:

1. In the AWS Amplify Console sidebar, go to **Hosting** -> **Rewrites and redirects** (or **App settings** > **Rewrites and redirects**).
2. Click **"Edit"**.
3. Ensure the rule is set as follows:
   * **Source address:** `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
   * **Target address:** `/index.html`
   * **Type:** `200 (Rewrite)`
4. Click **Save**.

---

## 🌍 Step 5: Custom Domain & Non-Expiring QR Code
1. Once deployed, AWS Amplify will generate a live HTTPS URL (e.g. `https://main.d123456789.amplifyapp.com`).
2. You can connect your custom domain (e.g. `olympus.sveri.ac.in`) under **App settings** > **Domain management**.
3. Visit the **QR Portal** at `https://your-domain.amplifyapp.com/qr`!
   * The QR code will immediately update to your live Amplify URL.
   * Anyone scanning from ANY mobile network (Airtel, Jio, Vi, 5G/4G, College Wi-Fi) will immediately open your OLYMPUS website.
   * Click **"Download Printable Event Poster"** to generate high-res banners for SVERI Idea Lab!
