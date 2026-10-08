'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, JobStatus } from '@prisma/client';
import { deleteJob, publishJob, unpublishJob } from '@/lib/actions/job';

interface JobListProps {
  jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
  const router = useRouter();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoadingId(id);
    try {
      const res = await deleteJob(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting job');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleTogglePublish = async (job: Job) => {
    setActionLoadingId(job.id);
    try {
      const res = job.status === JobStatus.PUBLISHED
        ? await unpublishJob(job.id)
        : await publishJob(job.id);

      if (res.success) {
        router.refresh();
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating publish status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PUBLISHED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Published</span>;
      case JobStatus.UNPUBLISHED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">Unpublished</span>;
      case JobStatus.EXPIRED:
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Expired</span>;
      case JobStatus.DRAFT:
      default:
        return <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Draft</span>;
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-lg mb-4">No jobs created yet.</p>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Create First Job
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              <th className="px-6 py-3">Job Title & Company</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Views</th>
              <th className="px-6 py-3 text-center">Apply Clicks</th>
              <th className="px-6 py-3 text-center">CTR %</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {jobs.map((job) => {
              const ctr = job.viewsCount > 0
                ? ((job.clicksCount / job.viewsCount) * 100).toFixed(1)
                : '0.0';

              return (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{job.title}</div>
                    <div className="text-gray-500 text-xs">{job.companyName} • {job.location}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                  <td className="px-6 py-4 text-center font-medium text-gray-800">
                    👁️ {job.viewsCount}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-indigo-700">
                    ↗️ {job.clicksCount}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700">
                    {ctr}%
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleTogglePublish(job)}
                      disabled={actionLoadingId === job.id}
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        job.status === JobStatus.PUBLISHED
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-300'
                      }`}
                    >
                      {job.status === JobStatus.PUBLISHED ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/admin/jobs/${job.id}/edit`}
                      className="inline-block text-xs px-2.5 py-1 rounded font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      disabled={actionLoadingId === job.id}
                      className="text-xs px-2.5 py-1 rounded font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
