'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SiteHeaderProps {
  isRevealed?: boolean;
  setIsQuoteOpen?: (isOpen: boolean) => void;
}

export default function SiteHeader({ isRevealed = true, setIsQuoteOpen }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Product' },
    { href: '/blogs', label: 'Blog' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={isRevealed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${scrolled || isMobileMenuOpen
            ? 'bg-white border-b border-red-100 shadow-md shadow-slate-200/50 py-3'
            : 'bg-white/95 backdrop-blur-sm border-b border-red-100/50 py-4'
          }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo Section */}
          <div className="flex flex-col z-50 relative">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                <img
                  src="/Assets/logo_new.png"
                  alt="Shree Radhe Marble Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-red-700 transition-colors">
                  Shree Radhe
                </h1>
                <p className="text-[9px] sm:text-[10px] text-red-600 uppercase tracking-[0.2em] mt-1 font-medium">
                  Marble & Granite
                </p>
              </div>
            </Link>
          </div>

          {/* Centered Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 absolute left-1/2 -translate-x-1/2">
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
          <div className="flex items-center gap-3 sm:gap-4 z-50 relative">
            {setIsQuoteOpen ? (
              <button
                onClick={() => {
                  setIsQuoteOpen(true);
                  setIsMobileMenuOpen(false);
                }}
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-slate-900 hover:text-red-600 transition-colors"
              aria-label="Toggle navigation"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-full h-0.5 bg-current transform transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-white md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 pt-20 pb-10">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-2xl font-light tracking-widest uppercase transition-all duration-300 ${isActive(link.href) ? 'text-red-600' : 'text-slate-900'
                } ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className={`pt-8 transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            style={{ transitionDelay: '400ms' }}
          >
            {setIsQuoteOpen ? (
              <button
                onClick={() => {
                  setIsQuoteOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="px-8 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-500/30"
              >
                Get a Quote
              </button>
            ) : (
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-8 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-500/30"
              >
                Get a Quote
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
