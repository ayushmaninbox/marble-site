'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS: Array<ProductCategory | 'All'> = ['All', 'Marbles', 'Tiles', 'Handicraft'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProductCategory | 'All'>('All');
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  
  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    mobile: '',
    productCategory: 'Marbles' as ProductCategory,
    productName: '',
    quantity: '100',
    message: ''
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

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

  const visibleProducts = useMemo(() => {
    if (selected === 'All') return products;
    return products.filter((p) => p.category === selected);
  }, [products, selected]);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    // Simulate API call
    if (quoteForm.mobile.length < 10) {
        alert("Please enter a valid mobile number");
        setQuoteSubmitting(false);
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Quote request sent successfully! We will contact you soon.');
    setQuoteSubmitting(false);
    setIsQuoteOpen(false);
    setQuoteForm({ ...quoteForm, name: '', mobile: '', message: '' });
  };

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

        {/* Filter Navigation */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-y border-stone-100 py-4 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
             <div className="flex flex-wrap items-center justify-center gap-2 md:gap-8">
               {FILTERS.map((filter) => (
                 <button
                   key={filter}
                   onClick={() => setSelected(filter)}
                   className={`text-xs md:text-sm font-semibold tracking-widest uppercase py-2 px-4 transition-all duration-300 relative
                     ${selected === filter ? 'text-red-700' : 'text-slate-500 hover:text-slate-800'}
                   `}
                 >
                   {filter}
                   {selected === filter && (
                     <motion.div 
                       layoutId="activeFilter"
                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" 
                     />
                   )}
                 </button>
               ))}
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
          ) : visibleProducts.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-stone-200 rounded-lg">
              <p className="text-slate-500 font-light">No products found in this category.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12"
            >
              <AnimatePresence mode='popLayout'>
                {visibleProducts.map((product) => (
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
          )}
        </div>
      </main>

      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />

      {/* Quote Modal (Red Theme) */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
                    onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
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
                    onChange={e => setQuoteForm({...quoteForm, mobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Product Interest</label>
                 <select 
                   className="w-full rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                   value={quoteForm.productCategory}
                   onChange={e => setQuoteForm({...quoteForm, productCategory: e.target.value as ProductCategory})}
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
                  onChange={e => setQuoteForm({...quoteForm, message: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsQuoteOpen(false)}
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
    </div>
  );
}
