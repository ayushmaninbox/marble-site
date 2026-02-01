'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';

export default function ContactPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Header - Shared Component */}
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section with Decorative Brackets */}
        <div className="text-center py-10 sm:py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
              Contact Us
            </h1>
            <div className="h-1 w-16 bg-red-600 mx-auto mb-6" />
            <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed font-light tracking-wide">
              Get in touch with our team for inquiries, quotes, or to discuss your project requirements.
            </p>
          </motion.div>
        </div>

        {/* Contact Information Section */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Quick Actions Grid - Mobile Only */}
            <div className="grid grid-cols-2 gap-3 mb-8 lg:hidden">
              <a href="tel:8794946566" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-100 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Call Now</span>
              </a>
              <a href="https://wa.me/918794946566" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-100 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 text-emerald-500 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">WhatsApp</span>
              </a>
              <a href="mailto:shreeradhesr@gmail.com" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-100 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 text-blue-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Email Us</span>
              </a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=23.8423724,91.3212724" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-red-100 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <svg className="w-5 h-5 text-red-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Directions</span>
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Row 1: Get In Touch (Desktop) & Map (All) */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)] hidden lg:block h-full">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Get In Touch</h2>

                <div className="space-y-6">
                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">Our Address</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Godown: AA Road,<br />
                        Kashipur Bazar,<br />
                        Agartala-799008
                      </p>
                    </div>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=23.8423724,91.3212724"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors self-start"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">Phone Number</h3>
                      <p className="text-slate-600 text-sm">8794946566</p>
                      <p className="text-slate-400 text-xs mt-1">Daily: 9:00 AM - 12:00 AM</p>
                    </div>
                    <a
                      href="https://wa.me/918794946566"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      WhatsApp
                    </a>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">Email Address</h3>
                      <p className="text-slate-600 text-sm">shreeradhesr@gmail.com</p>
                      <p className="text-slate-400 text-xs mt-1">We respond within 24 hours</p>
                    </div>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=shreeradhesr@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Email
                    </a>
                  </motion.div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold tracking-widest uppercase hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)] h-full"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Find Us</h2>
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4095.993942801531!2d91.3212724!3d23.8423724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f3ece8c5082f%3A0x3560794d63797140!2sShree%20Radhe%20Marble%20%26%20Granite!5e1!3m2!1sen!2sin!4v1768924787517!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Shree Radhe Marble & Granite Location"
                    className="w-full h-full lg:h-[350px]"
                  />
                </div>
                <p className="text-slate-500 text-xs mt-4 text-center">
                  Click on the map to get directions to our showroom
                </p>
              </motion.div>

              {/* Row 2: Business Hours & Why Choose Us */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)] h-full flex flex-col">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center sm:text-left">Business Hours</h2>
                
                {/* Business Hours - Original Desktop Layout */}
                <div className="hidden lg:block space-y-4 text-sm bg-slate-50 rounded-xl p-5 border border-slate-100 flex-1">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-slate-700 font-medium">Monday - Saturday</span>
                    </div>
                    <div className="text-slate-900 font-semibold text-right">
                      <span>9:00 AM - 12:00 AM</span>
                      <span className="block text-xs text-slate-500 font-normal mt-0.5">12:00 AM - 6:00 AM (Next Day)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-slate-700 font-medium">Sunday</span>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full">
                      Closed
                    </span>
                  </div>
                </div>

                {/* Business Hours - Fancy Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  {/* Weekdays */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monday - Saturday</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-slate-900">9:00 AM - 12:00 AM</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium bg-white/50 w-fit px-2 py-0.5 rounded-full border border-slate-100">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Open until 12:00 AM
                      </div>
                    </div>
                  </div>

                  {/* Sunday */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sunday</span>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-tighter rounded-lg border border-red-100">
                      Closed
                    </span>
                  </div>
                </div>

                {/* Request a Quote Button - Integrated for Mobile context */}
                <div className="lg:hidden mt-6 pt-6 border-t border-slate-100">
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black tracking-widest uppercase rounded-xl hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white h-full flex flex-col justify-center">
                <h3 className="text-lg font-semibold mb-4">Why Choose Us?</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    20+ years of expertise in marble & granite
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Premium quality imported & domestic stones
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Trusted by architects & interior designers
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                    Custom fabrication & installation services
                  </li>
                </ul>
              </div>
            </motion.div>
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
