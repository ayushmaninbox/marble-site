'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { Blog, AdminRole } from '@/lib/types';
import { ArrowLeft, Save, Loader2, LayoutPanelLeft } from 'lucide-react';
import Link from 'next/link';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '', // Generated on server if empty
    excerpt: '',
    content: '',
    coverImage: '',
    author: '',
  });

  useEffect(() => {
    // Check auth
    const userInfo = localStorage.getItem('adminUser');
    if (!userInfo) {
      router.push('/admin');
      return;
    }
    
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

    if (id) {
      fetchBlog(id);
    } else {
      setIsLoading(false);
    }
  }, [id, router]);

  const fetchBlog = async (blogId: string) => {
    try {
      const response = await fetch('/api/blogs'); 
      // We fetch all blogs and filter for now as a safe default method
      
      const allBlogs: Blog[] = await response.json();
      const blog = allBlogs.find(b => b.id === blogId);

      if (blog) {
        setFormData({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          coverImage: blog.coverImage,
          author: blog.author,
        });
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const url = id ? `/api/blogs/${id}` : '/api/blogs';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-red-600 h-8 w-8" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blogs" 
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {id ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <LayoutPanelLeft className="w-3 h-3" />
              {id ? 'Editing existing post' : 'Creating a new entry'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 hidden sm:inline-block">
            {formData.content.length} characters
          </span>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
           {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
             <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post Title"
              className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:ring-0 p-0"
            />
          </div>

          <RichTextEditor 
            content={formData.content} 
            onChange={(html) => setFormData({ ...formData, content: html })} 
            className="min-h-[600px] flex-1 shadow-sm"
          />
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 border-b border-stone-100 pb-3">Post Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500/20"
                placeholder="Author Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500/20"
                placeholder="Short summary for preview cards..."
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
              <div className="flex gap-2">
                 <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500/20"
                  placeholder="https://..."
                />
              </div>
              {formData.coverImage && (
                <div className="mt-3 relative aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                  <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-red-600 h-8 w-8" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
