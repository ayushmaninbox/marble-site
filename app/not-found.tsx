'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { useState } from 'react';

export default function NotFound() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 flex flex-col">
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 relative"
          >
            <div className="relative z-10 pt-12 md:pt-20">
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">
                Lost in Elegance?
              </h2>
              <div className="h-1 w-20 bg-red-600 mx-auto mb-8" />
              <p className="text-slate-500 text-base md:text-lg font-light tracking-wide mb-12 max-w-md mx-auto leading-relaxed">
                The page you are looking for might have been moved, deleted, or never existed in our collection.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
          >
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Back to Showroom
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 border border-slate-200 text-slate-900 text-sm font-bold uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all"
            >
              Browse Collection
            </Link>
          </motion.div>
        </div>
      </main>

      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />
    </div>
  );
}
