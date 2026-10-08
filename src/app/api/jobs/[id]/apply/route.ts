import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        applicationUrl: true,
        referralUrl: true,
      },
    });

    if (!job || job.status !== JobStatus.PUBLISHED) {
      return NextResponse.json(
        { error: 'Job opening not found or no longer active' },
        { status: 404 }
      );
    }

    // Record application click
    await prisma.$transaction([
      prisma.job.update({
        where: { id: job.id },
        data: { clicksCount: { increment: 1 } },
      }),
      prisma.jobClick.create({
        data: { jobId: job.id },
      }),
    ]);

    const targetUrl = job.referralUrl && job.referralUrl.trim() !== ''
      ? job.referralUrl.trim()
      : job.applicationUrl.trim();

    // Security URL validation to prevent open redirect vulnerabilities
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Invalid URL scheme');
      }
    } catch {
      return NextResponse.json(
        { error: 'Configured application URL is invalid' },
        { status: 400 }
      );
    }

    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error('Error in apply redirect handler:', error);
    return NextResponse.json(
      { error: 'Failed to process redirect' },
      { status: 500 }
    );
  }
}
