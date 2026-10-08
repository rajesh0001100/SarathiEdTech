import React from 'react';
import { AnalyticsSummary } from '@/lib/actions/tracking';

interface AnalyticsCardsProps {
  summary: AnalyticsSummary;
}

export default function AnalyticsCards({ summary }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
          Total Jobs
        </span>
        <div className="text-2xl font-bold text-gray-900">{summary.totalJobs}</div>
        <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
          {summary.publishedJobs} Published
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
          Total Views
        </span>
        <div className="text-2xl font-bold text-blue-600">{summary.totalViews}</div>
        <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
          Page impressions
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
          Total Apply Clicks
        </span>
        <div className="text-2xl font-bold text-indigo-600">{summary.totalClicks}</div>
        <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
          Redirects to external portals
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
          Apply CTR %
        </span>
        <div className="text-2xl font-bold text-purple-600">{summary.averageCtr}%</div>
        <span className="text-xs text-gray-500 font-medium mt-1 inline-block">
          Click-Through Rate
        </span>
      </div>
    </div>
  );
}
