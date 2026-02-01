'use client';

import React from 'react';
import { Product } from '@/lib/types';

interface ProductTableProps {
  products: Product[];
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  onSelectAll?: (selectAll: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onPreview?: (product: Product) => void;
  onToggleFeatured?: (product: Product) => void;
  onReorder?: (productId: string, newIndex: number) => void;
}

export default function ProductTable({ 
  products, 
  selectedIds = [], 
  onSelect, 
  onSelectAll, 
  onEdit, 
  onDelete, 
  onPreview,
  onToggleFeatured,
  onReorder
}: ProductTableProps) {
  const allSelected = products.length > 0 && products.every(p => selectedIds.includes(p.id));
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedProduct = products[draggedIndex];
    if (onReorder && draggedProduct) {
      onReorder(draggedProduct.id, dropIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            {(onSelect && onSelectAll) && (
              <th className="px-4 py-3 w-10 text-left">
                <input 
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider md:block hidden">Date</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Featured</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {products.length === 0 ? (
            <tr>
              <td colSpan={onSelect ? 8 : 7} className="px-4 py-10 text-center text-sm text-slate-400">
                No products found. Click "Add Product" to get started.
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr 
                key={product.id} 
                draggable={!!onReorder}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`hover:bg-red-50/30 transition-colors ${
                  selectedIds.includes(product.id) ? 'bg-red-50/20' : ''
                } ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${
                  dragOverIndex === index ? 'border-t-2 border-red-500' : ''
                } ${
                  onReorder ? 'cursor-move' : ''
                }`}
              >
                {(onSelect && onSelectAll) && (
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => onSelect(product.id)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {onReorder && (
                      <div className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </div>
                    )}
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 relative">
                      <img
                        src={product.images?.[0] || product.image || ''}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="%23e2e8f0" width="40" height="40"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="12">?</text></svg>';
                        }}
                      />
                      {!product.inStock && (
                         <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                           <span className="text-[8px] text-white font-bold uppercase">Sold Out</span>
                         </div>
                      )}
                    </div>
                    <div className="flex flex-col max-w-[150px]">
                      <span className="text-sm font-medium text-slate-900 truncate">{product.name}</span>
                      {product.images && product.images.length > 1 && (
                        <span className="text-[10px] text-slate-400">{product.images.length} images</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                     <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${product.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                     </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                    product.category === 'Marbles'
                      ? 'bg-red-50 text-red-700'
                      : product.category === 'Granite'
                        ? 'bg-purple-50 text-purple-700'
                        : product.category === 'Tiles'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-orange-50 text-orange-700'
                    }`}>
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap md:block hidden">
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit'
                  }) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                    {onToggleFeatured && (
                      <button 
                        onClick={() => onToggleFeatured(product)}
                        className={`p-1 rounded-full transition-colors ${product.isFeatured ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-slate-400'}`}
                        title={product.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                      >
                         <svg className="w-5 h-5" fill={product.isFeatured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                         </svg>
                      </button>
                    )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {onPreview && (
                      <button
                        onClick={() => onPreview(product)}
                        className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-xs font-medium transition-colors"
                        title="Preview"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(product)}
                      className="text-xs font-semibold text-slate-600 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this product?')) {
                          onDelete(product.id);
                        }
                      }}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
