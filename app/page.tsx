'use client';

import { useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import ProductTabs from '@/components/ProductTabs';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<ProductCategory>('Marbles');
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const scrollY = useParallax();
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

  const filteredProducts = products.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Parallax background accents */}
      <div
        className="pointer-events-none fixed inset-x-0 top-[-220px] -z-30 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.17),_transparent_55%)]"
        style={{ transform: `translate3d(0, ${scrollY * 0.12}px, 0)` }}
      />
      <div
        className="pointer-events-none fixed right-[-120px] top-1/2 -z-30 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_60%)]"
        style={{ transform: `translate3d(0, ${scrollY * -0.08}px, 0)` }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 lg:px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 via-sky-500 to-sky-300 shadow-md" />
            <div className="flex flex-col leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600 bg-clip-text text-sm font-semibold tracking-tight text-transparent">
                Shree Radhe Marble &amp; Granite
              </span>
              <span className="text-[11px] text-slate-500">Premium Stone Surfaces</span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <a href="#top" className="hover:text-blue-600">
              Home
            </a>
            <a href="#products" className="hover:text-blue-600">
              Products
            </a>
            <a href="#gallery" className="hover:text-blue-600">
              Gallery
            </a>
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="hover:text-blue-600"
            >
              Contact
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsQuoteOpen(true)}
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 md:inline-flex"
          >
            Get a Quote
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
            aria-label="Open navigation"
          >
            <span className="block h-[2px] w-4 rounded-full bg-slate-700" />
          </button>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-4">
        {/* Hero Section */}
        <ScrollReveal className="relative py-12 sm:py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[url('/textures/marble-hero.png')] bg-cover bg-fixed bg-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-slate-50 to-sky-50" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-3 py-1 text-[11px] font-medium text-sky-700 shadow-sm shadow-sky-100">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
                Premium marble &amp; granite for modern spaces
              </div>

              <h1 className="bg-gradient-to-br from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                Elevate every surface with
                <span className="block text-transparent">precision-crafted stone</span>
              </h1>

              <p className="max-w-xl text-sm text-slate-600 sm:text-base">
                From luxury residences to high-traffic commercial spaces, we source and craft premium marble,
                granite, and tiles to match your design vision.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsQuoteOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-3 text-sm font-medium text-white shadow-sm shadow-sky-200 transition duration-200 hover:brightness-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:scale-[0.98]"
                >
                  Send Inquiry
                </button>
                <a
                  href="#products"
                  className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/90 px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition duration-200 hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  View Products
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500 sm:text-sm">
                <span>20+ years of expertise</span>
                <span className="h-[1px] w-6 bg-slate-200" />
                <span>Trusted by architects &amp; interior designers</span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                <div className="aspect-[4/3] bg-[url('/images/marble-showcase.jpg')] bg-cover bg-center" />
                <div className="space-y-3 p-5">
                  <h3 className="text-base font-semibold text-slate-900">
                    Bespoke stone for every project
                  </h3>
                  <p className="text-sm text-slate-600">
                    Large-format slabs, precision cuts, and curated finishes for kitchens, lobbies, staircases, and more.
                  </p>
                </div>
              </div>

              <div className="pointer-events-none absolute -left-4 -top-4 hidden w-40 rounded-2xl bg-white/90 p-3 text-xs shadow-[0_18px_45px_rgba(15,23,42,0.15)] backdrop-blur-md sm:block">
                <div className="text-[11px] font-medium text-slate-500">Completed Projects</div>
                <div className="text-xl font-semibold text-slate-900">500+</div>
              </div>
              <div className="pointer-events-none absolute -right-3 bottom-6 hidden w-40 rounded-2xl bg-slate-900/95 p-3 text-xs text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.2)] backdrop-blur-md sm:block">
                <div className="text-[11px] font-medium text-slate-300">Avg. Lead Time</div>
                <div className="text-xl font-semibold text-white">7–14 days</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Product Categories (static) */}
        <ScrollReveal className="space-y-6 py-8 lg:py-10">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Product Categories
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Explore marble, granite, tiles, and handicraft pieces tailored to residential and commercial projects.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {["Marbles", "Tiles", "Handicraft", "Custom Work"].map((label, idx) => (
              <article
                key={label}
                className="group flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_18px_45px_rgba(56,189,248,0.18)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_70px_rgba(59,130,246,0.3)]"
              >
                <div className="relative overflow-hidden">
                  <div
                    className={"aspect-[4/3] bg-gradient-to-br " +
                      [
                        'from-sky-100 via-blue-50 to-emerald-50',
                        'from-amber-100 via-orange-50 to-yellow-50',
                        'from-violet-100 via-sky-50 to-indigo-50',
                        'from-slate-100 via-sky-50 to-blue-100',
                      ][idx]}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{label}</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Premium surfaces selected for durability and aesthetic consistency.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        {/* Dynamic Products Section */}
        <ScrollReveal id="products" className="space-y-6 py-10 lg:py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Our premium collection
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Browse live inventory managed from the admin panel. Use the tabs to switch between marble, tiles, and handicraft.
            </p>
          </div>

          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No products available in this category yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal className="space-y-8 py-10 lg:py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Why choose Shree Radhe
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              A single partner for sourcing, cutting, finishing, and delivering premium stone on time.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Premium quality',
                desc: 'Handpicked slabs, strict inspection, and consistent finishes for every batch.',
                color: 'from-emerald-400 to-emerald-600',
              },
              {
                title: 'Best pricing',
                desc: 'Direct relationships with quarries and suppliers keep your project on budget.',
                color: 'from-amber-400 to-orange-500',
              },
              {
                title: 'Custom solutions',
                desc: 'Edges, inlays, patterns, and finishes tailored to your drawings and site.',
                color: 'from-sky-400 to-blue-600',
              },
              {
                title: 'Fast delivery',
                desc: 'Optimised cutting and logistics to align with site schedules.',
                color: 'from-rose-400 to-pink-600',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                  <span className="text-xs font-semibold">◆</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-600">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        {/* Gallery placeholder */}
        <ScrollReveal id="gallery" className="space-y-8 py-10 lg:py-14">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Project gallery
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Showcase residential, commercial, and hospitality spaces finished with our stone.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100 shadow-[0_18px_45px_rgba(56,189,248,0.18)]"
              >
                <div className="aspect-[4/3] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(37,99,235,0.22),_transparent_55%)] transition-transform duration-500 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA Banner */}
        <ScrollReveal className="py-10 lg:py-14">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-900 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.6)] sm:px-10 sm:py-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Fast response · typically within 24 hours
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Looking for premium stone?
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-200">
                  Share your requirements and our team will help you choose the right stone, finish, and sizing for your project.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Footer */}
        <footer className="py-10 text-center text-xs text-slate-500">
          © 2026 Shree Radhe Marble &amp; Granite. All rights reserved.
        </footer>
      </main>

      {/* Get a Quote Modal */}
      {isQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
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
              onSubmit={(e) => {
                e.preventDefault();
                setIsQuoteOpen(false);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="q-name">
                    Full Name
                  </label>
                  <input
                    id="q-name"
                    type="text"
                    required
                    className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="q-phone">
                    Phone
                  </label>
                  <input
                    id="q-phone"
                    type="tel"
                    required
                    className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600" htmlFor="q-email">
                  Email
                </label>
                <input
                  id="q-email"
                  type="email"
                  required
                  className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="q-type">
                    Product Type
                  </label>
                  <select
                    id="q-type"
                    className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    <option>Marbles</option>
                    <option>Tiles</option>
                    <option>Handicraft</option>
                    <option>Custom work</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-600" htmlFor="q-qty">
                    Quantity / Area
                  </label>
                  <input
                    id="q-qty"
                    type="text"
                    placeholder="e.g. 200 sq.ft"
                    className="h-9 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600" htmlFor="q-msg">
                  Project details
                </label>
                <textarea
                  id="q-msg"
                  rows={3}
                  placeholder="Share room type, finish preference, timelines, etc."
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
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2 font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-xl font-semibold">WA</span>
      </a>
    </div>
  );
}

type ScrollRevealProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

function ScrollReveal({ id, className = '', children }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref as any}
      id={id}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </section>
  );
}

function useParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}
