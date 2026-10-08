import { createJob, updateJob, deleteJob, publishJob, unpublishJob, getJobById } from '../src/lib/actions/job';
import { prisma } from '../src/lib/prisma';
import { JobStatus } from '@prisma/client';

async function runTests() {
  console.log('=== STARTING JOB CRUD & VALIDATION TESTS ===\n');
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

  const opt = { skipAuth: true };

  try {
    // 1. Create Job Test
    console.log('1. Testing Job Creation...');
    const validJobInput = {
      title: 'Full Stack Engineer',
      companyName: 'Sarathi EdTech',
      location: 'Bangalore, India',
      employmentType: 'Full-time',
      experience: '2-4 yrs',
      salary: '₹12-16 LPA',
      description: 'Looking for an experienced Full Stack engineer with Next.js & PostgreSQL skills.',
      skills: 'Next.js, TypeScript, PostgreSQL, Prisma',
      applicationUrl: 'https://sarathiedtech.com/careers/apply-123',
      referralUrl: 'https://sarathiedtech.com/ref/user456',
      status: JobStatus.DRAFT,
    };

    const createRes = await createJob(validJobInput, opt);
    assert(createRes.success === true && Boolean(createRes.data?.id), 'Create Job with valid input', createRes.message);
    const createdJobId = createRes.data?.id ?? '';
    const initialSlug = createRes.data?.slug ?? '';

    // 2. Edit Job Test
    console.log('\n2. Testing Job Update (Edit)...');
    const updateInput = {
      ...validJobInput,
      title: 'Senior Full Stack Engineer',
      salary: '₹18-22 LPA',
    };
    const updateRes = await updateJob(createdJobId, updateInput, opt);
    assert(
      updateRes.success === true && updateRes.data?.title === 'Senior Full Stack Engineer',
      'Edit Job title & salary',
      updateRes.message
    );

    // 3. Publish Job Test
    console.log('\n3. Testing Job Publish...');
    const publishRes = await publishJob(createdJobId, opt);
    assert(
      publishRes.success === true && publishRes.data?.status === JobStatus.PUBLISHED && Boolean(publishRes.data?.publishedAt),
      'Publish Job sets status to PUBLISHED & updates publishedAt',
      publishRes.message
    );

    // 4. Unpublish Job Test
    console.log('\n4. Testing Job Unpublish...');
    const unpublishRes = await unpublishJob(createdJobId, opt);
    assert(
      unpublishRes.success === true && unpublishRes.data?.status === JobStatus.UNPUBLISHED,
      'Unpublish Job sets status to UNPUBLISHED',
      unpublishRes.message
    );

    // 5. Invalid URL Test
    console.log('\n5. Testing Invalid URL Validation...');
    const invalidUrlInput = {
      ...validJobInput,
      applicationUrl: 'not-a-valid-url-protocol',
    };
    const invalidUrlRes = await createJob(invalidUrlInput, opt);
    assert(
      invalidUrlRes.success === false && Boolean(invalidUrlRes.errors?.applicationUrl),
      'Reject Invalid Application URL',
      JSON.stringify(invalidUrlRes.errors)
    );

    // 6. Missing Required Fields Test
    console.log('\n6. Testing Missing Required Fields Validation...');
    const missingFieldsInput = {
      title: '',
      companyName: '',
      description: '',
      applicationUrl: '',
      location: 'Remote',
      employmentType: 'Full-time',
      experience: '0-2 yrs',
      skills: '',
    };
    const missingRes = await createJob(missingFieldsInput, opt);
    assert(
      missingRes.success === false &&
        Boolean(missingRes.errors?.title) &&
        Boolean(missingRes.errors?.companyName) &&
        Boolean(missingRes.errors?.description) &&
        Boolean(missingRes.errors?.applicationUrl),
      'Reject Missing Required Fields (title, companyName, description, applicationUrl)',
      JSON.stringify(missingRes.errors)
    );

    // 7. Duplicate Slug Handling Test
    console.log('\n7. Testing Duplicate Slug Handling...');
    const duplicateJobInput = {
      ...validJobInput,
      title: 'Senior Full Stack Engineer', // Same title as updated job
    };
    const dupRes = await createJob(duplicateJobInput, opt);
    assert(
      dupRes.success === true &&
        dupRes.data?.slug !== initialSlug &&
        Boolean(dupRes.data?.slug?.includes('senior-full-stack-engineer')),
      'Duplicate slug auto-increment suffix generated',
      `Original: ${initialSlug}, New: ${dupRes.data?.slug}`
    );
    const dupJobId = dupRes.data?.id ?? '';

    // 8. Delete Job Test
    console.log('\n8. Testing Job Deletion...');
    const deleteRes = await deleteJob(createdJobId, opt);
    const verifyDeleted = await getJobById(createdJobId);
    assert(
      deleteRes.success === true && verifyDeleted === null,
      'Delete Job removes job from database',
      deleteRes.message
    );

    // Cleanup second job
    if (dupJobId) {
      await deleteJob(dupJobId, opt);
    }

    console.log(`\n=== TEST SUMMARY: ${passedCount}/${testCount} TESTS PASSED ===`);

    if (passedCount !== testCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unhandled Test Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
