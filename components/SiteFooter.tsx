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
                  src="/Assets/logo_new.png"
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
              <li><button onClick={() => setIsQuoteOpen(true)} className="hover:text-red-400 transition-colors">Get a Quote</button></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-base font-semibold text-white mb-5">Products</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/products?category=Italian%20Marble" className="hover:text-red-400 transition-colors">Italian Marble</Link></li>
              <li><Link href="/products?category=Indian%20Granite" className="hover:text-red-400 transition-colors">Indian Granite</Link></li>
              <li><Link href="/products?category=Designer%20Tiles" className="hover:text-red-400 transition-colors">Designer Tiles</Link></li>
              <li><Link href="/products?category=Handicraft%20Items" className="hover:text-red-400 transition-colors">Handicraft Items</Link></li>
              <li><Link href="/products?category=Custom%20Fabrication" className="hover:text-red-400 transition-colors">Custom Fabrication</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            {/* Google Maps Embed - Square */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-slate-600 mb-5 aspect-square max-w-[180px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4095.993942801531!2d91.3212724!3d23.8423724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f3ece8c5082f%3A0x3560794d63797140!2sShree%20Radhe%20Marble%20%26%20Granite!5e1!3m2!1sen!2sin!4v1768924787517!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Radhe Marble & Granite Location"
                className="w-full h-full"
              />
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-lg mt-0.5">📍</span>
                <span>Godown: AA Road,<br />Kashipur Bazar, Agartala-799008</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 text-lg">📱</span>
                <a
                  href="https://wa.me/918794946566"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-400 transition-colors"
                >
                  +91 8794946566 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-400 text-lg">✉️</span>
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
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-red-400 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-red-400 transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
