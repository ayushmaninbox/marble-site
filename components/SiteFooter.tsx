import Link from 'next/link';
import { motion } from 'framer-motion';

interface SiteFooterProps {
  setIsQuoteOpen: (isOpen: boolean) => void;
}

export default function SiteFooter({ setIsQuoteOpen }: SiteFooterProps) {
  return (
    <footer className="mt-0 relative border-t border-slate-200/50 bg-slate-900 pt-20 pb-12 text-slate-200 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/footer_image.png"
          alt="Footer Background"
          className="w-full h-full object-cover"
        />
        {/* Darker overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/80 to-slate-900/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-8 sm:px-12 lg:px-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 flex-shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/assets/logo_new.png"
                  alt="Shree Radhe Marble Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-wide">
                  Shree Radhe
                </span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Marble & Granite
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Premium marble, granite, and tiles for residential and commercial projects. Trusted by architects and designers since 2004.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-red-400 transition-colors">Products</Link></li>
              <li><Link href="/blogs" className="hover:text-red-400 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-red-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-base font-semibold text-white mb-5">Products</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/products?category=Marbles" className="hover:text-red-400 transition-colors">Marbles</Link></li>
              <li><Link href="/products?category=Tiles" className="hover:text-red-400 transition-colors">Tiles</Link></li>
              <li><Link href="/products?category=Handicraft" className="hover:text-red-400 transition-colors">Handicrafts</Link></li>
              <li><Link href="/products?category=All" className="hover:text-red-400 transition-colors">View More</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-white mb-5">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Godown: AA Road,<br />Kashipur Bazar, Agartala-799008</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white flex-shrink-0">
                  <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                </svg>
                <a
                  href="https://wa.me/918794946566"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  +91 8794946566
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white flex-shrink-0">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=shreeradhesr@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  shreeradhesr@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2026 Shree Radhe Marble &amp; Granite. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
