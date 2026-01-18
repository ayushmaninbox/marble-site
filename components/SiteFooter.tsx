import Link from 'next/link';
import { motion } from 'framer-motion';

interface SiteFooterProps {
  setIsQuoteOpen: (isOpen: boolean) => void;
}

export default function SiteFooter({ setIsQuoteOpen }: SiteFooterProps) {
  return (
    <footer className="mt-0 relative border-t border-slate-200/50 bg-slate-900 pt-16 pb-8 text-slate-200 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/footer_image.png" 
          alt="Footer Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-orange-400 shadow-md group-hover:scale-105 transition-transform" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-sm font-bold text-transparent">
                Shree Radhe Marble
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium marble, granite, and tiles for residential and commercial projects. Trusted by architects and designers since 2004.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/" className="hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-red-400 transition-colors">Products</Link></li>
              <li><button onClick={() => setIsQuoteOpen(true)} className="hover:text-red-400 transition-colors">Get a Quote</button></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products?category=Italian%20Marble" className="hover:text-red-400 transition-colors">Italian Marble</Link></li>
              <li><Link href="/products?category=Indian%20Granite" className="hover:text-red-400 transition-colors">Indian Granite</Link></li>
              <li><Link href="/products?category=Designer%20Tiles" className="hover:text-red-400 transition-colors">Designer Tiles</Link></li>
              <li><Link href="/products?category=Handicraft%20Items" className="hover:text-red-400 transition-colors">Handicraft Items</Link></li>
              <li><Link href="/products?category=Custom%20Fabrication" className="hover:text-red-400 transition-colors">Custom Fabrication</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">📍</span>
                <span>123 Stone Market Road,<br />Kishangarh, Rajasthan 305801<br />India</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">📞</span>
                <a href="tel:+911234567890" className="hover:text-red-400 transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">✉️</span>
                <a href="mailto:info@shreeradhemarble.com" className="hover:text-red-400 transition-colors">info@shreeradhemarble.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © 2026 Shree Radhe Marble &amp; Granite. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-red-400 transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-red-400 transition-colors text-xs">Terms of Service</a>
            <a 
              href="https://wa.me/1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition-transform"
              aria-label="Chat on WhatsApp"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
