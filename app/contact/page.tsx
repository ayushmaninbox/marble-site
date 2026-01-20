'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export default function ContactPage() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 text-slate-900">
      {/* Header - Shared Component */}
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section with Decorative Brackets */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block relative mb-6">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-slate-900 uppercase">
                Contact Us
              </h1>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-8">
              Get in touch with our team for inquiries, quotes, or to discuss your project requirements.
            </p>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="pb-16 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Contact Details */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)]">
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
                        Send Gmail
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

                {/* Business Hours */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)]">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Business Hours</h2>
                  <div className="space-y-4 text-sm bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-4 pb-4 border-b border-slate-200 border-dashed">
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
                </div>
              </div>

              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_18px_45px_rgba(56,189,248,0.1)]">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Find Us</h2>
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4095.993942801531!2d91.3212724!3d23.8423724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f3ece8c5082f%3A0x3560794d63797140!2sShree%20Radhe%20Marble%20%26%20Granite!5e1!3m2!1sen!2sin!4v1768924787517!5m2!1sen!2sin"
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Shree Radhe Marble & Granite Location"
                      className="w-full"
                    />
                  </div>
                  <p className="text-slate-500 text-xs mt-4 text-center">
                    Click on the map to get directions to our showroom
                  </p>
                </div>

                {/* Quick Info */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white">
                  <h3 className="text-lg font-semibold mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3 text-sm">
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
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Same as Main Site */}
      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />
    </div>
  );
}
