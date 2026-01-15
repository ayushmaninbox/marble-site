'use client';

import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import ProductTabs from '@/components/ProductTabs';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<ProductCategory>('Marbles');
  const [loading, setLoading] = useState(true);

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
    fetchProducts();
    
    // Poll for updates every 5 seconds to show real-time changes
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto text-center animate-fadeIn">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            Shree Radhe Marble & Granite
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover premium quality marbles, tiles, and exquisite handicraft products. 
            Transform your space with our exclusive collection.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#products" className="btn-primary">
              Explore Products
            </a>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <Link href="/admin" className="btn-secondary">
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text animate-fadeIn">
            Our Premium Collection
          </h2>
          
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">
                No products available in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2026 Shree Radhe Marble & Granite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
