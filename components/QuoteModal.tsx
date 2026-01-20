'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategory } from '@/lib/types';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
    const [quoteForm, setQuoteForm] = useState({
        name: '',
        mobile: '',
        productCategory: 'Marbles' as ProductCategory,
        productName: '',
        quantity: '100',
        message: ''
    });
    const [quoteSubmitting, setQuoteSubmitting] = useState(false);

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setQuoteSubmitting(true);

        // Basic validation
        if (quoteForm.mobile.length < 10) {
            alert("Please enter a valid mobile number");
            setQuoteSubmitting(false);
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert('Quote request sent successfully! We will contact you soon.');
        setQuoteSubmitting(false);
        onClose();
        setQuoteForm({ ...quoteForm, name: '', mobile: '', message: '' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                    >
                        <div className="bg-gradient-to-r from-red-700 to-orange-600 px-6 py-4 text-white">
                            <h2 className="text-lg font-serif font-medium">Request a Quote</h2>
                            <p className="text-xs text-red-100 opacity-90">Tell us what you need and we'll get back to you.</p>
                        </div>

                        <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        placeholder="Your Name"
                                        value={quoteForm.name}
                                        onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        placeholder="10-digit number"
                                        value={quoteForm.mobile}
                                        onChange={e => setQuoteForm({ ...quoteForm, mobile: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Interest</label>
                                <select
                                    className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    value={quoteForm.productCategory}
                                    onChange={e => setQuoteForm({ ...quoteForm, productCategory: e.target.value as ProductCategory })}
                                >
                                    <option value="Marbles">Marbles</option>
                                    <option value="Tiles">Tiles</option>
                                    <option value="Handicraft">Handicraft</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    placeholder="Any specific requirements?"
                                    value={quoteForm.message}
                                    onChange={e => setQuoteForm({ ...quoteForm, message: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-full border border-stone-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-stone-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={quoteSubmitting}
                                    className="flex-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-70"
                                >
                                    {quoteSubmitting ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
