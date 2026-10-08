import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@prisma/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sarathiedtech.in';

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic published job routes
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const publishedJobs = await prisma.job.findMany({
      where: { status: JobStatus.PUBLISHED },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });

    jobRoutes = publishedJobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: job.updatedAt || job.publishedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap job routes:', error);
  }

  return [...staticRoutes, ...jobRoutes];
}
