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
        localStorage.setItem('isAdminAuthenticated', 'true');
        // Store user info for role-based features
        if (data.user) {
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          // Redirect based on role
          const role = data.user.role;
          if (['super_admin', 'admin'].includes(role)) {
            router.push('/admin/dashboard');
          } else if (role === 'content_writer') {
            router.push('/admin/blogs');
          } else if (role === 'product_manager') {
            router.push('/admin/products');
          } else if (role === 'enquiry_handler') {
            router.push('/admin/enquiries');
          } else {
            router.push('/admin/dashboard'); // Fallback
          }
        } else {
          router.push('/admin/dashboard');
        }
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
    <div className="relative flex min-h-screen items-center justify-center bg-stone-50 px-4 text-slate-900 sm:px-6">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute -left-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-red-100/50 blur-3xl" />
        <div className="absolute right-[10%] top-[20%] h-[350px] w-[350px] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] h-[300px] w-[300px] rounded-full bg-stone-100/60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-stone-200/50 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-14 w-14 flex-shrink-0">
              <img
                src="/Assets/logo_new.png"
                alt="Shree Radhe Marble Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-center text-2xl font-serif font-bold text-transparent">
            Admin Login
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500 font-medium tracking-wide">
            <span className="font-bold text-slate-900">Shree Radhe</span> <span className="uppercase text-red-600 tracking-wider">Marble & Granite</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                placeholder="Enter username"
                className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                placeholder="Enter password"
                className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-xs font-bold tracking-widest uppercase text-slate-400 transition-colors hover:text-red-600">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
