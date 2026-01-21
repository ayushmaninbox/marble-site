'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCategory, Product } from '@/lib/types';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [quoteForm, setQuoteForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        productCategory: 'Marbles' as ProductCategory,
        productName: '',
        quantity: '1',
        message: ''
    });
    const [formErrors, setFormErrors] = useState<{
        email?: string;
        phone?: string;
        quantity?: string;
    }>({});
    const [quoteSubmitting, setQuoteSubmitting] = useState(false);
    const [quoteSuccess, setQuoteSuccess] = useState(false);

    // Fetch products for dropdown
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const validateForm = () => {
        const errors: typeof formErrors = {};
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(quoteForm.email)) {
            errors.email = 'Please enter a valid email';
        }
        
        // Phone validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(quoteForm.phone)) {
            errors.phone = 'Please enter a 10-digit number';
        }
        
        // Quantity validation
        const qty = parseInt(quoteForm.quantity);
        if (isNaN(qty) || qty < 1 || qty > 9999) {
            errors.quantity = 'Quantity must be 1-9999';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setQuoteSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setQuoteSuccess(true);
        setQuoteSubmitting(false);
        
        // Auto-close after success
        setTimeout(() => {
            setQuoteSuccess(false);
            onClose();
            setQuoteForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                productCategory: 'Marbles',
                productName: '',
                quantity: '1',
                message: ''
            });
            setFormErrors({});
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        {quoteSuccess ? (
                            /* Success Confirmation */
                            <div className="text-center py-8">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                                    <span className="text-3xl text-emerald-600">✓</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Thank You!</h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Your enquiry has been submitted successfully. We&apos;ll contact you shortly.
                                </p>
                                <p className="mt-4 text-xs text-slate-400">Closing automatically...</p>
                            </div>
                        ) : (
                            /* Quote Form */
                            <>
                                <div className="mb-4 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">Get a Quote</h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Share a few details and we&apos;ll get back with pricing and options.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                        aria-label="Close quote form"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form
                                    className="space-y-4 text-sm"
                                    onSubmit={handleQuoteSubmit}
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-fname">
                                                First Name
                                            </label>
                                            <input
                                                id="q-fname"
                                                type="text"
                                                required
                                                value={quoteForm.firstName}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, firstName: e.target.value })}
                                                className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-lname">
                                                Last Name
                                            </label>
                                            <input
                                                id="q-lname"
                                                type="text"
                                                required
                                                value={quoteForm.lastName}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, lastName: e.target.value })}
                                                className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-email">
                                                Email
                                            </label>
                                            <input
                                                id="q-email"
                                                type="email"
                                                required
                                                value={quoteForm.email}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                                className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 ${formErrors.email ? 'border-red-400' : 'border-slate-200'}`}
                                            />
                                            {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-phone">
                                                Phone (10 digits)
                                            </label>
                                            <input
                                                id="q-phone"
                                                type="tel"
                                                required
                                                placeholder="9876543210"
                                                value={quoteForm.phone}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                                className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 ${formErrors.phone ? 'border-red-400' : 'border-slate-200'}`}
                                            />
                                            {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-type">
                                                Product Type
                                            </label>
                                            <select
                                                id="q-type"
                                                className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                                value={quoteForm.productCategory}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, productCategory: e.target.value as ProductCategory, productName: '' })}
                                                required
                                            >
                                                <option value="Marbles">Marbles</option>
                                                <option value="Tiles">Tiles</option>
                                                <option value="Handicraft">Handicraft</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-medium text-slate-600" htmlFor="q-product">
                                                Product
                                            </label>
                                            <select
                                                id="q-product"
                                                className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                                value={quoteForm.productName}
                                                onChange={(e) => setQuoteForm({ ...quoteForm, productName: e.target.value })}
                                                required
                                            >
                                                <option value="">Select product</option>
                                                {products
                                                    .filter((p) => p.category === quoteForm.productCategory)
                                                    .map((product) => (
                                                        <option key={product.id} value={product.name}>
                                                            {product.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-slate-600" htmlFor="q-qty">
                                            Quantity (1-9999)
                                        </label>
                                        <input
                                            id="q-qty"
                                            type="number"
                                            min="1"
                                            max="9999"
                                            required
                                            value={quoteForm.quantity}
                                            onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                                            className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100 ${formErrors.quantity ? 'border-red-400' : 'border-slate-200'}`}
                                        />
                                        {formErrors.quantity && <span className="text-[10px] text-red-500">{formErrors.quantity}</span>}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-slate-600" htmlFor="q-msg">
                                            Message (Optional)
                                        </label>
                                        <textarea
                                            id="q-msg"
                                            rows={2}
                                            placeholder="Any additional details..."
                                            value={quoteForm.message}
                                            onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                                            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={quoteSubmitting}
                                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2 font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md disabled:opacity-50"
                                        >
                                            {quoteSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
