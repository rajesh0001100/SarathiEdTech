import { createJob, deleteJob, getJobBySlug } from '../src/lib/actions/job';
import { prisma } from '../src/lib/prisma';
import { JobStatus } from '@prisma/client';

async function runPhase2Tests() {
  console.log('=== STARTING PHASE 2 PUBLIC PAGES & EDGE-CASE TESTS ===\n');
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
  const createdIds: string[] = [];

  try {
    // 1. Published Job Test
    console.log('1. Testing Published Job Accessibility...');
    const publishedRes = await createJob({
      title: 'Frontend Developer React',
      companyName: 'TechCorp India',
      location: 'Remote',
      employmentType: 'Full-time',
      experience: '1-3 yrs',
      salary: '₹8-12 LPA',
      description: 'Join our team as a Frontend React Developer.',
      skills: 'React, Next.js, Tailwind CSS',
      applicationUrl: 'https://techcorp.com/careers/fe-react',
      status: JobStatus.PUBLISHED,
    }, opt);
    if (publishedRes.data?.id) createdIds.push(publishedRes.data.id);
    const pubSlug = publishedRes.data?.slug ?? '';

    const fetchedPubJob = await getJobBySlug(pubSlug);
    assert(
      publishedRes.success === true && fetchedPubJob?.status === JobStatus.PUBLISHED,
      'Published Job accessible publicly',
      publishedRes.message
    );

    // 2. Unpublished Job Test
    console.log('\n2. Testing Unpublished Job Non-Accessibility...');
    const unpubRes = await createJob({
      title: 'Unpublished Internal Job',
      companyName: 'Private Corp',
      location: 'Delhi',
      employmentType: 'Contract',
      experience: '5+ yrs',
      description: 'Internal draft description.',
      skills: 'Java',
      applicationUrl: 'https://privatecorp.com/apply',
      status: JobStatus.UNPUBLISHED,
    }, opt);
    if (unpubRes.data?.id) createdIds.push(unpubRes.data.id);
    const unpubSlug = unpubRes.data?.slug ?? '';
    const fetchedUnpub = await getJobBySlug(unpubSlug);

    assert(
      unpubRes.success === true && fetchedUnpub?.status === JobStatus.UNPUBLISHED,
      'Unpublished Job status is UNPUBLISHED (filtered out by page handler)',
      `Status: ${fetchedUnpub?.status}`
    );

    // 3. Expired Job Test
    console.log('\n3. Testing Expired Job Non-Accessibility...');
    const expiredRes = await createJob({
      title: 'Expired Internship Role',
      companyName: 'Old Firm',
      location: 'Mumbai',
      employmentType: 'Internship',
      experience: 'Freshers',
      description: 'This position has closed.',
      skills: 'Python',
      applicationUrl: 'https://oldfirm.com/apply',
      status: JobStatus.EXPIRED,
    }, opt);
    if (expiredRes.data?.id) createdIds.push(expiredRes.data.id);
    const expiredSlug = expiredRes.data?.slug ?? '';
    const fetchedExpired = await getJobBySlug(expiredSlug);

    assert(
      expiredRes.success === true && fetchedExpired?.status === JobStatus.EXPIRED,
      'Expired Job status is EXPIRED (filtered out by page handler)',
      `Status: ${fetchedExpired?.status}`
    );

    // 4. Missing Optional Fields Test
    console.log('\n4. Testing Missing Optional Fields (Null Salary & Referral URL)...');
    const missingOptRes = await createJob({
      title: 'Minimal Requirements Engineer',
      companyName: 'Minimal Inc',
      location: 'Hybrid',
      employmentType: 'Full-time',
      experience: '0-1 yrs',
      salary: '', // Empty salary
      referralUrl: '', // Empty referral URL
      description: 'Simple job with minimal inputs.',
      skills: '', // Empty skills
      applicationUrl: 'https://minimal.com/job-1',
      status: JobStatus.PUBLISHED,
    }, opt);
    if (missingOptRes.data?.id) createdIds.push(missingOptRes.data.id);

    assert(
      missingOptRes.success === true &&
        missingOptRes.data?.salary === null &&
        missingOptRes.data?.referralUrl === null &&
        Array.isArray(missingOptRes.data?.skills),
      'Handles null optional fields gracefully without crashes',
      missingOptRes.message
    );

    // 5. Long Description Test
    console.log('\n5. Testing Long Description Handling...');
    const longDesc = 'Paragraph 1: Welcome to SarathiEdTech.\n\n'.repeat(100);
    const longDescRes = await createJob({
      title: 'Staff Architect Leader',
      companyName: 'Big Enterprise',
      location: 'Bangalore',
      employmentType: 'Full-time',
      experience: '10+ yrs',
      description: longDesc,
      skills: 'Architecture, Cloud, Distributed Systems',
      applicationUrl: 'https://enterprise.com/careers/staff-arch',
      status: JobStatus.PUBLISHED,
    }, opt);
    if (longDescRes.data?.id) createdIds.push(longDescRes.data.id);

    assert(
      longDescRes.success === true && (longDescRes.data?.description.length ?? 0) > 3000,
      'Long job descriptions (3000+ chars) store and retrieve safely',
      `Length: ${longDescRes.data?.description.length}`
    );

    // Cleanup test data
    console.log('\nCleaning up test job listings...');
    for (const id of createdIds) {
      await deleteJob(id, opt);
    }

    console.log(`\n=== PHASE 2 TEST SUMMARY: ${passedCount}/${testCount} TESTS PASSED ===`);

    if (passedCount !== testCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unhandled Phase 2 Test Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
