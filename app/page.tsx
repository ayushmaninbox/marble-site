'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, ProductCategory } from '@/lib/types';
import { AnimatedSection } from '@/components/AnimatedSection';
import { TextReveal } from '@/components/TextReveal';
import { TypewriterText } from '@/components/TypewriterText';
import { DynamicBackground } from '@/components/DynamicBackground';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [marbleIndex, setMarbleIndex] = useState(0);
  const [tilesIndex, setTilesIndex] = useState(0);
  const [handicraftIndex, setHandicraftIndex] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
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
  const [formErrors, setFormErrors] = useState<{
    phone?: string;
    email?: string;
    quantity?: string;
  }>({});
  
  // Cinematic reveal state - triggers after video plays for 0.7 seconds
  const [isRevealed, setIsRevealed] = useState(false);
  
  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, 700);
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

  useEffect(() => {
    // Disable browser scroll restoration and force scroll to top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    fetchProducts();

    // Poll for updates every 5 seconds to show real-time changes
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter products by category
  const marbleProducts = products.filter(p => p.category === 'Marbles');
  const tilesProducts = products.filter(p => p.category === 'Tiles');
  const handicraftProducts = products.filter(p => p.category === 'Handicraft');

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

  const validateForm = () => {
    const errors: { phone?: string; email?: string; quantity?: string } = {};

    // Phone validation - exactly 10 digits
    const phoneDigits = quoteForm.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.phone = 'Phone must be exactly 10 digits';
    }

    // Email validation - must contain @ and be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(quoteForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Quantity validation - 1 to 9999
    const qty = parseInt(quoteForm.quantity);
    if (isNaN(qty) || qty < 1 || qty > 9999) {
      errors.quantity = 'Quantity must be between 1 and 9999';
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

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteForm),
      });

      if (response.ok) {
        setQuoteSuccess(true);
        setQuoteForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          productCategory: 'Marbles',
          productName: '',
          quantity: '1',
          message: '',
        });
        setFormErrors({});
        // Auto close after 3 seconds
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

      {/* Header - Animates in after video reveal */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={isRevealed ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-blue-100/50 bg-gradient-to-r from-white/95 via-blue-50/90 to-sky-50/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(59,130,246,0.1)]"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-4">
          <div className="flex items-center gap-3">
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
          </div>

          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            <a href="#top" className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200">
              Home
            </a>
            <Link href="/products" className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200">
              Products
            </Link>
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
            >
              Contact
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="hidden rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] md:inline-flex"
          >
            Get a Quote
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/50 bg-white/80 text-slate-700 shadow-sm backdrop-blur-sm md:hidden hover:bg-blue-50/50 transition-colors"
            aria-label="Open navigation"
          >
            <span className="block h-[2px] w-4 rounded-full bg-gradient-to-r from-blue-600 to-sky-500" />
          </button>
        </div>
      </motion.header>


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
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                Marble Collections
              </h2>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Description + Right Carousel */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-light text-red-500 leading-tight">
                Premium<br />Marbles
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Indulge in the glory of class-apart Imported Marble from Shree Radhe. Our popular offerings range from Statuario Marble, Travertine Marble to Flawless White & Cat's Eye Marble.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4">
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
                <div className="pt-4 pb-6">
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
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <AnimatedSection className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                Tiles Collection
              </h2>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Description + Right Carousel */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-light text-red-500 leading-tight">
                Designer<br />Tiles
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Discover our exclusive tile collection featuring Italian porcelain, designer floor tiles, and premium wall coverings for modern interiors.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4">
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

            {/* Right Column - Carousel */}
            <div className="relative overflow-hidden">
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
                <div className="pt-4 pb-6">
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
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        {/* Handicraft Collection Carousel Section */}
        <AnimatedSection className="py-16 lg:py-24" staggerChildren={0.1}>
          {/* Section Header with Decorative Brackets */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              <span className="absolute -top-3 -left-6 w-5 h-5 border-l-2 border-t-2 border-red-500" />
              <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-slate-900 uppercase">
                Handicraft Collection
              </h2>
              <span className="absolute -bottom-3 -right-6 w-5 h-5 border-r-2 border-b-2 border-red-500" />
            </div>
          </div>

          {/* Content: Left Description + Right Carousel */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-light text-red-500 leading-tight">
                Artisan<br />Handicrafts
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Handcrafted masterpieces created by skilled artisans. Each piece tells a unique story of tradition and excellence in marble craftsmanship.
              </p>
              {/* Navigation Arrows */}
              <div className="flex items-center gap-4 pt-4">
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
                <div className="pt-4 pb-6">
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
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200/50 bg-gradient-to-b from-transparent to-slate-50/50 pt-12 pb-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-md" />
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 bg-clip-text text-sm font-bold text-transparent">
                  Shree Radhe Marble
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Premium marble, granite, and tiles for residential and commercial projects. Trusted by architects and designers since 2004.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#top" className="hover:text-blue-600 transition-colors">Home</a></li>
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Products</a></li>
                <li><button onClick={() => setIsQuoteOpen(true)} className="hover:text-blue-600 transition-colors">Get a Quote</button></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Products</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Italian Marble</a></li>
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Indian Granite</a></li>
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Designer Tiles</a></li>
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Handicraft Items</a></li>
                <li><a href="#products" className="hover:text-blue-600 transition-colors">Custom Fabrication</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Contact Us</h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">📍</span>
                  <span>123 Stone Market Road,<br />Kishangarh, Rajasthan 305801<br />India</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📞</span>
                  <a href="tel:+911234567890" className="hover:text-blue-600 transition-colors">+91 12345 67890</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✉️</span>
                  <a href="mailto:info@shreeradhemarble.com" className="hover:text-blue-600 transition-colors">info@shreeradhemarble.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 Shree Radhe Marble &amp; Granite. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors text-sm">Terms of Service</a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white text-xs hover:scale-105 transition-transform">WA</a>
            </div>
          </div>
        </footer>
      </main>

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
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                        className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.email ? 'border-red-400' : 'border-slate-200'}`}
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
                        className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.phone ? 'border-red-400' : 'border-slate-200'}`}
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
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                      className={`h-9 rounded-lg border bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 ${formErrors.quantity ? 'border-red-400' : 'border-slate-200'}`}
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
                      className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2 font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md disabled:opacity-50"
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

      {/* Floating WhatsApp Button - Animates in with reveal */}
      <motion.a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={isRevealed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-xl font-semibold">WA</span>
      </motion.a>
    </div>
  );
}
