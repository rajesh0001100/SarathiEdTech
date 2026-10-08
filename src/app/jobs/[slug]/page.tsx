import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getJobBySlug } from '@/lib/actions/job';
import { JobStatus } from '@prisma/client';
import ApplyButton from '@/components/jobs/ApplyButton';
import ViewTracker from '@/components/jobs/ViewTracker';

export const instant = false;

interface JobDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JobDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || job.status !== JobStatus.PUBLISHED) {
    return {
      title: 'Job Not Found | SarathiEdTech',
      robots: { index: false, follow: false },
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const canonicalUrl = `${appUrl}/jobs/${job.slug}`;

  return {
    title: `${job.title} at ${job.companyName} | SarathiEdTech`,
    description: `Apply for ${job.title} opportunity at ${job.companyName} in ${job.location}. Experience required: ${job.experience}. Apply directly on official employer portal.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${job.title} - ${job.companyName}`,
      description: `Job Opportunity: ${job.title} at ${job.companyName} (${job.location}). Experience: ${job.experience}.`,
      url: canonicalUrl,
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  // Do not expose or index unpublished, draft, or expired jobs publicly
  if (!job || job.status !== JobStatus.PUBLISHED) {
    notFound();
  }

  const postedDate = job.publishedAt
    ? new Date(job.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  // Schema.org JobPosting JSON-LD for Search Engine Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt ? new Date(job.publishedAt).toISOString() : new Date(job.createdAt).toISOString(),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    employmentType: job.employmentType.toUpperCase().replace('-', '_'),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* View Tracker Component */}
      <ViewTracker jobId={job.id} />

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            ← Back to all job opportunities
          </Link>
        </div>

        {/* Main Job Detail Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md">
                {job.companyName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {job.title}
              </h1>
              <p className="text-xs text-gray-400">
                Posted on {postedDate} • Verified Listing
              </p>
            </div>

            {/* Apply Button Component */}
            <div className="flex-shrink-0">
              <ApplyButton
                applicationUrl={job.applicationUrl}
                referralUrl={job.referralUrl}
                companyName={job.companyName}
                title={job.title}
              />
            </div>
          </div>

          {/* Key Job Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 font-medium">Location</span>
              <span className="text-sm font-bold text-gray-800">📍 {job.location}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 font-medium">Job Type</span>
              <span className="text-sm font-bold text-gray-800">💼 {job.employmentType}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 font-medium">Experience</span>
              <span className="text-sm font-bold text-gray-800">🎯 {job.experience}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <span className="block text-xs text-gray-400 font-medium">Salary / Compensation</span>
              <span className="text-sm font-bold text-gray-800">{job.salary || 'As per industry standards'}</span>
            </div>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Required Skills & Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">
            Job Description & Responsibilities
          </h2>
          <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Bottom Apply CTA Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">Interested in this role at {job.companyName}?</h3>
            <p className="text-xs text-blue-200">
              Click apply below to complete your application on the official employer site.
            </p>
          </div>
          <ApplyButton
            applicationUrl={job.applicationUrl}
            referralUrl={job.referralUrl}
            companyName={job.companyName}
            title={job.title}
          />
        </div>
      </div>
    </div>
  );
}
