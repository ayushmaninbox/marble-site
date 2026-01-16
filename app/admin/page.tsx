'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        // Store auth state in localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-[-200px] -z-10 h-[360px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
      <div className="pointer-events-none absolute right-[-120px] top-1/2 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.3),_transparent_60%)]" />
      
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.8)] backdrop-blur">
          <h1 className="bg-gradient-to-r from-slate-50 via-blue-200 to-sky-300 bg-clip-text text-center text-3xl font-semibold text-transparent">
            Admin Login
          </h1>
          <p className="mt-2 text-center text-xs text-slate-400">
            Shree Radhe Marble & Granite
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                placeholder="Enter username"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="Enter password"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/60 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-slate-400 transition-colors hover:text-slate-100">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
