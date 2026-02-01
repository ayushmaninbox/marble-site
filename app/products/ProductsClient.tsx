'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS: Array<ProductCategory | 'All'> = ['All', 'Marbles', 'Tiles', 'Granite', 'Handicraft'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProductCategory | 'All'>('All');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Sorting and Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('default');
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && ['Marbles', 'Tiles', 'Granite', 'Handicraft', 'All'].includes(categoryParam)) {
      setSelected(categoryParam as ProductCategory | 'All');
    } else if (!categoryParam) {
      setSelected('All');
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = selected === 'All' ? [...products] : products.filter((p) => p.category === selected);

    // Apply Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      // Primary sort: Availability (In Stock first)
      if (a.inStock !== b.inStock) {
        return a.inStock ? -1 : 1;
      }

      // Secondary sort: Selected criteria
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [products, selected, sortBy, searchQuery]);

  // Paginated products
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selected, sortBy, itemsPerPage, searchQuery]);



  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">

      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} isRevealed={true} />

      <main className="pt-24 pb-20">

        {/* Elegant Hero Section */}
        <div className="text-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">
              Our Collection
            </h1>
            <div className="h-1 w-20 bg-red-600 mx-auto mb-6" />
            <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light tracking-wide">
              Explore our curated selection of premium marbles, granites, and handcrafted stones.
              Each piece is selected for its unique character and timeless beauty.
            </p>
          </motion.div>
        </div>



        {/* Search Bar - Blog Style (Above Featured) */}
        <div className="max-w-md mx-auto mb-12 px-4 relative z-10 -mt-8">
           <div className="relative shadow-lg rounded-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-full border border-stone-200 bg-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-400"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
        </div>

        {/* Featured Carousel - Always Visible */}
        {!loading && <FeaturedCarousel products={products} />}

        {/* Filter Navigation */}
        <div className="sticky top-[64px] md:top-[72px] z-40 bg-white border-y border-stone-100 py-4 mb-6 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8 mb-4">
              {FILTERS.map((filter) => {
                const isSelected = selected === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setSelected(filter)}
                    className={`text-xs md:text-sm font-semibold tracking-widest uppercase py-2 px-4 transition-all duration-300 relative
                      ${isSelected ? 'text-red-700' : 'text-slate-500 hover:text-slate-800'}
                    `}
                  >
                    {filter}
                    {isSelected && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort and Items Per Page Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
              {/* Left: Sort By */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Right: Items Info and Per Page */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-slate-700">{totalItems}</span> items
                </span>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              <p className="mt-4 text-xs tracking-widest uppercase text-slate-400">Loading Collection...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-stone-200 rounded-lg">
              <p className="text-slate-500 font-light">No products found in this category.</p>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12"
              >
                <AnimatePresence mode='popLayout'>
                  {paginatedProducts.map((product: Product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'hover:bg-slate-100 text-slate-600'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div >
  );
}
