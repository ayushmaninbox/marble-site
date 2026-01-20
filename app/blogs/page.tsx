'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Blog } from '@/lib/types';

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

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-400 shadow-sm" />
              <span className="text-lg font-bold text-slate-900 font-serif">Shree Radhe</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-red-600 transition">Home</Link>
              <Link href="/products" className="text-sm font-medium text-slate-600 hover:text-red-600 transition">Products</Link>
              <Link href="/blogs" className="text-sm font-medium text-red-600">Blog</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 font-serif mb-4">
            Insights & Inspiration
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore expert tips, trends, and guides to help you create stunning spaces with premium marble and tiles.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No blog posts yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {blog.coverImage ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-red-100 to-orange-50 flex items-center justify-center">
                        <div className="text-red-300 text-4xl font-serif">{blog.title.charAt(0)}</div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>By {blog.author}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <HeartIcon /> {blog.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <CommentIcon /> {blog.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-10 w-10 mx-auto rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-400 mb-4" />
          <p className="text-slate-400 text-sm">
            © 2026 Shree Radhe Marble & Granite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
