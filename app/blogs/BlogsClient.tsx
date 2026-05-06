'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Blog } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const POSTS_PER_PAGE = 9;

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to the start of the grid with a slight offset for the header
    const yOffset = -100;
    const element = gridRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header - Shared Component */}
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <div className="text-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
              Insights & Inspiration
            </h1>
            <div className="h-1 w-20 bg-red-600 mx-auto mb-6" />
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light tracking-wide">
              Explore expert tips, trends, and guides to help you create stunning spaces with premium marble and tiles.
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 px-4 relative z-10 -mt-8">
           <div className="relative shadow-lg rounded-full">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-stone-200 bg-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" strokeWidth={1.5} />
           </div>
        </div>

        {/* Blog Grid */}
        <section ref={gridRef} className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {filteredBlogs.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 text-slate-400"
                >
                  {searchQuery ? 'No matching articles found.' : 'No blog posts yet. Check back soon!'}
                </motion.div>
              ) : (
                <motion.div
                  key={`page-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-16"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedBlogs.map((blog, index) => (
                      <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      >
                        <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                          <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-[0_18px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.08)] transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                            {blog.coverImage ? (
                              <div className="aspect-[16/9] overflow-hidden">
                                <img
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="aspect-[16/9] bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                                <div className="text-red-200 text-4xl font-serif">{blog.title.charAt(0)}</div>
                              </div>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                              <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                                {blog.title}
                              </h2>
                              <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2 leading-relaxed font-light">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-semibold text-slate-400">
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
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full border transition-all ${
                          currentPage === 1 
                            ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1">
                        {(() => {
                          const maxVisible = 5;
                          let start = 1;
                          let end = totalPages;

                          if (totalPages > maxVisible) {
                            start = Math.max(1, currentPage - 4);
                            end = Math.min(totalPages, start + maxVisible - 1);

                            if (end === totalPages) {
                              start = Math.max(1, end - maxVisible + 1);
                            }
                          }

                          return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                                currentPage === page
                                  ? 'bg-red-600 text-white shadow-md shadow-red-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          ));
                        })()}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full border transition-all ${
                          currentPage === totalPages 
                            ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                            : 'border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer - Same as Main Site */}
      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />

      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
