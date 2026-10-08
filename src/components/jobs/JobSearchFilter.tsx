'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function JobSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [employmentType, setEmploymentType] = useState(searchParams.get('type') ?? '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (employmentType) params.set('type', employmentType);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleClear = () => {
    setSearch('');
    setEmploymentType('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Search Keyword / Role / Company
          </label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Frontend Engineer, React, Acme Corp..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 pt-2">
        {(search || employmentType) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
          >
            Clear Filters
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
        >
          Find Jobs
        </button>
      </div>
    </form>
  );
}
