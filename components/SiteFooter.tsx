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
          className="w-full h-full object-cover"
        />
        {/* Red brand gradient overlay: Left (Red) to Right (Dark), lighter opacity */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/70 via-red-900/60 to-slate-900/80 mix-blend-multiply" />
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

            {/* Google Maps Embed - Square */}
            <div className="rounded-lg overflow-hidden shadow-lg border border-slate-700 mb-4 aspect-square max-w-[200px]">
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

            <ul className="space-y-3 text-xs text-slate-400">
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

          </div>
        </div>
      </div>
    </footer>
  );
}
