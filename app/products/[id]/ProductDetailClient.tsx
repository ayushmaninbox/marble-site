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
import ProgressiveImage from '@/components/ProgressiveImage';
import SchemaMarkup from '@/components/SchemaMarkup';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  
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
  
  // Create media array (images + video)
  const mediaItems = [...images];
  const videoIndex = product.video ? mediaItems.length : -1;
  if (product.video) {
    mediaItems.push(product.video); // Add video as last item
  }

  // SEO Schema
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Shree Radhe Marble & Granite"
    },
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : '',
      "priceCurrency": "INR",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

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

  // Auto-play gallery (pause when video is playing)
  useEffect(() => {
    if (mediaItems.length <= 1 || isHovering || isVideoPlaying) return;
    const interval = setInterval(() => {
      setSelectedImageIndex(prev => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [mediaItems.length, isHovering, isVideoPlaying]);
  
  // Handle video playback state
  useEffect(() => {
    if (videoRef) {
      const handlePlay = () => setIsVideoPlaying(true);
      const handlePause = () => setIsVideoPlaying(false);
      const handleEnded = () => setIsVideoPlaying(false);
      
      videoRef.addEventListener('play', handlePlay);
      videoRef.addEventListener('pause', handlePause);
      videoRef.addEventListener('ended', handleEnded);
      
      return () => {
        videoRef.removeEventListener('play', handlePlay);
        videoRef.removeEventListener('pause', handlePause);
        videoRef.removeEventListener('ended', handleEnded);
      };
    }
  }, [videoRef]);

  // Update WhatsApp context
  useEffect(() => {
    if (product?.name) {
      window.dispatchEvent(new CustomEvent('set-whatsapp-context', { 
        detail: { productName: product.name } 
      }));
    }
  }, [product?.name]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
      
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} isRevealed={true} />
      <SchemaMarkup schema={productSchema} />

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
            {/* Main Media Display */}
            <div 
              className="relative aspect-[4/3] rounded-sm overflow-hidden bg-stone-100 shadow-sm border border-stone-200 group cursor-crosshair"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({ x: 50, y: 50 });
              }}
              onMouseMove={handleMouseMove}
            >
              {selectedImageIndex === videoIndex && product.video ? (
                // Video Display with styled player
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  <video
                    ref={setVideoRef}
                    src={product.video}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-contain"
                    style={{
                      filter: isVideoPlaying ? 'none' : 'brightness(0.8)',
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {/* Play Button Overlay - shown when video is not playing */}
                  {!isVideoPlaying && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/10 via-black/30 to-black/10 cursor-pointer transition-all"
                      onClick={() => videoRef?.play()}
                    >
                      <div className="w-24 h-24 rounded-full bg-white/95 flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-red-600 transition-all duration-300 group">
                        <svg className="w-12 h-12 text-red-600 group-hover:text-white ml-1.5 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : mediaItems[selectedImageIndex] ? (
                // Image Display
                <>
                  <ProgressiveImage
                    src={mediaItems[selectedImageIndex]}
                    alt={product.name}
                    fill
                    style={{
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      transform: isHovering ? 'scale(2)' : 'scale(1)',
                    }}
                    containerClassName="hidden md:block"
                    className="object-cover transition-transform duration-200 ease-out"
                    priority
                  />
                  {/* Mobile Image (No Zoom) */}
                  <ProgressiveImage
                    src={mediaItems[selectedImageIndex]}
                    alt={product.name}
                    fill
                    containerClassName="md:hidden"
                    className="object-cover"
                    priority
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                   <span className="text-xs uppercase tracking-widest">No Media</span>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {mediaItems.length > 1 && (
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
            {mediaItems.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mediaItems.map((item, index) => {
                  const isVideo = index === videoIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden transition-all border ${
                        index === selectedImageIndex
                          ? 'border-red-600 opacity-100 ring-1 ring-red-600'
                          : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isVideo ? (
                        // Video thumbnail with first frame and play icon
                        <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                          <video
                            src={`${item}#t=0.1`}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/20 via-black/40 to-black/20">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                              <svg className="w-5 h-5 text-red-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <ProgressiveImage
                          src={item}
                          alt={`${product.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {/* Specifications Section - Moved here */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-8 bg-stone-50/50 p-6 rounded-lg border border-stone-100">
                <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-stone-200 pb-3">Product Specifications</h3>
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
            className="flex flex-col"
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
                
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500 font-light">/ unit</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs tracking-wide uppercase text-slate-500 py-6 border-y border-stone-100">
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

              {/* Description Section - Now here to fill the gap */}
              <div className="flex-1 min-h-[100px] flex flex-col pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product Description</h3>
                <div className={`relative overflow-hidden transition-all duration-500 ${isDescriptionExpanded ? 'max-h-[2000px]' : 'max-h-[120px]'}`}>
                  <div className="prose prose-stone prose-sm max-w-none text-slate-600 font-light leading-relaxed">
                    {product.description.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
                    ))}
                  </div>
                  {!isDescriptionExpanded && product.description.length > 200 && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
                {product.description.length > 200 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-2 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 group w-fit"
                  >
                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Enquiry Form Card (Stays in sidebar, pushed to bottom) */}
            <div className="mt-auto bg-stone-50 rounded-xl p-8 border border-stone-100 w-full">
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
            {/* Related Products - Mobile Horizontal Scroll / Desktop Grid */}
            <div className="relative">
              {/* Mobile/Tablet Horizontal Scroll */}
              <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-6 scrollbar-hide">
                <div className="flex gap-4 min-w-min">
                  {relatedProducts.map((relatedProduct) => (
                    <div key={relatedProduct.id} className="w-[280px] flex-shrink-0">
                      <ProductCard product={relatedProduct} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Grid */}
              <div className="hidden lg:grid gap-6 grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                   <div key={relatedProduct.id}>
                      <ProductCard product={relatedProduct} />
                   </div>
                ))}
              </div>
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
