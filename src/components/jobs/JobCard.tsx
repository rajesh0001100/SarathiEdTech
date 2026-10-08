import React from 'react';
import Link from 'next/link';
import { Job } from '@prisma/client';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const postedDate = job.publishedAt
    ? new Date(job.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full group">
      <div>
        {/* Company & Posted Date */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {job.companyName}
            </span>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {postedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
        </h3>

        {/* Location & Experience & Type & Salary */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-md font-medium">
            📍 {job.location}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-md font-medium">
            💼 {job.employmentType}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-md font-medium">
            🎯 {job.experience}
          </span>
          {job.salary && (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-semibold border border-green-200">
              💰 {job.salary}
            </span>
          )}
        </div>

        {/* Skills Tag Cloud */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-xs text-gray-400 py-0.5">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Action */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Verified Opportunity
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
        >
          View Job Details →
        </Link>
      </div>
    </div>
  );
}
