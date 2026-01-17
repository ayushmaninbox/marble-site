'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_18px_45px_rgba(56,189,248,0.18)] transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_28px_70px_rgba(59,130,246,0.3)]">
      <div className="relative overflow-hidden h-64 bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10" />
        {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute left-3 top-3 z-20 inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-800 shadow-sm backdrop-blur">
          {product.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-lg font-semibold text-transparent">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-xs font-medium text-slate-900 shadow-sm transition hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
