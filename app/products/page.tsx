'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FILTERS: Array<ProductCategory | 'All'> = ['All', 'Marbles', 'Tiles', 'Handicraft'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProductCategory | 'All'>('All');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100/40 via-purple-50/20 to-rose-100/40 text-slate-900 overflow-x-hidden">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-x-0 top-[-220px] -z-30 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.17),_transparent_55%)]" />
      <div className="pointer-events-none fixed right-[-120px] top-1/2 -z-30 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_60%)]" />

      {/* Header */}
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
            <Link href="/products" className="px-4 py-2 rounded-full text-blue-600 bg-blue-50/50 transition-all duration-200">
              Products
            </Link>
          </nav>
          <Link
            href="/"
            className="hidden rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] md:inline-flex"
          >
            Get a Quote
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 pb-16 pt-24 sm:px-6 lg:px-4">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-3 py-1 text-[11px] font-medium text-sky-700 shadow-sm shadow-sky-100">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
            Stone Collection
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-br from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-transparent sm:text-4xl">
                Products
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Browse our range of marbles, tiles, and handicraft stonework. Use filters to focus on the category you need.
              </p>
            </div>
          </div>
        </motion.header>

        {/* Category Tabs */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 z-20 mt-6 border-y border-blue-100/50 bg-white/80 py-4 backdrop-blur-md rounded-2xl px-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const active = selected === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelected(filter)}
                  className={`inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'border-blue-500 bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30'
                      : 'border-sky-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Products Grid */}
        <section className="mt-8">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">Loading products...</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-sky-200 bg-white/60 px-4 py-16 text-center text-sm text-slate-500 shadow-sm">
              No products found for this filter.
            </div>
          ) : (
            <motion.div 
              key={selected}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
