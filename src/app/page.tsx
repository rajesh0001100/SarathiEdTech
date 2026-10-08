import React, { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { JobStatus, Job } from '@prisma/client';
import JobCard from '@/components/jobs/JobCard';
import JobSearchFilter from '@/components/jobs/JobSearchFilter';

export const instant = false;

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    type?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 9;

async function PublicJobsList({ searchParams }: { searchParams: Promise<{ search?: string; type?: string; page?: string }> }) {
  const { search, type, page } = await searchParams;

  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const whereClause: Record<string, unknown> = {
    status: JobStatus.PUBLISHED,
  };

  if (type && type.trim()) {
    whereClause.employmentType = type;
  }

  if (search && search.trim()) {
    whereClause.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { companyName: { contains: search.trim(), mode: 'insensitive' } },
      { description: { contains: search.trim(), mode: 'insensitive' } },
      { skills: { hasSome: [search.trim()] } },
    ];
  }

  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.job.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm my-8 max-w-2xl mx-auto">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Job Opportunities Found</h3>
        <p className="text-gray-500 text-sm mb-6">
          We couldn&apos;t find any published job listings matching your search criteria. Try clearing your filters or search terms.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow"
        >
          View All Opportunities
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">{jobs.length}</span> of{' '}
          <span className="font-bold text-gray-900">{totalCount}</span> verified openings
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {jobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6 pb-12">
          {currentPage > 1 && (
            <Link
              href={`/?page=${currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${type ? `&type=${encodeURIComponent(type)}` : ''}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Previous
            </Link>
          )}

          <span className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`/?page=${currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ''}${type ? `&type=${encodeURIComponent(type)}` : ''}`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold text-blue-200">
            <span>✨ 100% Free & Direct Application Links</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Verified <span className="text-blue-300">Job Opportunities</span>
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            SarathiEdTech curated job openings from leading companies. Read complete descriptions and apply directly on official employer portals.
          </p>
        </div>
      </section>

      {/* Main Jobs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading search filters...</div>}>
          <JobSearchFilter />
        </Suspense>

        <Suspense fallback={<div className="text-center py-16 text-gray-500">Loading job opportunities...</div>}>
          <PublicJobsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
