'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAdminAction } from '@/lib/actions/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdminAction(email, password);
      if (res.success) {
        router.push(from);
        router.refresh();
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Admin Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@sarathiedtech.com"
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow transition-colors disabled:opacity-50"
      >
        {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-extrabold text-2xl shadow">
            S
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            SarathiEdTech Admin Portal
          </h2>
          <p className="text-xs text-gray-500">
            Sign in with authorized administrator credentials
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-sm text-gray-500">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
