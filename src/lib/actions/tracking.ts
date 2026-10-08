'use server';

import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

export async function trackJobView(jobId: string): Promise<boolean> {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true },
    });

    if (!job || job.status !== JobStatus.PUBLISHED) {
      return false;
    }

    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { viewsCount: { increment: 1 } },
      }),
      prisma.jobView.create({
        data: { jobId },
      }),
    ]);

    return true;
  } catch (error) {
    console.error('Error tracking job view:', error);
    return false;
  }
}

export async function trackJobClick(jobId: string): Promise<boolean> {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true },
    });

    if (!job || job.status !== JobStatus.PUBLISHED) {
      return false;
    }

    await prisma.$transaction([
      prisma.job.update({
        where: { id: jobId },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.jobClick.create({
        data: { jobId },
      }),
    ]);

    return true;
  } catch (error) {
    console.error('Error tracking job click:', error);
    return false;
  }
}

export interface AnalyticsSummary {
  totalJobs: number;
  publishedJobs: number;
  draftJobs: number;
  unpublishedJobs: number;
  expiredJobs: number;
  totalViews: number;
  totalClicks: number;
  averageCtr: number;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const [
      totalJobs,
      publishedJobs,
      draftJobs,
      unpublishedJobs,
      expiredJobs,
      viewsAggregate,
      clicksAggregate,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: JobStatus.PUBLISHED } }),
      prisma.job.count({ where: { status: JobStatus.DRAFT } }),
      prisma.job.count({ where: { status: JobStatus.UNPUBLISHED } }),
      prisma.job.count({ where: { status: JobStatus.EXPIRED } }),
      prisma.job.aggregate({ _sum: { viewsCount: true } }),
      prisma.job.aggregate({ _sum: { clicksCount: true } }),
    ]);

    const totalViews = viewsAggregate._sum.viewsCount ?? 0;
    const totalClicks = clicksAggregate._sum.clicksCount ?? 0;
    const averageCtr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    return {
      totalJobs,
      publishedJobs,
      draftJobs,
      unpublishedJobs,
      expiredJobs,
      totalViews,
      totalClicks,
      averageCtr,
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return {
      totalJobs: 0,
      publishedJobs: 0,
      draftJobs: 0,
      unpublishedJobs: 0,
      expiredJobs: 0,
      totalViews: 0,
      totalClicks: 0,
      averageCtr: 0,
    };
  }
}
