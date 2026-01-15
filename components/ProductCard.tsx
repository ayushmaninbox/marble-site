'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="glass-hover rounded-xl overflow-hidden animate-scaleIn">
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold gradient-text">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button className="btn-primary text-sm py-2 px-4">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
