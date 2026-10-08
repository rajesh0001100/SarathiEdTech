import { createJob, deleteJob, getJobs } from '../src/lib/actions/job';
import { trackJobView, trackJobClick, getAnalyticsSummary } from '../src/lib/actions/tracking';
import { prisma } from '../src/lib/prisma';
import { JobStatus } from '@prisma/client';

async function runPhase3Tests() {
  console.log('=== STARTING PHASE 3 SEARCH, TRACKING & ANALYTICS TESTS ===\n');
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
    // Setup test jobs
    console.log('1. Setting up test jobs...');
    const job1 = await createJob({
      title: 'DevOps Cloud Engineer',
      companyName: 'CloudTech Solutions',
      location: 'Bangalore',
      employmentType: 'Full-time',
      experience: '3-5 yrs',
      salary: '₹15-20 LPA',
      description: 'AWS and Kubernetes DevOps engineer role.',
      skills: 'AWS, Docker, Kubernetes, Terraform',
      applicationUrl: 'https://cloudtech.com/careers/devops',
      status: JobStatus.PUBLISHED,
    }, opt);
    if (job1.data?.id) createdIds.push(job1.data.id);

    const job2 = await createJob({
      title: 'UI/UX Product Designer',
      companyName: 'Design Studio',
      location: 'Remote',
      employmentType: 'Contract',
      experience: '1-3 yrs',
      description: 'Figma and UI design specialist.',
      skills: 'Figma, UI Design, Wireframing',
      applicationUrl: 'https://designstudio.com/jobs/designer',
      status: JobStatus.PUBLISHED,
    }, opt);
    if (job2.data?.id) createdIds.push(job2.data.id);

    // 1. Search Test by Title & Skill
    console.log('\n2. Testing Search Functionality...');
    const searchResultTitle = await getJobs({ status: JobStatus.PUBLISHED, search: 'DevOps' });
    const searchResultCompany = await getJobs({ status: JobStatus.PUBLISHED, search: 'Design Studio' });

    assert(
      searchResultTitle.some((j) => j.id === job1.data?.id) &&
        searchResultCompany.some((j) => j.id === job2.data?.id),
      'Search finds jobs by title and company',
      `Title count: ${searchResultTitle.length}, Company count: ${searchResultCompany.length}`
    );

    // 2. View Tracking Test
    console.log('\n3. Testing Job View Tracking...');
    const targetJobId = job1.data?.id ?? '';
    const initialJobState = await prisma.job.findUnique({ where: { id: targetJobId } });
    const initialViews = initialJobState?.viewsCount ?? 0;

    await trackJobView(targetJobId);
    await trackJobView(targetJobId);

    const updatedJobState = await prisma.job.findUnique({ where: { id: targetJobId } });
    const viewsRecordCount = await prisma.jobView.count({ where: { jobId: targetJobId } });

    assert(
      (updatedJobState?.viewsCount ?? 0) === initialViews + 2 && viewsRecordCount === 2,
      'View tracking increments viewsCount and creates JobView records',
      `Views before: ${initialViews}, Views after: ${updatedJobState?.viewsCount}`
    );

    // 3. Apply Click Tracking Test
    console.log('\n4. Testing Job Apply Click Tracking...');
    const initialClicks = initialJobState?.clicksCount ?? 0;

    await trackJobClick(targetJobId);

    const updatedJobAfterClick = await prisma.job.findUnique({ where: { id: targetJobId } });
    const clicksRecordCount = await prisma.jobClick.count({ where: { jobId: targetJobId } });

    assert(
      (updatedJobAfterClick?.clicksCount ?? 0) === initialClicks + 1 && clicksRecordCount === 1,
      'Click tracking increments clicksCount and creates JobClick records',
      `Clicks before: ${initialClicks}, Clicks after: ${updatedJobAfterClick?.clicksCount}`
    );

    // 4. Analytics Summary Test
    console.log('\n5. Testing Analytics Summary Calculation...');
    const analytics = await getAnalyticsSummary();

    assert(
      analytics.totalJobs >= 2 &&
        analytics.publishedJobs >= 2 &&
        analytics.totalViews >= 2 &&
        analytics.totalClicks >= 1 &&
        analytics.averageCtr > 0,
      'Analytics summary calculates jobs, published count, total views, total clicks, and CTR %',
      `Views: ${analytics.totalViews}, Clicks: ${analytics.totalClicks}, CTR: ${analytics.averageCtr}%`
    );

    // Cleanup
    console.log('\nCleaning up test jobs...');
    for (const id of createdIds) {
      await deleteJob(id, opt);
    }

    console.log(`\n=== PHASE 3 TEST SUMMARY: ${passedCount}/${testCount} TESTS PASSED ===`);

    if (passedCount !== testCount) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unhandled Phase 3 Test Error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase3Tests();
