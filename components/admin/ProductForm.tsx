'use client';

import { useState } from 'react';
import { Product, ProductCategory } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: (product?.category || 'Marbles') as ProductCategory,
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
      <h3 className="text-2xl font-bold gradient-text mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
          required
        >
          <option value="Marbles">Marbles</option>
          <option value="Tiles">Tiles</option>
          <option value="Handicraft">Handicraft</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Price (₹)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          min="0"
          step="0.01"
          placeholder="Enter price in rupees"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
          placeholder="Enter image URL or path"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
