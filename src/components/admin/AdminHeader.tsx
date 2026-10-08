'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutAdminAction } from '@/lib/actions/auth';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-sm">
                S
              </span>
              <span className="font-bold text-sm tracking-tight">
                Sarathi<span className="text-blue-400">Admin</span>
              </span>
            </Link>

            <nav className="hidden sm:flex space-x-4 text-xs font-medium text-gray-300">
              <Link href="/admin" className="hover:text-white transition-colors">
                Dashboard & Analytics
              </Link>
              <Link href="/admin/jobs" className="hover:text-white transition-colors">
                Job Management
              </Link>
              <Link href="/admin/jobs/new" className="hover:text-white transition-colors">
                + Post New Job
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              View Public Website ↗
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
