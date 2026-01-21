'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product, ProductCategory } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ProductCard from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  // Header Modal State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  
  // Enquiry form state
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ phone?: string; email?: string; quantity?: string }>({});
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productCategory: product.category,
    productName: product.name,
    quantity: '1',
    message: '',
  });

  // Get images array with fallback
  const images = product.images?.length ? product.images : (product.image ? [product.image] : []);

  const validateForm = () => {
    const errors: { phone?: string; email?: string; quantity?: string } = {};

    const phoneDigits = quoteForm.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.phone = 'Phone must be exactly 10 digits';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(quoteForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const qty = parseInt(quoteForm.quantity);
    if (isNaN(qty) || qty < 1 || qty > 9999) {
      errors.quantity = 'Quantity must be between 1 and 9999';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setQuoteSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteForm,
          quantity: parseInt(quoteForm.quantity),
        }),
      });

      if (response.ok) {
        setQuoteSuccess(true);
        setQuoteForm(prev => ({
            ...prev,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            quantity: '1',
            message: '',
        }));
        setFormErrors({});
      } else {
        alert('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-play gallery
  useEffect(() => {
    if (images.length <= 1 || isHovering) return;
    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
      
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} isRevealed={true} />

      <main className="mx-auto w-full max-w-7xl px-3 pt-24 pb-16 sm:px-6 lg:px-4">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 font-medium">
            <li><Link href="/" className="hover:text-red-600 transition-colors">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/products" className="hover:text-red-600 transition-colors">Products</Link></li>
            <li className="text-slate-300">/</li>
            <li><span className="text-red-600">{product.category}</span></li>
          </ol>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div 
              className="relative aspect-[4/3] rounded-sm overflow-hidden bg-stone-100 shadow-sm border border-stone-200 group cursor-crosshair"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({ x: 50, y: 50 });
              }}
              onMouseMove={handleMouseMove}
            >
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-200 ease-out"
                  style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: isHovering ? 'scale(2)' : 'scale(1)',
                  }}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                   <span className="text-xs uppercase tracking-widest">No Image</span>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 shadow-sm flex items-center justify-center text-slate-900 hover:bg-red-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/90 shadow-sm flex items-center justify-center text-slate-900 hover:bg-red-600 hover:text-white transition opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden transition-all border ${
                      index === selectedImageIndex
                        ? 'border-red-600 opacity-100 ring-1 ring-red-600'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Specifications Section - Moved here */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-8 bg-stone-50/50 p-6 rounded-lg border border-stone-100">
                <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-stone-200 pb-3">Technical Specifications</h3>
                <div className="space-y-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <span className="text-slate-500 font-medium">{spec.key}</span>
                      <span className="text-slate-900 font-semibold text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Info & Enquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Product Details Card */}
            <div className="space-y-6">
              <div>
                <span className="text-red-600 text-xs font-bold tracking-widest uppercase mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-serif text-slate-900 mb-4">
                  {product.name}
                </h1>
                
                {/* Short description for "above fold" context - Optional or just keep Category/Title/Price */}
                <div className="text-sm font-light text-slate-500 mb-6">
                   {product.description.split('\n')[0].substring(0, 150)}... <a href="#details" className="text-red-600 hover:underline">Read more</a>
                </div>
              </div>

              <div className="flex items-baseline gap-2 pb-6 border-b border-stone-100">
                <span className="text-3xl font-medium text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500 font-light">/ unit</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs tracking-wide uppercase text-slate-500">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Nationwide Delivery
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Premium Quality
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Custom Sizes
                </div>
              </div>
            </div>

            {/* Enquiry Form Card (Stays in sidebar) */}
            <div className="bg-stone-50 rounded-xl p-8 border border-stone-100">
              {quoteSuccess ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-serif text-slate-900">Enquiry Sent!</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    We will get back to you shortly regarding your interest.
                  </p>
                  <button
                    onClick={() => setQuoteSuccess(false)}
                    className="mt-6 text-red-600 hover:text-red-700 text-xs font-bold uppercase tracking-widest border-b border-red-200 pb-0.5 hover:border-red-600 transition-all"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-serif text-slate-900 mb-6">
                    Request Pricing
                  </h2>
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">First Name</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.firstName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, firstName: e.target.value })}
                          className="w-full h-10 rounded-sm border border-stone-200 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.lastName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, lastName: e.target.value })}
                          className="w-full h-10 rounded-sm border border-stone-200 bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</label>
                        <input
                          type="email"
                          required
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className={`w-full h-10 rounded-sm border bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all ${formErrors.email ? 'border-red-400' : 'border-stone-200'}`}
                        />
                        {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="10 digits"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className={`w-full h-10 rounded-sm border bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all ${formErrors.phone ? 'border-red-400' : 'border-stone-200'}`}
                        />
                        {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
                      </div>
                    </div>

                    <div className="space-y-1">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantity (sq. ft. / pieces)</label>
                       <input
                         type="number"
                         min="1"
                         max="9999"
                         required
                         value={quoteForm.quantity}
                         onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                         className={`w-full h-10 rounded-sm border bg-white px-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all ${formErrors.quantity ? 'border-red-400' : 'border-stone-200'}`}
                       />
                       {formErrors.quantity && <span className="text-[10px] text-red-500">{formErrors.quantity}</span>}
                     </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Message (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Additional details..."
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                        className="w-full rounded-sm border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="w-full rounded-full bg-slate-900 px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-red-700 hover:shadow-red-600/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {quoteSubmitting ? 'Sending...' : 'Send Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full Width Description Section */}
        <motion.section 
          id="details"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 border-t border-stone-100 pt-16"
        >
          <div className="w-full">
            <h2 className="text-2xl font-serif text-slate-900 mb-8">Description</h2>
            <div className="prose prose-stone prose-sm sm:prose-base max-w-none text-slate-600 font-light leading-relaxed">
               {product.description.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
               ))}
            </div>
          </div>
        </motion.section>


        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-24 border-t border-stone-100 pt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif text-slate-900">You May Also Like</h2>
                <p className="mt-1 text-sm text-slate-500 font-light">More curated options from {product.category}</p>
              </div>
              <Link
                href="/products"
                className="text-xs font-bold tracking-widest uppercase text-red-600 hover:text-red-700 transition flex items-center gap-2 border-b border-transparent hover:border-red-600 pb-0.5"
              >
                View all collection
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                 <div key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} />
                 </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />
      
      {/* Quote Modal */}
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
