'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Get the first image from images array, or fall back to legacy image field
  const displayImage = product.images?.[0] || product.image || '';
  const isOutOfStock = product.inStock === false;

  return (
    <Link href={`/products/${product.id}`}>
      <article className={`group flex flex-col overflow-hidden rounded-md border bg-white shadow-sm transition hover:-translate-y-1 cursor-pointer ${isOutOfStock ? 'border-stone-300 opacity-75' : 'border-stone-200 hover:border-red-200 hover:shadow-lg hover:shadow-red-500/10'}`}>
        <div className={`relative overflow-hidden h-52 sm:h-64 bg-stone-100 ${isOutOfStock ? 'grayscale' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
          {displayImage && (displayImage.startsWith('http') || displayImage.startsWith('/')) ? (
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 ${isOutOfStock ? '' : 'group-hover:scale-110'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute left-3 top-3 z-20 inline-flex rounded-sm bg-white/95 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-stone-800 shadow-sm backdrop-blur">
            {product.category}
          </div>
          {product.isFeatured && (
            <div className="absolute right-3 top-3 z-20 inline-flex items-center justify-center rounded-full bg-amber-400 p-1.5 shadow-sm text-white" title="Featured Product">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                 <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
               </svg>
            </div>
          )}
          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <span className="bg-slate-900/80 text-white px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <h3 className={`text-lg font-serif transition-colors ${isOutOfStock ? 'text-slate-500' : 'text-slate-900 group-hover:text-red-700'}`}>{product.name}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500 font-light leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-3">
            <span className={`text-base font-medium ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-1 ${isOutOfStock ? 'text-slate-400' : 'text-red-600 group-hover:translate-x-1 transition-transform'}`}>
              View Details 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

