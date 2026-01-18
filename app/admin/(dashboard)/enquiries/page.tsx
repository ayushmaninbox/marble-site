'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Enquiry } from '@/lib/types';
import EnquiriesTable from '@/components/admin/EnquiriesTable';

// SVG Icons
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

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquirySort, setEnquirySort] = useState<'newest' | 'oldest' | 'pending' | 'solved' | 'quantity-high' | 'quantity-low'>('newest');
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<'all' | 'pending' | 'solved'>('all');
  const [enquiryFilterDate, setEnquiryFilterDate] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
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

  // Stats
  const totalEnquiries = enquiries.length;
  const solvedEnquiries = enquiries.filter(e => e.status === 'solved').length;
  const pendingEnquiries = totalEnquiries - solvedEnquiries;

  // Filtering Logic
  const filteredEnquiries = enquiries.filter(enquiry => {
    const searchLower = enquirySearch.toLowerCase();
    const matchesSearch =
      enquiry.firstName.toLowerCase().includes(searchLower) ||
      enquiry.lastName.toLowerCase().includes(searchLower) ||
      enquiry.email.toLowerCase().includes(searchLower) ||
      enquiry.productName.toLowerCase().includes(searchLower);

    const matchesStatus = enquiryFilterStatus === 'all' || enquiry.status === enquiryFilterStatus;

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Manage customer enquiries</p>
      </div>

      {/* Stats Row */}
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

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <EnquiriesTable
          enquiries={filteredEnquiries}
          onDelete={handleDeleteEnquiry}
          onStatusUpdate={handleUpdateEnquiryStatus}
          onBatchDelete={handleBatchDeleteEnquiries}
          onBatchStatusUpdate={handleBatchUpdateEnquiryStatus}
        />
      </div>
    </main>
  );
}
