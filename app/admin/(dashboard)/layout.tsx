'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// SVG Icons
const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const BoxIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    // Get user info
    const userInfo = localStorage.getItem('adminUser');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setUserRole(parsed.role || '');
        setUserId(parsed.id || '');
      } catch {}
    }

    // Fetch counts for sidebar badges
    const fetchCounts = async () => {
      try {
        const [productsRes, enquiriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/enquiries')
        ]);
        const products = await productsRes.json();
        const enquiries = await enquiriesRes.json();
        setProductCount(products.length);
        setEnquiryCount(enquiries.length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordForm.new.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordSubmitting(true);
    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordForm({ current: '', new: '', confirm: '' });
        alert('Password changed successfully');
      } else {
        const data = await response.json();
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch {
      setPasswordError('Failed to change password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: DashboardIcon,
      isActive: pathname === '/admin/dashboard'
    },
    { 
      name: 'Products', 
      href: '/admin/products', 
      icon: BoxIcon, 
      badge: productCount,
      badgeColor: 'bg-stone-100 text-stone-600',
      isActive: pathname === '/admin/products'
    },
    { 
      name: 'Enquiries', 
      href: '/admin/enquiries', 
      icon: ChatIcon, 
      badge: enquiryCount,
      badgeColor: 'bg-red-500 text-white',
      isActive: pathname === '/admin/enquiries'
    },
    ...(userRole === 'super_admin' ? [{ 
      name: 'Users', 
      href: '/admin/users', 
      icon: UsersIcon,
      isActive: pathname === '/admin/users'
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-400 shadow-sm" />
            <div>
              <div className="text-sm font-bold text-slate-900 font-serif">Admin Panel</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Shree Radhe Marble</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                item.isActive 
                  ? 'bg-red-50 text-red-700' 
                  : 'text-slate-500 hover:bg-stone-50 hover:text-slate-900'
              }`}
            >
              <item.icon />
              {item.name}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <hr className="my-3 border-stone-100" />

          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-stone-50 hover:text-slate-900 transition-colors"
          >
            <GlobeIcon />
            View Website
          </a>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-stone-50 hover:text-slate-900 transition-colors"
          >
            <KeyIcon />
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-stone-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-stone-200 hover:bg-stone-50"
            >
              <MenuIcon />
            </button>
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-400" />
          </div>
        </header>

        {children}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
              <button 
                onClick={() => { setShowPasswordModal(false); setPasswordForm({ current: '', new: '', confirm: '' }); setPasswordError(''); }}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-slate-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  required
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {passwordError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {passwordSubmitting ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setPasswordForm({ current: '', new: '', confirm: '' }); setPasswordError(''); }}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
