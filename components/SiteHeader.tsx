import Link from 'next/link';
import { motion } from 'framer-motion';

interface SiteHeaderProps {
  isRevealed?: boolean;
  setIsQuoteOpen: (isOpen: boolean) => void;
}

export default function SiteHeader({ isRevealed = true, setIsQuoteOpen }: SiteHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-red-100"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 border border-red-200 rounded-sm flex items-center justify-center p-1 bg-red-50 group-hover:border-red-300 transition-colors">
               <div className="h-full w-full bg-gradient-to-br from-red-600 to-orange-500 opacity-80" />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-slate-900 tracking-tight leading-none group-hover:text-red-700 transition-colors">
                Shree Radhe
              </h1>
              <p className="text-[10px] text-red-600 uppercase tracking-[0.2em] mt-1 font-medium">
                Marble & Granite
              </p>
            </div>
          </Link>
        </div>

        {/* Centered Navigation */}
        <nav className="hidden items-center gap-10 md:flex absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] text-slate-600 hover:text-red-600 uppercase transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-xs font-semibold tracking-[0.2em] text-slate-600 hover:text-red-600 uppercase transition-colors">
            Product
          </Link>
          <button
            onClick={() => setIsQuoteOpen(true)}
            className="text-xs font-semibold tracking-[0.2em] text-slate-600 hover:text-red-600 uppercase transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsQuoteOpen(true)}
             className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
           >
             Get a Quote
           </button>
           
           {/* Mobile Menu Button */}
           <button
            type="button"
            className="md:hidden text-slate-900"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
