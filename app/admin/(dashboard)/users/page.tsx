'use client';

import { useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '@/lib/types';

// SVG Icons
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

type SafeUser = Omit<AdminUser, 'passwordHash'>;

export default function UsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null);
  const [search, setSearch] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' as AdminRole,
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Password reset state
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Get current user from localStorage
    const userInfo = localStorage.getItem('adminUser');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        setCurrentUserId(parsed.id);
      } catch {}
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email.trim()) return setFormError('Email is required');
    if (!editingUser && !formData.password) return setFormError('Password is required');
    if (!editingUser && formData.password.length < 6) return setFormError('Password must be at least 6 characters');

    setFormSubmitting(true);

    try {
      if (editingUser) {
        // Update user role
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: formData.role }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
      } else {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
      }

      await fetchUsers();
      closeForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save user');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUserId || !newPassword) return;
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`/api/users/${resetPasswordUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        setResetPasswordUserId(null);
        setNewPassword('');
        alert('Password reset successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reset password');
      }
    } catch (error) {
      alert('Failed to reset password');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUserId) {
      alert('You cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'admin' });
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (user: SafeUser) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: '', role: user.role });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'admin' });
    setFormError('');
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const inputClasses = "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-500/20";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-6 bg-stone-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage admin panel access</p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          <span>+</span> Add User
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserIcon /> ADMIN USERS
          </h3>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Email</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Created</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Last Login</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50/50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{user.email}</span>
                    {user.id === currentUserId && (
                      <span className="text-xs bg-stone-100 text-slate-500 px-2 py-0.5 rounded">You</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === 'super_admin' 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {user.role === 'super_admin' && <ShieldIcon />}
                    {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditForm(user)}
                      className="text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setResetPasswordUserId(user.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Reset Password
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={closeForm} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-slate-500">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  disabled={!!editingUser}
                  className={inputClasses + (editingUser ? ' bg-stone-50' : '')}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className={inputClasses}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                  className={inputClasses}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Super Admins can manage other users
                </p>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : (editingUser ? 'Save Changes' : 'Add User')}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Reset Password</h2>
              <button onClick={() => { setResetPasswordUserId(null); setNewPassword(''); }} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-slate-500">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={inputClasses}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleResetPassword}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => { setResetPasswordUserId(null); setNewPassword(''); }}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
