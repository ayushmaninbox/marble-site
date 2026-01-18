'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, Enquiry, ProductCategory } from '@/lib/types';
import ProductTable from '@/components/admin/ProductTable';

// SVG Icons
const BoxIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Marbles' as ProductCategory,
    description: '',
    price: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState<'newest' | 'enquired' | 'az' | 'za'>('newest');
  const [productFilterCategory, setProductFilterCategory] = useState<'all' | ProductCategory>('all');
  const [productFilterDate, setProductFilterDate] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchProducts();
    fetchEnquiries();
  }, []);

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

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  // Image upload handlers
  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setFormError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('File too large. Maximum size is 5MB.');
      return;
    }
    setFormError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, image: '' }); // Clear URL if file selected
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await response.json();
      return result.path;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setFormError('Price must be greater than 0');
      return;
    }
    
    // Check if we have an image (either file or URL)
    if (!imageFile && !formData.image.trim()) {
      setFormError('Please upload an image or provide an image URL');
      return;
    }

    if (!editingProduct) {
      const duplicate = products.find(
        p => p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );
      if (duplicate) {
        setFormError('A product with this name already exists');
        return;
      }
    }

    setFormSubmitting(true);

    try {
      // Upload image first if we have a file
      let imagePath = formData.image.trim();
      if (imageFile) {
        const uploadedPath = await uploadImage();
        if (!uploadedPath) {
          setFormError('Failed to upload image. Please try again.');
          setFormSubmitting(false);
          return;
        }
        imagePath = uploadedPath;
      }

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: imagePath,
      };

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        closeForm();
      } else {
        setFormError('Failed to save product. Please try again.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Failed to save product. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(undefined);
    setFormData({
      name: '',
      category: 'Marbles',
      description: '',
      price: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setUploadMode('file');
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
    });
    setImageFile(null);
    setImagePreview(product.image); // Show existing image
    setUploadMode(product.image.startsWith('/uploads') ? 'file' : 'url');
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    setFormData({
      name: '',
      category: 'Marbles',
      description: '',
      price: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => {
    const searchLower = productSearch.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);

    const matchesCategory = productFilterCategory === 'all' || product.category === productFilterCategory;

    let matchesDate = true;
    if (productFilterDate !== 'all') {
      const date = new Date(product.createdAt);
      const now = new Date();
      date.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      if (productFilterDate === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = date >= weekAgo;
      } else if (productFilterDate === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        matchesDate = date >= monthAgo;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  }).sort((a, b) => {
    switch (productSort) {
      case 'az': return a.name.localeCompare(b.name);
      case 'za': return b.name.localeCompare(a.name);
      case 'enquired': {
        const countA = enquiries.filter(e => e.productName === a.name).length;
        const countB = enquiries.filter(e => e.productName === b.name).length;
        return countB - countA;
      }
      case 'newest': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const inputClasses = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BoxIcon /> PRODUCTS
          </h3>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <SortIcon /> Sort
              </span>
              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
              >
                <option value="newest">Recently Added</option>
                <option value="enquired">Most Enquired</option>
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <FilterIcon /> Category
              </span>
              <select
                value={productFilterCategory}
                onChange={(e) => setProductFilterCategory(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Categories</option>
                <option value="Marbles">Marbles</option>
                <option value="Tiles">Tiles</option>
                <option value="Handicraft">Handicraft</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <CalendarIcon /> Date
              </span>
              <select
                value={productFilterDate}
                onChange={(e) => setProductFilterDate(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-lg border border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing</span>
          <span className="font-semibold text-slate-900">{startIndex + 1}-{endIndex}</span>
          <span>of</span>
          <span className="font-semibold text-slate-900">{totalProducts}</span>
          <span>products</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600">Per page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-blue-400"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded border border-slate-200 text-sm disabled:opacity-50 hover:bg-slate-50"
            >
              ←
            </button>
            <span className="px-3 py-1 text-sm">{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 rounded border border-slate-200 text-sm disabled:opacity-50 hover:bg-slate-50"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <ProductTable
          products={paginatedProducts}
          onEdit={openEditForm}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={closeForm}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Italian Carrara"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className={inputClasses}
                  >
                    <option value="Marbles">Marbles</option>
                    <option value="Tiles">Tiles</option>
                    <option value="Handicraft">Handicraft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25000"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600">Product Image</label>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode(uploadMode === 'file' ? 'url' : 'file');
                      setImageFile(null);
                      setImagePreview(editingProduct?.image || '');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <LinkIcon />
                    {uploadMode === 'file' ? 'Use URL instead' : 'Upload file instead'}
                  </button>
                </div>

                {uploadMode === 'file' ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-lg transition-all ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    } ${imagePreview ? 'p-2' : 'p-6'}`}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <CloseIcon />
                        </button>
                        {imageFile && (
                          <div className="mt-2 text-xs text-slate-600 truncate">
                            {imageFile.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto text-slate-400 mb-2">
                          <UploadIcon />
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          Drag & drop an image here, or
                        </p>
                        <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
                          browse to upload
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileSelect(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-slate-400 mt-2">
                          JPEG, PNG, WebP, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className={inputClasses}
                  />
                )}

                {uploadMode === 'url' && imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-24 object-cover rounded-lg"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief product description..."
                  rows={2}
                  className={inputClasses + " resize-none"}
                />
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={formSubmitting || isUploading}
                  className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : formSubmitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
