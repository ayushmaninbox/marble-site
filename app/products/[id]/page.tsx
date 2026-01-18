'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product, ProductCategory } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Enquiry form state
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ phone?: string; email?: string; quantity?: string }>({});
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productCategory: '' as ProductCategory,
    productName: '',
    quantity: '1',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
        
        const foundProduct = data.find((p: Product) => p.id === params.id);
        if (foundProduct) {
          setProduct(foundProduct);
          setQuoteForm(prev => ({
            ...prev,
            productCategory: foundProduct.category,
            productName: foundProduct.name,
          }));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Get images array with fallback
  const images = product?.images?.length ? product.images : (product?.image ? [product.image] : []);

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
        body: JSON.stringify(quoteForm),
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

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 text-slate-900 overflow-x-hidden">
      {/* Background accents to match main site */}
      <div className="pointer-events-none fixed inset-x-0 top-[-220px] -z-30 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.17),_transparent_55%)]" />
      <div className="pointer-events-none fixed right-[-120px] top-1/2 -z-30 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_60%)]" />

      {/* Header - matching main site */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-blue-100/50 bg-gradient-to-r from-white/95 via-blue-50/90 to-sky-50/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(59,130,246,0.1)]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-lg shadow-blue-500/30" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 opacity-40 blur-sm -z-10" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 bg-clip-text text-sm font-bold tracking-tight text-transparent">
                Shree Radhe Marble &amp; Granite
              </span>
              <span className="text-[11px] font-medium text-slate-500">Premium Stone Surfaces</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link href="/" className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200">
              Home
            </Link>
            <Link href="/products" className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200">
              Products
            </Link>
          </nav>
          <Link
            href="/products"
            className="hidden rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] md:inline-flex"
          >
            View All Products
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-3 pt-24 pb-16 sm:px-6 lg:px-4">
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li className="text-slate-300">›</li>
            <li><Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link></li>
            <li className="text-slate-300">›</li>
            <li><span className="hover:text-blue-600 transition-colors">{product.category}</span></li>
            <li className="text-slate-300">›</li>
            <li className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</li>
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
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-[0_18px_45px_rgba(56,189,248,0.18)] border border-sky-100 group">
              {images[selectedImageIndex] ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-gradient-to-br from-sky-50 to-blue-50">
                  <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white transition opacity-0 group-hover:opacity-100 border border-sky-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white transition opacity-0 group-hover:opacity-100 border border-sky-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                    className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all border-2 ${
                      index === selectedImageIndex
                        ? 'border-blue-500 shadow-lg shadow-blue-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
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
          </motion.div>

          {/* Product Info & Enquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Details Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_18px_45px_rgba(56,189,248,0.18)] border border-sky-100">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
                product.category === 'Marbles' ? 'bg-blue-100 text-blue-700' :
                product.category === 'Tiles' ? 'bg-emerald-100 text-emerald-700' :
                'bg-violet-100 text-violet-700'
              }`}>
                {product.category}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-transparent mb-4">
                {product.name}
              </h1>

              <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-baseline gap-2 pb-4 border-b border-slate-100">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500">per unit</span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </span>
                <span>•</span>
                <span>Fast Delivery</span>
                <span>•</span>
                <span>Quality Assured</span>
              </div>
            </div>

            {/* Enquiry Form Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_18px_45px_rgba(56,189,248,0.18)] border border-sky-100">
              {quoteSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Thank You!</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Your enquiry has been submitted. We'll contact you shortly.
                  </p>
                  <button
                    onClick={() => setQuoteSuccess(false)}
                    className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
                    Send Enquiry
                  </h2>
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">First Name</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.firstName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, firstName: e.target.value })}
                          className="h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">Last Name</label>
                        <input
                          type="text"
                          required
                          value={quoteForm.lastName}
                          onChange={(e) => setQuoteForm({ ...quoteForm, lastName: e.target.value })}
                          className="h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">Email</label>
                        <input
                          type="email"
                          required
                          value={quoteForm.email}
                          onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                          className={`h-11 rounded-xl border bg-slate-50/70 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.email ? 'border-red-400' : 'border-slate-200'}`}
                        />
                        {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-600">Phone</label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={quoteForm.phone}
                          onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                          className={`h-11 rounded-xl border bg-slate-50/70 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.phone ? 'border-red-400' : 'border-slate-200'}`}
                        />
                        {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-600">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="9999"
                        required
                        value={quoteForm.quantity}
                        onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                        className={`h-11 rounded-xl border bg-slate-50/70 px-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.quantity ? 'border-red-400' : 'border-slate-200'}`}
                      />
                      {formErrors.quantity && <span className="text-[10px] text-red-500">{formErrors.quantity}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-600">Message (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Any additional details..."
                        value={quoteForm.message}
                        onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="w-full rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50"
                    >
                      {quoteSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">You May Also Like</h2>
                <p className="mt-1 text-sm text-slate-500">More products from {product.category}</p>
              </div>
              <Link
                href="/products"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedImage = relatedProduct.images?.[0] || relatedProduct.image || '';
                return (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_18px_45px_rgba(56,189,248,0.18)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_70px_rgba(59,130,246,0.3)]">
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        {relatedImage ? (
                          <Image
                            src={relatedImage}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-gradient-to-br from-sky-50 to-blue-50">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-slate-900 truncate">{relatedProduct.name}</h3>
                        <p className="mt-1 text-sm font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                          ₹{relatedProduct.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
