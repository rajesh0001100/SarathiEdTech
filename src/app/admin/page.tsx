import React, { Suspense } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/actions/job';
import { getAnalyticsSummary } from '@/lib/actions/tracking';
import JobList from '@/components/admin/JobList';
import AnalyticsCards from '@/components/admin/AnalyticsCards';

export const instant = false;

async function AdminDashboardContent() {
  const [jobs, analytics] = await Promise.all([
    getJobs(),
    getAnalyticsSummary(),
  ]);

  return (
    <div className="space-y-6">
      <AnalyticsCards summary={analytics} />
      <JobList jobs={jobs} />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage job opportunities, track views & application redirects.
            </p>
          </div>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            + Post New Job
          </Link>
        </div>

        <Suspense fallback={<div className="bg-white p-8 text-center rounded border">Loading analytics & jobs data...</div>}>
          <AdminDashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
