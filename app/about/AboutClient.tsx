
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';

export default function AboutPage() {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
            {/* Header */}
            <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

            {/* Main Content */}
            <main className="pt-24">
                {/* Hero Section */}
                <div className="text-center py-10 sm:py-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
                            About Us
                        </h1>
                        <div className="h-1 w-16 bg-red-600 mx-auto mb-6" />
                        <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed font-light tracking-wide">
                            Discover the story behind Shree Radhe Marble & Granite and our passion for excellence in stone.
                        </p>
                    </motion.div>
                </div>

                {/* Company Overview Section */}
                <section className="py-12 lg:py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                                    <img
                                        src="https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2080&auto=format&fit=crop"
                                        alt="Premium Marble Slab"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl md:text-3xl font-serif text-slate-900">
                                    Building Legacies in Stone
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    Founded with a vision to bring the world's finest stones to your doorstep, Shree Radhe Marble & Granite has established itself as a premier destination for quality marble and granite. We believe that every slab tells a story, and we are here to help you find the perfect chapter for your home.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Our journey began with a simple commitment: to provide uncompromised quality and exceptional service. Over the years, we have curated a diverse collection of imported and domestic stones, ensuring that our clients have access to the best materials the world has to offer.
                                </p>

                                <div className="pt-4 grid grid-cols-2 gap-6">
                                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <span className="block text-3xl font-bold text-red-600 mb-1">20+</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-widest">Years Experience</span>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                        <span className="block text-3xl font-bold text-red-600 mb-1">500+</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-widest">Projects Completed</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="py-12 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.05)] transition-shadow"
                            >
                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    To transform spaces into timeless masterpieces by providing superior quality marble and granite solutions. We strive to exceed customer expectations through integrity, innovation, and unparalleled craftsmanship.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(220,38,38,0.05)] transition-shadow"
                            >
                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    To be the region's most trusted and preferred partner for architectural stone, recognized for our extensive collection, expert guidance, and dedication to elevating the art of living.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 mb-6">
                            Ready to start your project?
                        </h2>
                        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                            Visit our showroom to experience the beauty of our stones in person, or contact us for a personalized consultation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setIsQuoteOpen(true)}
                                className="px-8 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors rounded-full"
                            >
                                Get a Quote
                            </button>
                            <Link
                                href="/contact"
                                className="px-8 py-3 bg-white text-slate-900 border border-slate-200 text-sm font-bold uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-colors rounded-full"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />

            {/* Quote Modal */}
            <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
        </div>
    );
}
