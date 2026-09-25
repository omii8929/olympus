const BASE_URL = 'http://localhost:5050/api';

async function runTests() {
  console.log('=====================================================');
  console.log('🧪 RUNNING OLYMPUS FIREBASE AUTH & POSTGRESQL TEST SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`✅ PASS: ${desc}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${desc}`);
      failed++;
    }
  }

  // TEST 1: Reject request with no token
  console.log('--- TEST 1: Reject unauthenticated request without token ---');
  const resNoAuth = await fetch(`${BASE_URL}/admin/registrations`);
  const jsonNoAuth = await resNoAuth.json();
  assert(resNoAuth.status === 401, 'Endpoint rejected request with 401 Unauthorized');
  assert(jsonNoAuth.success === false, 'Response has success=false');

  // TEST 2: Reject request with invalid token
  console.log('\n--- TEST 2: Reject request with invalid token ---');
  const resBadToken = await fetch(`${BASE_URL}/admin/registrations`, {
    headers: { Authorization: 'Bearer bad_fake_firebase_token_99999' },
  });
  assert(resBadToken.status === 401 || resBadToken.status === 403, 'Rejected invalid token with 401/403');

  // TEST 3: Login as initial Super Admin (omupotalkar25@coep.sveri.ac.in)
  console.log('\n--- TEST 3: Admin login with initial Super Admin credentials ---');
  const resLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'omupotalkar25@coep.sveri.ac.in',
      password: process.env.INITIAL_ADMIN_PASSWORD || 'Sveri@123',
    }),
  });
  const jsonLogin = await resLogin.json();
  assert(resLogin.status === 200, 'Login returned HTTP 200');
  assert(jsonLogin.user?.role === 'SUPER_ADMIN', 'User has SUPER_ADMIN role');
  assert(Boolean(jsonLogin.token), 'Valid auth token received');
  const superToken = jsonLogin.token;

  // TEST 4: Profile lookup from PostgreSQL via /api/auth/me
  console.log('\n--- TEST 4: Verify session & profile lookup via /api/auth/me ---');
  const resMe = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${superToken}` },
  });
  const jsonMe = await resMe.json();
  assert(resMe.status === 200, 'Profile returned HTTP 200');
  assert(jsonMe.user?.email === 'omupotalkar25@coep.sveri.ac.in', 'Profile email matches PostgreSQL record');
  assert(jsonMe.user?.passwordHash === undefined, 'Security check: Password/hash is NOT returned in API');

  // TEST 5: Admin accessing registrations
  console.log('\n--- TEST 5: Admin accessing registrations in PostgreSQL ---');
  const resRegs = await fetch(`${BASE_URL}/admin/registrations`, {
    headers: { Authorization: `Bearer ${superToken}` },
  });
  const jsonRegs = await resRegs.json();
  assert(resRegs.status === 200, 'Admin registrations returned HTTP 200');
  assert(Array.isArray(jsonRegs.data), 'Registrations returned as an array');

  // TEST 6: Create another Admin user (Staff)
  console.log('\n--- TEST 6: Super Admin adding a staff admin account ---');
  const testStaffEmail = `staff.test.${Date.now()}@olympus.ece`;
  const resCreateAdmin = await fetch(`${BASE_URL}/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${superToken}`,
    },
    body: JSON.stringify({
      name: 'Test Staff Verifier',
      email: testStaffEmail,
      password: 'StaffPassword@123',
      role: 'ADMIN',
    }),
  });
  const jsonCreateAdmin = await resCreateAdmin.json();
  assert(resCreateAdmin.status === 201, 'Admin creation returned HTTP 201');
  assert(jsonCreateAdmin.data?.role === 'ADMIN', 'New admin has role=ADMIN');
  const newAdminId = jsonCreateAdmin.data?.id;

  // TEST 7: Staff Admin login & permission check (cannot edit payment settings)
  console.log('\n--- TEST 7: Staff Admin login & verify lack of payment management permission ---');
  const resStaffLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testStaffEmail,
      password: 'StaffPassword@123',
    }),
  });
  const jsonStaffLogin = await resStaffLogin.json();
  assert(resStaffLogin.status === 200, 'Staff admin login succeeded');
  const staffToken = jsonStaffLogin.token;

  // Staff admin trying to modify payment settings:
  const resStaffEdit = await fetch(`${BASE_URL}/admin/events/full_stack_ai/payment`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${staffToken}`,
    },
    body: JSON.stringify({ registrationFee: 999 }),
  });
  assert(resStaffEdit.status === 403, 'Backend rejected non-super-admin modification with 403 Forbidden');

  // TEST 8: Event 1 and Event 2 separate payment management
  console.log('\n--- TEST 8: Super Admin changing Event 1 payment & confirming Event 2 is untouched ---');
  const resEv1Before = await fetch(`${BASE_URL}/events/full_stack_ai/payment`);
  const jsonEv1Before = await resEv1Before.json();
  const resEv2Before = await fetch(`${BASE_URL}/events/drone_event/payment`);
  const jsonEv2Before = await resEv2Before.json();

  const newFee1 = jsonEv1Before.data.registrationFee === 120 ? 130 : 120;
  const resEv1Update = await fetch(`${BASE_URL}/admin/events/full_stack_ai/payment`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${superToken}`,
    },
    body: JSON.stringify({
      registrationFee: newFee1,
      paymentMobile: '9075118929',
    }),
  });
  assert(resEv1Update.status === 200, 'Event 1 payment update returned HTTP 200');

  // Verify Event 1 changed
  const resEv1After = await fetch(`${BASE_URL}/events/full_stack_ai/payment`);
  const jsonEv1After = await resEv1After.json();
  assert(jsonEv1After.data.registrationFee === newFee1, `Event 1 fee updated to ₹${newFee1}`);

  // Verify Event 2 was completely untouched
  const resEv2After = await fetch(`${BASE_URL}/events/drone_event/payment`);
  const jsonEv2After = await resEv2After.json();
  assert(
    jsonEv2After.data.registrationFee === jsonEv2Before.data.registrationFee,
    'Confirmed Event 2 payment settings remained completely unchanged'
  );

  // TEST 9: Deactivating staff admin
  console.log('\n--- TEST 9: Super Admin deactivating an admin account ---');
  const resToggle = await fetch(`${BASE_URL}/admin/users/${newAdminId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${superToken}` },
  });
  const jsonToggle = await resToggle.json();
  assert(resToggle.status === 200, 'Admin status toggle returned HTTP 200');
  assert(jsonToggle.data?.isActive === false, 'Admin account status is now deactivated (isActive=false)');

  // Deactivated staff trying to access admin route
  const resDeactivatedAccess = await fetch(`${BASE_URL}/admin/registrations`, {
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  assert(resDeactivatedAccess.status === 403, 'Deactivated admin is rejected with 403 Forbidden');

  // TEST 10: Delete test admin user
  console.log('\n--- TEST 10: Super Admin deleting the test admin account ---');
  const resDelete = await fetch(`${BASE_URL}/admin/users/${newAdminId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${superToken}` },
  });
  assert(resDelete.status === 200, 'Admin deletion returned HTTP 200');

  // TEST 11: Participant registration in PostgreSQL
  console.log('\n--- TEST 11: Participant team registration flow ---');
  const regPayload = {
    eventType: 'FULL_STACK_AI',
    teamName: `Cyber Knights ${Date.now().toString().slice(-4)}`,
    leader: {
      name: 'Rahul Deshmukh',
      email: `rahul.${Date.now()}@gmail.com`,
      phone: '9876543210',
      branch: 'Computer Science',
      college: 'SVERI College of Engineering',
    },
    members: [
      {
        name: 'Priya Shinde',
        email: `priya.${Date.now()}@gmail.com`,
        phone: '9876543211',
        branch: 'Electronics',
        college: 'SVERI College of Engineering',
      },
    ],
    utrNumber: `UTR${Date.now()}`,
    paymentScreenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };

  const resReg = await fetch(`${BASE_URL}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });
  const jsonReg = await resReg.json();
  assert(resReg.status === 201, 'Registration returned HTTP 201 Created');
  assert(Boolean(jsonReg.data?.regCode), `Registration generated pass code: ${jsonReg.data?.regCode}`);
  assert(Boolean(jsonReg.data?.teamCode), `Team code generated: ${jsonReg.data?.teamCode}`);
  assert(jsonReg.data?.amount === newFee1 * 2, `Total amount correctly calculated: ₹${jsonReg.data?.amount}`);

  console.log('\n=====================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
