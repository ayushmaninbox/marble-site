'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Blog, AdminRole } from '@/lib/types';
import StatsCard from '@/components/admin/StatsCard';
import PaginationControls from '@/components/admin/PaginationControls';

// SVG Icons
const BlogIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CommentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if user has access
    const userInfo = localStorage.getItem('adminUser');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        const allowedRoles: AdminRole[] = ['super_admin', 'admin', 'content_writer'];
        if (!allowedRoles.includes(parsed.role)) {
          router.push('/admin/dashboard');
          return;
        }
      } catch {
        router.push('/admin');
        return;
      }
    } else {
      router.push('/admin');
      return;
    }
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) return setFormError('Title is required');
    if (!formData.excerpt.trim()) return setFormError('Excerpt is required');
    if (!formData.content.trim()) return setFormError('Content is required');
    if (!formData.author.trim()) return setFormError('Author is required');

    setFormSubmitting(true);

    try {
      if (editingBlog) {
        const response = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
      } else {
        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
      }

      await fetchBlogs();
      closeForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save blog');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchBlogs();
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      alert('Failed to delete blog');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} posts?`)) return;
    
    try {
      for (const id of selectedIds) {
        await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      }
      setSelectedIds([]);
      await fetchBlogs();
    } catch (error) {
      alert('Failed to delete posts');
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(selectedIds.length === paginatedBlogs.length ? [] : paginatedBlogs.map(b => b.id));
  };

  const openAddForm = () => {
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '', coverImage: '', author: '' });
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      author: blog.author,
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '', coverImage: '', author: '' });
    setFormError('');
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.author.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = filteredBlogs.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

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
          <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage blog posts and articles</p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          <span>+</span> New Post
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard 
           title="Total Posts" 
           value={blogs.length} 
           icon={<BlogIcon />} 
           iconBgColor="bg-purple-50"
           iconColor="text-purple-600"
        />
        <StatsCard 
           title="Total Likes" 
           value={blogs.reduce((sum, b) => sum + b.likes, 0)} 
           icon={<HeartIcon />} 
           iconBgColor="bg-red-50"
           iconColor="text-red-600"
        />
        <StatsCard 
           title="Total Comments" 
           value={blogs.reduce((sum, b) => sum + b.comments.length, 0)} 
           icon={<CommentIcon />} 
           iconBgColor="bg-blue-50"
           iconColor="text-blue-600"
        />
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BlogIcon /> BLOG POSTS
          </h3>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by title or author..."
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


      <PaginationControls 
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemName="posts"
      />

      {selectedIds.length > 0 && (
        <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">{selectedIds.length} selected</span>
            </div>

            <div className="h-4 w-px bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          </div>

          <button
            className="text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
            onClick={() => setSelectedIds([])}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Blogs Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={paginatedBlogs.length > 0 && selectedIds.length === paginatedBlogs.length}
                  onChange={toggleAll}
                  className="rounded border-stone-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Post</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Author</th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Likes</th>
              <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Comments</th>
              <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Created</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {paginatedBlogs.map((blog) => (
              <tr key={blog.id} className={`hover:bg-stone-50/50 ${selectedIds.includes(blog.id) ? 'bg-red-50/20' : ''}`}>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(blog.id)}
                    onChange={() => toggleSelection(blog.id)}
                    className="rounded border-stone-300 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {blog.coverImage ? (
                      <img 
                        src={blog.coverImage} 
                        alt="" 
                        className="h-10 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-14 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
                        <BlogIcon />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-slate-900 line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{blog.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{blog.author}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-red-600">
                    <HeartIcon /> {blog.likes}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                    <CommentIcon /> {blog.comments.length}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-500">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditForm(blog)}
                      className="text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedBlogs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No blog posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Blog Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
              </h2>
              <button onClick={closeForm} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-slate-500">
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Blog post title"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description for preview..."
                  rows={2}
                  className={inputClasses + " resize-none"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Content (Markdown supported)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  rows={8}
                  className={inputClasses + " resize-none font-mono text-xs"}
                />
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
                  {formSubmitting ? 'Saving...' : (editingBlog ? 'Save Changes' : 'Publish Post')}
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
    </main>
  );
}
