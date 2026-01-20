'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface SiteHeaderProps {
  isRevealed?: boolean;
  setIsQuoteOpen?: (isOpen: boolean) => void;
}

export default function SiteHeader({ isRevealed = true, setIsQuoteOpen }: SiteHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Product' },
    { href: '/blogs', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={isRevealed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-red-100 shadow-md shadow-slate-200/50"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex flex-col">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 flex-shrink-0">
              <img
                src="/Assets/logo_new.png"
                alt="Shree Radhe Marble Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-red-700 transition-colors">
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${isActive(link.href)
                ? 'text-red-600'
                : 'text-slate-600 hover:text-red-600'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {setIsQuoteOpen ? (
            <button
              onClick={() => setIsQuoteOpen(true)}
              className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
            >
              Get a Quote
            </button>
          ) : (
            <Link
              href="/contact"
              className="hidden md:inline-flex px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
            >
              Get a Quote
            </Link>
          )}

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
