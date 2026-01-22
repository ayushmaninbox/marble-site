'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface FeaturedCarouselProps {
  products: Product[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    // Filter featured products
    const featured = products.filter(p => p.isFeatured);
    setFeaturedProducts(featured);
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (featuredProducts.length <= itemsToShow) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // 4 seconds natural pause
    return () => clearInterval(interval);
  }, [currentIndex, featuredProducts.length, itemsToShow]);

  if (featuredProducts.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => {
      // Loop back to 0 if we reach the end
      // The max index starts such that we show the last 'itemsToShow' items
      // But standard circular carousel usually loops endlessly or goes back to start
      // Simple loop:
      return (prev + 1) % featuredProducts.length;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  // Create a display array that helps with infinite-like illusion or just slicing
  // For true "3 cards thing", standard approach is moving a track window
  // We need to handle wrapping. The easiest visual way is to render enough duplicates
  // But simplifying: Just render the cyclic slice.
  
  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
        const index = (currentIndex + i) % featuredProducts.length;
        visible.push(featuredProducts[index]);
    }
    return visible;
  };
  
  const visibleProducts = getVisibleProducts();

  return (
    <div className="w-full py-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    <span className="text-amber-500">★</span> Featured Collection
                </h2>
            </div>
            
            <div className="relative group">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {visibleProducts.map((product, i) => (
                           <motion.div 
                              key={`${product.id}-${currentIndex}-${i}`} // Key depends on index to trigger animation
                              layout
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="w-full"
                           >
                               <ProductCard product={product} />
                           </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                {featuredProducts.length > itemsToShow && (
                    <>
                        <button 
                            onClick={handlePrev}
                            className="absolute top-1/2 -left-2 sm:-left-4 lg:-left-12 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-stone-100 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-200 transition-all z-20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleNext}
                            className="absolute top-1/2 -right-2 sm:-right-4 lg:-right-12 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border border-stone-100 flex items-center justify-center text-slate-700 hover:text-red-600 hover:border-red-200 transition-all z-20"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    </div>
  );
}
