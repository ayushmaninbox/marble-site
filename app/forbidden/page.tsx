'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] top-[5%] h-[400px] w-[400px] rounded-full bg-red-100/30 blur-3xl" />
        <div className="absolute right-[10%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-stone-100 relative z-10 mx-auto">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-14V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="absolute -inset-4 bg-red-100/50 blur-2xl rounded-full -z-10" />
        </div>

        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4 uppercase tracking-tight">
          Access Denied
        </h1>
        
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
          You don't have the necessary permissions to access this page. If you believe this is an error, please contact your system administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/admin" 
            className="px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 active:scale-95"
          >
            Go to Login
          </Link>
          <Link 
            href="/" 
            className="px-8 py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-full border border-stone-200 hover:bg-stone-50 transition-all active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="mt-16 opacity-30 select-none pointer-events-none">
        <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">
          Shree Radhe Marble & Granite
        </div>
      </div>
    </div>
  );
}
