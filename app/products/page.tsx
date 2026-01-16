'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

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
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <header className="space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Stone Collection
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Products
              </h1>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Browse our range of marbles, tiles, and handicraft stonework. Use filters to focus on the category you need.
              </p>
            </div>
          </div>
        </header>

        <section className="sticky top-16 z-20 mt-8 border-y border-slate-100 bg-white/90 py-3 backdrop-blur-md sm:top-20">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((filter) => {
              const active = selected === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelected(filter)}
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">Loading products...</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-sm text-slate-500">
              No products found for this filter.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
