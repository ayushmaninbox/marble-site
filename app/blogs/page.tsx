'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Blog } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

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
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 text-slate-900">
      {/* Header - Shared Component */}
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section with Decorative Brackets */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block relative mb-6">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-slate-900 uppercase">
                Insights & Inspiration
              </h1>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-8">
              Explore expert tips, trends, and guides to help you create stunning spaces with premium marble and tiles.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {blogs.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                No blog posts yet. Check back soon!
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                      <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)] hover:shadow-[0_28px_70px_rgba(59,130,246,0.15)] transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
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
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Footer - Same as Main Site */}
      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />
    </div>
  );
}
