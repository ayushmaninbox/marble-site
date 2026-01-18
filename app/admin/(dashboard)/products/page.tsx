'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, Enquiry, ProductCategory } from '@/lib/types';
import ProductTable from '@/components/admin/ProductTable';
import Image from 'next/image';

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

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MAX_IMAGES = 7;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form state - updated for multi-image
  const [formData, setFormData] = useState({
    name: '',
    category: 'Marbles' as ProductCategory,
    description: '',
    price: '',
  });
  const [formImages, setFormImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
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
  const handleFileSelect = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    const remainingSlots = MAX_IMAGES - formImages.length - pendingFiles.length;
    if (fileArray.length > remainingSlots) {
      setFormError(`Can only add ${remainingSlots} more image(s). Maximum is ${MAX_IMAGES}.`);
      return;
    }

    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        setFormError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File too large. Maximum size is 5MB.');
        return;
      }
    }
    
    setFormError('');
    setPendingFiles(prev => [...prev, ...fileArray]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
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
      return null;
    }
  };

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setFormImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const pendingIndex = index - formImages.length;
      setPendingFiles(prev => prev.filter((_, i) => i !== pendingIndex));
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
    
    const totalImages = formImages.length + pendingFiles.length;
    if (totalImages === 0) {
      setFormError('Please add at least one image');
      return;
    }
    if (totalImages > MAX_IMAGES) {
      setFormError(`Maximum ${MAX_IMAGES} images allowed`);
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
    setIsUploading(true);

    try {
      // Upload all pending files
      const uploadedPaths: string[] = [];
      for (const file of pendingFiles) {
        const path = await uploadImage(file);
        if (path) {
          uploadedPaths.push(path);
        } else {
          setFormError('Failed to upload one or more images. Please try again.');
          setFormSubmitting(false);
          setIsUploading(false);
          return;
        }
      }

      const allImages = [...formImages, ...uploadedPaths];

      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        images: allImages,
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
        const error = await response.json();
        setFormError(error.error || 'Failed to save product. Please try again.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Failed to save product. Please try again.');
    } finally {
      setFormSubmitting(false);
      setIsUploading(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(undefined);
    setFormData({
      name: '',
      category: 'Marbles',
      description: '',
      price: '',
    });
    setFormImages([]);
    setPendingFiles([]);
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
    });
    setFormImages(product.images || (product.image ? [product.image] : []));
    setPendingFiles([]);
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
    });
    setFormImages([]);
    setPendingFiles([]);
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

  // Get all images for display (existing + pending)
  const allFormImages = [
    ...formImages.map(url => ({ type: 'existing' as const, url })),
    ...pendingFiles.map(file => ({ type: 'pending' as const, file, url: URL.createObjectURL(file) })),
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-6 bg-slate-50 min-h-screen">
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
          onPreview={(product) => {
            setPreviewProduct(product);
            setPreviewImageIndex(0);
          }}
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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

              {/* Multi-Image Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-600">
                    Product Images ({allFormImages.length}/{MAX_IMAGES})
                  </label>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {allFormImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group">
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, img.type === 'existing')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {allFormImages.length < MAX_IMAGES && (
                    <label
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`aspect-square rounded-lg border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                      }`}
                    >
                      <PlusIcon />
                      <span className="text-xs text-slate-500 mt-1">Add</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) handleFileSelect(e.target.files);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Drag & drop or click to add images. First image is the primary display image.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief product description..."
                  rows={3}
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

      {/* Product Preview Modal - Redesigned */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-8">
          <div className="mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Customer View Preview</span>
              </div>
              <button
                onClick={() => setPreviewProduct(null)}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Product Content */}
            <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
              {/* Image Gallery */}
              <div className="space-y-3">
                {/* Main Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                  {(() => {
                    const images = previewProduct.images?.length ? previewProduct.images : (previewProduct.image ? [previewProduct.image] : []);
                    const currentImage = images[previewImageIndex];
                    return currentImage ? (
                      <>
                        <img
                          src={currentImage}
                          alt={previewProduct.name}
                          className="w-full h-full object-cover"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => setPreviewImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setPreviewImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    );
                  })()}
                </div>

                {/* Thumbnails */}
                {(() => {
                  const images = previewProduct.images?.length ? previewProduct.images : (previewProduct.image ? [previewProduct.image] : []);
                  return images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setPreviewImageIndex(index)}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                            index === previewImageIndex
                              ? 'ring-2 ring-blue-500 ring-offset-1'
                              : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${previewProduct.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <span className={`self-start inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${
                  previewProduct.category === 'Marbles' ? 'bg-blue-100 text-blue-700' :
                  previewProduct.category === 'Tiles' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-violet-100 text-violet-700'
                }`}>
                  {previewProduct.category}
                </span>

                <h2 className="text-2xl font-bold text-slate-900 mb-3">{previewProduct.name}</h2>

                <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">{previewProduct.description}</p>

                <div className="text-3xl font-bold text-slate-900 mb-6">
                  ₹{previewProduct.price.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-slate-500 ml-2">per unit</span>
                </div>

                {/* Action Preview */}
                <div className="bg-slate-900 text-white rounded-xl p-4 text-center">
                  <p className="text-sm font-medium">Send Enquiry</p>
                  <p className="text-xs opacity-70 mt-1">Get a quote for this product</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
