'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product, Enquiry, ProductCategory } from '@/lib/types';
import ProductTable from '@/components/admin/ProductTable';
import EnquiriesTable from '@/components/admin/EnquiriesTable';

// SVG Icons
const BoxIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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

const HashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [activeTab, setActiveTab] = useState<'products' | 'enquiries'>('products');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Marbles' as ProductCategory,
    description: '',
    price: '',
    image: '',
  });

  // Product Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState<'newest' | 'enquired' | 'az' | 'za'>('newest');
  const [productFilterCategory, setProductFilterCategory] = useState<'all' | ProductCategory>('all');
  const [productFilterDate, setProductFilterDate] = useState<'all' | 'week' | 'month'>('all');

  // Enquiry Filter State
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquirySort, setEnquirySort] = useState<'newest' | 'oldest' | 'pending' | 'solved' | 'quantity-high' | 'quantity-low'>('newest');
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<'all' | 'pending' | 'solved'>('all');
  const [enquiryFilterDate, setEnquiryFilterDate] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    fetchProducts();
    fetchEnquiries();
  }, [router]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
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
    if (!formData.image.trim()) {
      setFormError('Image URL is required');
      return;
    }

    // Check for duplicate product name (only for new products)
    if (!editingProduct) {
      const duplicate = products.find(
        p => p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );
      if (duplicate) {
        setFormError('A product with this name already exists in the catalogue');
        return;
      }
    }

    setFormSubmitting(true);

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: formData.image.trim(),
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

  const handleDeleteEnquiry = async (id: string) => {
    try {
      const response = await fetch(`/api/enquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEnquiries();
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: 'pending' | 'solved') => {
    try {
      const response = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await fetchEnquiries();
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      alert('Failed to update enquiry status');
    }
  };

  const handleBatchUpdateEnquiryStatus = async (ids: string[], status: 'pending' | 'solved') => {
    try {
      const response = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });

      if (response.ok) {
        await fetchEnquiries();
      }
    } catch (error) {
      console.error('Error updating enquiries status:', error);
      alert('Failed to update enquiries status');
    }
  };

  const handleBatchDeleteEnquiries = async (ids: string[]) => {
    try {
      const response = await fetch(`/api/enquiries?ids=${ids.join(',')}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEnquiries();
      }
    } catch (error) {
      console.error('Error deleting enquiries:', error);
      alert('Failed to delete enquiries');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin');
  };

  const filteredProducts = products.filter(product => {
    // Search
    const searchLower = productSearch.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower);

    // Filter Category
    const matchesCategory = productFilterCategory === 'all' || product.category === productFilterCategory;

    // Filter Date
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

  // Enquiry Stats (Global)
  const totalEnquiries = enquiries.length;
  const solvedEnquiries = enquiries.filter(e => e.status === 'solved').length;
  const pendingEnquiries = totalEnquiries - solvedEnquiries;

  // Enquiry Filtering Logic
  const filteredEnquiries = enquiries.filter(enquiry => {
    // Search
    const searchLower = enquirySearch.toLowerCase();
    const matchesSearch =
      enquiry.firstName.toLowerCase().includes(searchLower) ||
      enquiry.lastName.toLowerCase().includes(searchLower) ||
      enquiry.email.toLowerCase().includes(searchLower) ||
      enquiry.productName.toLowerCase().includes(searchLower);

    // Filter Status
    const matchesStatus = enquiryFilterStatus === 'all' || enquiry.status === enquiryFilterStatus;

    // Filter Date
    let matchesDate = true;
    if (enquiryFilterDate !== 'all') {
      const date = new Date(enquiry.createdAt);
      const now = new Date();
      date.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      if (enquiryFilterDate === 'today') {
        matchesDate = date.getTime() === now.getTime();
      } else if (enquiryFilterDate === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = date >= weekAgo;
      } else if (enquiryFilterDate === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        matchesDate = date >= monthAgo;
      } else if (enquiryFilterDate === 'custom' && dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        matchesDate = date >= start && date <= end;
      }
    }

    // Filter Quantity
    let matchesQuantity = true;
    if (quantityRange.min || quantityRange.max) {
      const qty = enquiry.quantity;
      if (quantityRange.min && qty < Number(quantityRange.min)) matchesQuantity = false;
      if (quantityRange.max && qty > Number(quantityRange.max)) matchesQuantity = false;
    }

    return matchesSearch && matchesStatus && matchesDate && matchesQuantity;
  }).sort((a, b) => {
    switch (enquirySort) {
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'pending': return (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'solved': return (a.status === 'solved' ? -1 : 1) - (b.status === 'solved' ? -1 : 1) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'quantity-high': return b.quantity - a.quantity;
      case 'quantity-low': return a.quantity - b.quantity;
      case 'newest': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const marbleCount = products.filter(p => p.category === 'Marbles').length;
  const tileCount = products.filter(p => p.category === 'Tiles').length;
  const handicraftCount = products.filter(p => p.category === 'Handicraft').length;
  const maxCount = Math.max(marbleCount, tileCount, handicraftCount, 1);

  // New Metrics Calculations
  const enquiryCounts = enquiries.reduce((acc, curr) => {
    if (curr.productName) {
      acc[curr.productName] = (acc[curr.productName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topEnquiredProductName = Object.keys(enquiryCounts).reduce((a, b) =>
    enquiryCounts[a] > enquiryCounts[b] ? a : b
    , 'None');

  const mostViewedProductName = products.length > 0 ? products[0].name : 'None';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const inputClasses = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm" />
            <div>
              <div className="text-sm font-bold text-slate-900">Admin Panel</div>
              <div className="text-[10px] text-slate-400">Shree Radhe Marble</div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          <button
            onClick={() => { setActiveTab('products'); setSidebarOpen(false); setCurrentPage(1); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BoxIcon />
            Products
            <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{products.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('enquiries'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'enquiries' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ChatIcon />
            Enquiries
            {enquiries.length > 0 && (
              <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">{enquiries.length}</span>
            )}
          </button>

          <hr className="my-3 border-slate-100" />

          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <GlobeIcon />
            View Website
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogoutIcon />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-slate-900">
                {activeTab === 'products' ? 'Products' : 'Enquiries'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'products' && (
                <button
                  onClick={openAddForm}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
                >
                  <span>+</span> Add Product
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <>
              {/* Stats & Graph Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 pt-2">
                {/* Left: Stats Cards */}
                <div className="flex flex-col justify-between h-full gap-4">
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl border border-blue-100 p-4 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-4xl font-bold text-blue-600">{products.length}</div>
                      <div className="relative z-10 text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center leading-tight">Total Products Listed</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-base font-bold text-emerald-600 text-center line-clamp-2 px-1 leading-snug" title={mostViewedProductName}>{mostViewedProductName}</div>
                      <div className="relative z-10 text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center leading-tight">Most Viewed Product</div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl border border-violet-100 p-4 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 text-base font-bold text-violet-600 text-center line-clamp-2 px-1 leading-snug" title={topEnquiredProductName}>{topEnquiredProductName}</div>
                      <div className="relative z-10 text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center leading-tight">Top Enquired Product</div>
                    </motion.div>
                  </div>
                </div>

                {/* Right: Bar Graph */}
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 relative shadow-sm overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="flex items-end justify-around h-32 w-full gap-6 px-4">
                    {/* Marble Bar */}
                    <div className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                      <div className="mb-auto text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">{marbleCount} Items</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(marbleCount / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-md group-hover:shadow-blue-200"
                      />
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-blue-500 transition-colors">Marbles</div>
                    </div>

                    {/* Tile Bar */}
                    <div className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                      <div className="mb-auto text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">{tileCount} Items</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(tileCount / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg shadow-md group-hover:shadow-emerald-200"
                      />
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">Tiles</div>
                    </div>

                    {/* Handicraft Bar */}
                    <div className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-pointer">
                      <div className="mb-auto text-xs font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">{handicraftCount} Items</div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(handicraftCount / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-lg shadow-md group-hover:shadow-violet-200"
                      />
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-violet-500 transition-colors">Arts</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Products Toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CartIcon /> PRODUCTS
                  </h3>
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-sans"
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

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <ProductTable
                  products={paginatedProducts}
                  onEdit={openEditForm}
                  onDelete={handleDeleteProduct}
                />
              </div>
            </>
          )}

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <>
              {/* Enquiry Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl border border-blue-100 p-4 flex flex-col items-center justify-center shadow-sm"
                >
                  <div className="text-4xl font-bold text-blue-600">{totalEnquiries}</div>
                  <div className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center">Total Enquiries</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl border border-emerald-100 p-4 flex flex-col items-center justify-center shadow-sm"
                >
                  <div className="text-4xl font-bold text-emerald-500">{solvedEnquiries}</div>
                  <div className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center">Solved</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl border border-amber-100 p-4 flex flex-col items-center justify-center shadow-sm"
                >
                  <div className="text-4xl font-bold text-amber-500">{pendingEnquiries}</div>
                  <div className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest text-center">Pending</div>
                </motion.div>
              </div>

              {/* Filters Toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <SearchIcon /> ENQUIRIES
                  </h3>
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search enquiries..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-sans"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <SearchIcon />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 border-t border-slate-100">

                  {/* Sort & Filter Controls */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Sort */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <SortIcon /> Sort
                      </span>
                      <select
                        value={enquirySort}
                        onChange={(e) => setEnquirySort(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="quantity-high">Highest Qty</option>
                        <option value="quantity-low">Lowest Qty</option>
                        <option value="pending">Pending First</option>
                        <option value="solved">Solved First</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <FilterIcon /> Status
                      </span>
                      <select
                        value={enquiryFilterStatus}
                        onChange={(e) => setEnquiryFilterStatus(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="solved">Solved</option>
                      </select>
                    </div>

                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <CalendarIcon /> Date
                      </span>
                      <select
                        value={enquiryFilterDate}
                        onChange={(e) => setEnquiryFilterDate(e.target.value as any)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-400"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom</option>
                      </select>

                      {enquiryFilterDate === 'custom' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            className="px-2 py-1 rounded border border-slate-200 text-xs"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type="date"
                            className="px-2 py-1 rounded border border-slate-200 text-xs"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>

                    {/* Quantity Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <HashIcon /> Qty
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                          value={quantityRange.min}
                          onChange={(e) => setQuantityRange(prev => ({ ...prev, min: e.target.value }))}
                        />
                        <span className="text-slate-400">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-400"
                          value={quantityRange.max}
                          onChange={(e) => setQuantityRange(prev => ({ ...prev, max: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
                      <LightningIcon /> Quick
                    </span>
                    <button
                      onClick={() => setEnquiryFilterStatus('pending')}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterStatus === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-200'}`}
                    >
                      Pending Only
                    </button>
                    <button
                      onClick={() => setEnquiryFilterStatus('solved')}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterStatus === 'solved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200'}`}
                    >
                      Solved Only
                    </button>
                    <button
                      onClick={() => setEnquiryFilterDate('today')}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterDate === 'today' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'}`}
                    >
                      Today's
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <EnquiriesTable
                  enquiries={filteredEnquiries}
                  onDelete={handleDeleteEnquiry}
                  onStatusUpdate={handleUpdateEnquiryStatus}
                  onBatchDelete={handleBatchDeleteEnquiries}
                  onBatchStatusUpdate={handleBatchUpdateEnquiryStatus}
                />
              </div>

            </>
          )
          }
        </main >
      </div >

      {/* Product Form Modal */}
      {
        showForm && (
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Image URL</label>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className={inputClasses}
                    />
                  </div>
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
                    disabled={formSubmitting}
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {formSubmitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Add Product')}
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
        )
      }
    </div >
  );
}
