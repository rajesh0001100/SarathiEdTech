import { createJob, updateJob, deleteJob, publishJob, unpublishJob, getJobById } from '../src/lib/actions/job';
import { loginAdmin, logoutAdmin, isAdminAuthenticated } from '../src/lib/auth';
import { prisma } from '../src/lib/prisma';
import { JobStatus } from '@prisma/client';

async function runPhase4Tests() {
  console.log('=== STARTING PHASE 4 ADMIN SECURITY & FUNCTIONALITY TESTS ===\n');
  let testCount = 0;
  let passedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    testCount++;
    if (condition) {
      passedCount++;
      console.log(`[PASS] Test ${testCount}: ${testName}`);
    } else {
      console.error(`[FAIL] Test ${testCount}: ${testName}${detail ? ` - ${detail}` : ''}`);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sarathiedtech.com';
  const adminPass = (process.env.ADMIN_PASSWORD || 'admin_dev_password_123').trim();

  try {
    // 1. Unauthorized Access Test
    console.log('1. Testing Unauthorized Server Action Enforcement...');
    // Ensure logged out initially
    await logoutAdmin();

    const unauthCreate = await createJob({
      title: 'Hacker Injected Job',
      companyName: 'Evil Corp',
      location: 'Unknown',
      employmentType: 'Full-time',
      experience: '0 yrs',
      description: 'Hacker test',
      skills: 'None',
      applicationUrl: 'https://evilcorp.com/apply',
    });

    assert(
      unauthCreate.success === false && Boolean(unauthCreate.message?.includes('Unauthorized')),
      'Block unauthorized job creation (Server Action auth check)',
      unauthCreate.message
    );

    // 2. Admin Authentication Test
    console.log('\n2. Testing Admin Login Credentials...');
    const invalidLogin = await loginAdmin('wrong@email.com', 'wrongpassword');
    assert(
      invalidLogin.success === false,
      'Reject incorrect admin credentials',
      invalidLogin.message
    );

    const validLogin = await loginAdmin(adminEmail, adminPass);
    const isAuth = await isAdminAuthenticated();
    assert(
      validLogin.success === true && isAuth === true,
      'Authenticate admin with valid credentials',
      `Auth status: ${isAuth}`
    );

    // 3. Authorized CRUD Test with Expiry Date
    console.log('\n3. Testing Authorized Job Creation & Expiry Date...');
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    const authCreate = await createJob({
      title: 'Security Lead Engineer',
      companyName: 'CyberGuard Inc',
      location: 'Hyderabad',
      employmentType: 'Full-time',
      experience: '5+ yrs',
      salary: '₹25-30 LPA',
      description: 'Lead security architecture and authentication systems.',
      skills: 'Security, Next.js, Auth, OAuth',
      applicationUrl: 'https://cyberguard.com/careers/sec-lead',
      expiresAt: expiryDate.toISOString().split('T')[0],
      status: JobStatus.DRAFT,
    });

    assert(
      authCreate.success === true && Boolean(authCreate.data?.id) && Boolean(authCreate.data?.expiresAt),
      'Create Job with Expiry Date under Authorized Admin session',
      authCreate.message
    );
    const jobId = authCreate.data?.id ?? '';

    // 4. Authorized Edit & Status Toggle Test
    console.log('\n4. Testing Authorized Publish & Unpublish...');
    const pubRes = await publishJob(jobId);
    assert(
      pubRes.success === true && pubRes.data?.status === JobStatus.PUBLISHED,
      'Publish Job under Authorized Admin session',
      pubRes.message
    );

    const unpubRes = await unpublishJob(jobId);
    assert(
      unpubRes.success === true && unpubRes.data?.status === JobStatus.UNPUBLISHED,
      'Unpublish Job under Authorized Admin session',
      unpubRes.message
    );

    const editRes = await updateJob(jobId, {
      title: 'Principal Security Lead Engineer',
      companyName: 'CyberGuard Inc',
      location: 'Hyderabad',
      employmentType: 'Full-time',
      experience: '7+ yrs',
      description: 'Updated security architecture description.',
      skills: 'Security, Architecture',
      applicationUrl: 'https://cyberguard.com/careers/sec-lead',
      status: JobStatus.PUBLISHED,
    });
    assert(
      editRes.success === true && editRes.data?.title === 'Principal Security Lead Engineer',
      'Edit Job under Authorized Admin session',
      editRes.message
    );

    // 5. Authorized Deletion Test
    console.log('\n5. Testing Authorized Job Deletion...');
    const delRes = await deleteJob(jobId);
    const verifyDel = await getJobById(jobId);
    assert(
      delRes.success === true && verifyDel === null,
      'Delete Job under Authorized Admin session',
      delRes.message
    );

    // 6. Logout Test
    console.log('\n6. Testing Admin Logout...');
    await logoutAdmin();
    const postLogoutAuth = await isAdminAuthenticated();
    assert(
      postLogoutAuth === false,
      'Logout invalidates admin session token',
      `Post-logout Auth status: ${postLogoutAuth}`
    );

    console.log(`\n=== PHASE 4 TEST SUMMARY: ${passedCount}/${testCount} TESTS PASSED ===`);

    if (passedCount !== testCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unhandled Phase 4 Test Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase4Tests();
