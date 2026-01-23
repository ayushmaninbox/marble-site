// Keep 'use client' for now as it's a massive file. 
// I'll wrap it in a server component in a new page.tsx and rename this one.
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, ProductCategory, Blog } from '@/lib/types';
import { AnimatedSection } from '@/components/AnimatedSection';
import { TextReveal } from '@/components/TextReveal';
import { TypewriterText } from '@/components/TypewriterText';
import { DynamicBackground } from '@/components/DynamicBackground';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [marbleIndex, setMarbleIndex] = useState(0);
  const [tilesIndex, setTilesIndex] = useState(0);
  const [handicraftIndex, setHandicraftIndex] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Quote form state
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ phone?: string; email?: string; quantity?: string }>({});
  const [quoteForm, setQuoteForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productCategory: 'Marbles' as ProductCategory,
    productName: '',
    quantity: '1',
    message: '',
  });

  // Quote form validation
  const validateQuoteForm = () => {
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

  // Quote form submit handler
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuoteForm()) return;

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
        setQuoteForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          productCategory: 'Marbles' as ProductCategory,
          productName: '',
          quantity: '1',
          message: '',
        });
        setFormErrors({});
        // Auto-close after success
        setTimeout(() => {
          setIsQuoteOpen(false);
          setQuoteSuccess(false);
        }, 3000);
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

  // Cinematic reveal state - triggers after video plays for 0.5 seconds
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 500);
    return () => clearTimeout(revealTimer);
  }, []);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const circleY = useTransform(scrollY, [0, 500], [0, -100]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data.slice(0, 3)); // Get only latest 3
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    // Disable browser scroll restoration and force scroll to top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    fetchProducts();
    fetchBlogs();

    // Poll for updates every 5 seconds to show real-time changes
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter products by category
  // Filter products by category and sort by Featured
  const marbleProducts = products
    .filter(p => p.category === 'Marbles')
    .sort((a, b) => (Number(b.isFeatured || 0) - Number(a.isFeatured || 0)));
  
  const tilesProducts = products
    .filter(p => p.category === 'Tiles')
    .sort((a, b) => (Number(b.isFeatured || 0) - Number(a.isFeatured || 0)));
  
  const handicraftProducts = products
    .filter(p => p.category === 'Handicraft')
    .sort((a, b) => (Number(b.isFeatured || 0) - Number(a.isFeatured || 0)));

  // Auto-advance carousels (infinite loop - cycles through 2x length then resets)
  useEffect(() => {
    if (marbleProducts.length === 0) return;
    const interval = setInterval(() => {
      setMarbleIndex((prev) => {
        const next = prev + 1;
        // When we reach end of 2nd copy, reset to start (3rd copy provides seamless view)
        return next >= marbleProducts.length * 2 ? 0 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [marbleProducts.length]);

  useEffect(() => {
    if (tilesProducts.length === 0) return;
    const interval = setInterval(() => {
      setTilesIndex((prev) => {
        const next = prev + 1;
        return next >= tilesProducts.length * 2 ? 0 : next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [tilesProducts.length]);

  useEffect(() => {
    if (handicraftProducts.length === 0) return;
    const interval = setInterval(() => {
      setHandicraftIndex((prev) => {
        const next = prev + 1;
        return next >= handicraftProducts.length * 2 ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [handicraftProducts.length]);

  // Auto-advance testimonials on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % 6); // We have 6 testimonials
    }, 5000);
    return () => clearInterval(interval);
  }, []);





  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 text-slate-900 overflow-x-hidden">

      {/* Dynamic animated background */}
      <DynamicBackground />

      {/* Parallax background accents */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 top-[-220px] -z-30 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.17),_transparent_55%)]"
        style={{ y: bgY }}
      />
      <motion.div
        className="pointer-events-none fixed right-[-120px] top-1/2 -z-30 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_60%)]"
        style={{ y: circleY }}
      />

      {/* Header - Elegant Red Theme */}
      <SiteHeader isRevealed={isRevealed} setIsQuoteOpen={setIsQuoteOpen} />


      <main id="top" className="mx-auto w-full max-w-7xl px-3 pt-0 sm:px-6 lg:px-4">
        {/* Hero Section - Full Screen */}
        <div className="h-screen relative overflow-hidden flex items-center justify-center bg-black" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>

          {/* Video Background - Zoomed to cover full screen */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover scale-110"
              style={{ minWidth: '100%', minHeight: '100%' }}
            >
              <source src="/assets/MarbleVideo.mp4" type="video/mp4" />
            </video>
            {/* Black overlay for text contrast */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Hero Content - Centered, animates after reveal */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Breadcrumb / Tagline */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-white/80 text-sm sm:text-base tracking-wide mb-6"
            >
              Premium marble & granite for modern spaces
            </motion.p>

            {/* Main Heading - Uppercase, Light Weight */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 0.61, 0.36, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-white uppercase tracking-wider leading-tight"
            >
              Elevate Every Surface
              <span className="block mt-2">With Precision-Crafted Stone</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-8 text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            >
              From luxury residences to high-traffic commercial spaces, we source and craft premium marble, granite, and tiles to match your design vision.
            </motion.p>

            {/* Buttons - Ghost Style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="px-8 py-3 border-2 border-white text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-slate-900"
              >
                Get a Quote
              </button>
              <Link
                href="/products"
                className="px-8 py-3 bg-white text-slate-900 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-white/90"
              >
                Explore Collection
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/70 text-xs sm:text-sm uppercase tracking-wide"
            >
              <span>20+ Years of Expertise</span>
              <span className="hidden sm:inline h-4 w-px bg-white/30" />
              <span>Trusted by Architects & Interior Designers</span>
            </motion.div>
          </div>
        </div>
        {/* Marble Collections Carousel Section */}
        <AnimatedSection id="products" className="py-16 lg:py-24" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-16 px-6">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-4 sm:-left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-2xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase px-2">
                Marble Collections
              </h2>
              <span className="absolute -bottom-3 -right-4 sm:-right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Description + Right Carousel */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-6 text-center lg:text-left px-4">
              <h3 className="text-4xl sm:text-4xl font-light text-red-500 leading-tight">
                Premium<br className="hidden sm:block" /> Marbles
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto lg:max-w-none lg:mx-0">
                Indulge in the glory of class-apart Imported Marble from Shree Radhe. Our popular offerings range from Statuario Marble, Travertine Marble to Flawless White & Cat's Eye Marble.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setMarbleIndex((prev: number) => (prev - 1 + marbleProducts.length * 2) % (marbleProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setMarbleIndex((prev: number) => (prev + 1) % (marbleProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right Column - Carousel */}
            <div className="relative overflow-hidden">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-slate-500">Loading products...</p>
                </div>
              ) : marbleProducts.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  No marble products available yet.
                </div>
              ) : (
                <div
                  className="pt-4 pb-6 relative"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                  }}
                >
                  {/* Sliding Track - products repeated 3x for infinite effect */}
                  <div
                    className="flex gap-5"
                    style={{
                      transform: `translateX(calc(-${marbleIndex} * (280px + 20px)))`,
                      transition: 'transform 0.4s ease-out'
                    }}
                  >
                    {[...marbleProducts, ...marbleProducts, ...marbleProducts].map((product, idx) => (
                      <div
                        key={`marble-${idx}`}
                        className="flex-shrink-0 group cursor-pointer transition-all duration-300 hover:-translate-y-3"
                        style={{ width: '280px' }}
                      >
                        <Link href={`/products/${product.id}`}>
                          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-slate-400/30">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
                            )}
                          </div>
                        </Link>
                        <div className="mt-4 space-y-1.5 px-1">
                          <h4 className="text-base font-semibold text-slate-900 truncate group-hover:text-red-600 transition-colors duration-200">{product.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                            <Link
                              href={`/products/${product.id}`}
                              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-full transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Tiles Collection Carousel Section */}
        <AnimatedSection className="py-16 lg:py-24" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-16 px-6">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-4 sm:-left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-2xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase px-2">
                Tiles Collection
              </h2>
              <span className="absolute -bottom-3 -right-4 sm:-right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Carousel + Right Description */}
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-12 items-start">
            {/* Left Column - Carousel */}
            <div className="relative overflow-hidden order-2 lg:order-1">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-slate-500">Loading products...</p>
                </div>
              ) : tilesProducts.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  No tiles available yet.
                </div>
              ) : (
                <div
                  className="pt-4 pb-6 relative"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                  }}
                >
                  {/* Sliding Track - products repeated 3x for infinite effect */}
                  <div
                    className="flex gap-5"
                    style={{
                      transform: `translateX(calc(-${tilesIndex} * (280px + 20px)))`,
                      transition: 'transform 0.4s ease-out'
                    }}
                  >
                    {[...tilesProducts, ...tilesProducts, ...tilesProducts].map((product, idx) => (
                      <div
                        key={`tiles-${idx}`}
                        className="flex-shrink-0 group cursor-pointer transition-all duration-300 hover:-translate-y-3"
                        style={{ width: '280px' }}
                      >
                        <Link href={`/products/${product.id}`}>
                          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-slate-400/30">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
                            )}
                          </div>
                        </Link>
                        <div className="mt-4 space-y-1.5 px-1">
                          <h4 className="text-base font-semibold text-slate-900 truncate group-hover:text-red-600 transition-colors duration-200">{product.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                            <Link
                              href={`/products/${product.id}`}
                              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-full transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Description (Right-aligned text) */}
            <div className="space-y-6 text-center lg:text-right order-1 lg:order-2 px-4">
              <h3 className="text-4xl sm:text-4xl font-light text-red-500 leading-tight">
                Designer<br className="hidden sm:block" /> Tiles
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto lg:max-w-none lg:mx-0">
                Experience the sheer magnificence of our Premium Tile Collection. Curated for the discerning eye, our range spans from high-gloss Italian Porcelain and rustic Stone textures to exquisite mosaics that turn walls and floors into canvases of art.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4 justify-center lg:justify-end">
                <button
                  onClick={() => {
                    setTilesIndex((prev: number) => (prev - 1 + tilesProducts.length * 2) % (tilesProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setTilesIndex((prev: number) => (prev + 1) % (tilesProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Handicraft Collection Carousel Section */}
        <AnimatedSection className="py-16 lg:py-24" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-16 px-6">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-4 sm:-left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-2xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase px-2">
                Handicraft Collection
              </h2>
              <span className="absolute -bottom-3 -right-4 sm:-right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Description + Right Carousel */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-6 text-center lg:text-left px-4">
              <h3 className="text-4xl sm:text-4xl font-light text-red-500 leading-tight">
                Artisan<br className="hidden sm:block" /> Handicrafts
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto lg:max-w-none lg:mx-0">
                Celebrate the soul of stone with our Handcrafted Masterpieces. From intricately carved Temples to contemporary Decor and Jaali work, every artifact is a testament to centuries-old artistry tailored for modern living.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setHandicraftIndex((prev: number) => (prev - 1 + handicraftProducts.length * 2) % (handicraftProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setHandicraftIndex((prev: number) => (prev + 1) % (handicraftProducts.length * 2));
                  }}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            {/* Right Column - Carousel */}
            <div className="relative overflow-hidden">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
                  <p className="mt-4 text-sm text-slate-500">Loading products...</p>
                </div>
              ) : handicraftProducts.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  No handicraft items available yet.
                </div>
              ) : (
                <div
                  className="pt-4 pb-6 relative"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                  }}
                >
                  {/* Sliding Track - products repeated 3x for infinite effect */}
                  <div
                    className="flex gap-5"
                    style={{
                      transform: `translateX(calc(-${handicraftIndex} * (280px + 20px)))`,
                      transition: 'transform 0.4s ease-out'
                    }}
                  >
                    {[...handicraftProducts, ...handicraftProducts, ...handicraftProducts].map((product, idx) => (
                      <div
                        key={`handicraft-${idx}`}
                        className="flex-shrink-0 group cursor-pointer transition-all duration-300 hover:-translate-y-3"
                        style={{ width: '280px' }}
                      >
                        <Link href={`/products/${product.id}`}>
                          <div className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-md transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-slate-400/30">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
                            )}
                          </div>
                        </Link>
                        <div className="mt-4 space-y-1.5 px-1">
                          <h4 className="text-base font-semibold text-slate-900 truncate group-hover:text-red-600 transition-colors duration-200">{product.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{product.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                            <Link
                              href={`/products/${product.id}`}
                              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-full transition-all duration-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Blog Section */}
        {blogs.length > 0 && (
          <AnimatedSection id="blog" className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-red-50/30 to-transparent" staggerChildren={0.1}>
            {/* Section Header with Decorative Brackets */}
            <div className="text-center mb-12">
              <div className="inline-block relative">
                <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
                <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                  Latest Insights
                </h2>
                <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
              </div>
              <p className="mt-6 text-slate-600 text-sm max-w-xl mx-auto">
                Expert tips, trends, and guides to help you create stunning spaces
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group">
                  <article className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {blog.coverImage ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-red-100 to-orange-50 flex items-center justify-center">
                        <div className="text-red-300 text-4xl font-serif">{blog.title.charAt(0)}</div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>By {blog.author}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {blog.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {blog.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-10">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-red-600 text-red-600 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-red-600 hover:text-white"
              >
                View All Posts
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* Testimonials Section */}
        <AnimatedSection className="py-16 lg:py-24" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                What Our Clients Say
              </h2>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
            <p className="mt-6 text-slate-600 text-sm max-w-xl mx-auto">
              Trusted by architects, designers, and homeowners across the region
            </p>
          </div>

          {/* Testimonials - Mobile Carousel / Desktop Grid */}
          <div className="relative">
            {/* Mobile/Tablet Carousel */}
            <div className="lg:hidden relative overflow-hidden px-4 py-4">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
              >
                {[
                  {
                    name: "Rajesh Kumar",
                    role: "Interior Designer, Kolkata",
                    quote: "Shree Radhe Marble has been our go-to supplier for 5 years. Their Italian Carrara selection is exceptional, and the team understands quality like no other.",
                    rating: 5
                  },
                  {
                    name: "Priya Sharma",
                    role: "Homeowner, Agartala",
                    quote: "The Makrana marble they provided for our temple room is absolutely stunning. The craftsmanship and attention to detail exceeded our expectations.",
                    rating: 5
                  },
                  {
                    name: "Ankit Dey",
                    role: "Architect, Guwahati",
                    quote: "Professional service, premium quality, and competitive pricing. I recommend Shree Radhe to all my clients for their stone requirements.",
                    rating: 5
                  },
                  {
                    name: "Meera Chatterjee",
                    role: "Builder, Tripura",
                    quote: "We've completed over 20 projects with their materials. The consistency in quality and timely delivery makes them our preferred partner.",
                    rating: 5
                  },
                  {
                    name: "Sanjay Bhattacharya",
                    role: "Showroom Owner, Silchar",
                    quote: "Their handicraft collection is unique - authentic Makrana artistry that our customers love. Great wholesale terms and support.",
                    rating: 5
                  },
                  {
                    name: "Nisha Gupta",
                    role: "Homeowner, Dharmanagar",
                    quote: "From selection to installation guidance, the experience was seamless. Our flooring looks luxurious and the quality is unmatched.",
                    rating: 5
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                          <p className="text-xs text-slate-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${testimonialIndex === i ? 'w-6 bg-red-600' : 'w-1.5 bg-stone-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden lg:grid gap-8 grid-cols-3">
              {[
                {
                  name: "Rajesh Kumar",
                  role: "Interior Designer, Kolkata",
                  quote: "Shree Radhe Marble has been our go-to supplier for 5 years. Their Italian Carrara selection is exceptional, and the team understands quality like no other.",
                  rating: 5
                },
                {
                  name: "Priya Sharma",
                  role: "Homeowner, Agartala",
                  quote: "The Makrana marble they provided for our temple room is absolutely stunning. The craftsmanship and attention to detail exceeded our expectations.",
                  rating: 5
                },
                {
                  name: "Ankit Dey",
                  role: "Architect, Guwahati",
                  quote: "Professional service, premium quality, and competitive pricing. I recommend Shree Radhe to all my clients for their stone requirements.",
                  rating: 5
                },
                {
                  name: "Meera Chatterjee",
                  role: "Builder, Tripura",
                  quote: "We've completed over 20 projects with their materials. The consistency in quality and timely delivery makes them our preferred partner.",
                  rating: 5
                },
                {
                  name: "Sanjay Bhattacharya",
                  role: "Showroom Owner, Silchar",
                  quote: "Their handicraft collection is unique - authentic Makrana artistry that our customers love. Great wholesale terms and support.",
                  rating: 5
                },
                {
                  name: "Nisha Gupta",
                  role: "Homeowner, Dharmanagar",
                  quote: "From selection to installation guidance, the experience was seamless. Our flooring looks luxurious and the quality is unmatched.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-stone-50/50 to-transparent" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                Frequently Asked Questions
              </h2>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
            <p className="mt-6 text-slate-600 text-sm max-w-xl mx-auto">
              Everything you need to know about our products and services
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What types of marble do you offer?",
                answer: "We offer a wide range including Italian Carrara, Makrana White, Statuario, Emperador, and many more. Our collection includes both imported and Indian marbles to suit every budget and design preference."
              },
              {
                question: "Do you provide installation services?",
                answer: "While we primarily focus on supplying premium marble and tiles, we can recommend trusted installation partners in your area. We also provide detailed installation guidelines for all our products."
              },
              {
                question: "What is the minimum order quantity?",
                answer: "For most products, there's no strict minimum. However, for custom orders or bulk purchases, please contact us directly for the best pricing and availability information."
              },
              {
                question: "How do I maintain marble flooring?",
                answer: "Marble requires regular cleaning with pH-neutral cleaners and periodic sealing. Avoid acidic substances and use coasters under glasses. We provide detailed care instructions with every purchase."
              },
              {
                question: "Do you deliver outside Agartala?",
                answer: "Yes! We deliver across Tripura and to select locations in Northeast India. For other regions, we can arrange shipping through our logistics partners. Contact us for delivery estimates."
              },
              {
                question: "Can I visit your showroom?",
                answer: "Absolutely! Our showroom at AA Road, Kashipur Bazar, Agartala is open Monday to Saturday, 9 AM to 7 PM. We encourage visits to see and feel our products before purchasing."
              }
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left font-medium text-slate-900 hover:bg-stone-50 transition-colors outline-none"
                  >
                    <span className="pr-4 text-sm md:text-base">{faq.question}</span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="w-5 h-5 text-red-500 flex-shrink-0 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-stone-100 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-10">
            <p className="text-slate-600 text-sm mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300"
            >
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </AnimatedSection>

      </main>
      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />

      {/* Get a Quote Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
                  Your enquiry has been submitted successfully. We'll contact you shortly.
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
                    onClick={() => setIsQuoteOpen(false)}
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
                      onClick={() => setIsQuoteOpen(false)}
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


    </div>
  );
}
