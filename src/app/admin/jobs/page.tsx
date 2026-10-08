import React, { Suspense } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/actions/job';
import { JobStatus } from '@prisma/client';
import JobList from '@/components/admin/JobList';

export const instant = false;

interface AdminJobsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

async function AdminJobsListContent({ searchParams }: { searchParams: Promise<{ status?: string; search?: string }> }) {
  const { status, search } = await searchParams;

  const validStatus = status && Object.values(JobStatus).includes(status as JobStatus)
    ? (status as JobStatus)
    : undefined;

  const jobs = await getJobs({
    status: validStatus,
    search: search && search.trim() !== '' ? search.trim() : undefined,
  });

  return <JobList jobs={jobs} />;
}

export default function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Search, filter, edit, publish, or delete job opportunities.
            </p>
          </div>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            + Post New Job
          </Link>
        </div>

        {/* Filter Toolbar */}
        <form method="GET" className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-72">
            <input
              type="text"
              name="search"
              placeholder="Search by title or company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <select
              name="status"
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={JobStatus.PUBLISHED}>Published</option>
              <option value={JobStatus.UNPUBLISHED}>Unpublished</option>
              <option value={JobStatus.DRAFT}>Draft</option>
              <option value={JobStatus.EXPIRED}>Expired</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-md hover:bg-gray-900 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>

        <Suspense fallback={<div className="bg-white p-8 text-center rounded border">Loading jobs list...</div>}>
          <AdminJobsListContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
