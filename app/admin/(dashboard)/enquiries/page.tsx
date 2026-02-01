'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Enquiry } from '@/lib/types';
import EnquiriesTable from '@/components/admin/EnquiriesTable';
import StatsCard from '@/components/admin/StatsCard';
import PaginationControls from '@/components/admin/PaginationControls';

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
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
      const response = await fetch(`/api/enquiries?id=${id}`, { method: 'DELETE' });
      if (response.ok) await fetchEnquiries();
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
      if (response.ok) await fetchEnquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleBatchUpdateEnquiryStatus = async (ids: string[], status: 'pending' | 'solved') => {
    try {
      const response = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      if (response.ok) await fetchEnquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleBatchDeleteEnquiries = async (ids: string[]) => {
    try {
      const response = await fetch(`/api/enquiries?ids=${ids.join(',')}`, { method: 'DELETE' });
      if (response.ok) await fetchEnquiries();
    } catch (error) {
      console.error('Error deleting enquiries:', error);
    }
  };

  const totalEnquiries = enquiries.length;
  const solvedEnquiries = enquiries.filter(e => e.status === 'solved').length;
  const pendingEnquiries = totalEnquiries - solvedEnquiries;

  const filteredEnquiries = enquiries.filter(enquiry => {
    const searchLower = enquirySearch.toLowerCase();
    const matchesSearch = enquiry.firstName.toLowerCase().includes(searchLower) ||
      enquiry.lastName.toLowerCase().includes(searchLower) ||
      enquiry.email.toLowerCase().includes(searchLower) ||
      enquiry.productName.toLowerCase().includes(searchLower);

    const matchesStatus = enquiryFilterStatus === 'all' || enquiry.status === enquiryFilterStatus;

    let matchesDate = true;
    if (enquiryFilterDate !== 'all') {
      const date = new Date(enquiry.createdAt);
      const now = new Date();
      date.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
      if (enquiryFilterDate === 'today') matchesDate = date.getTime() === now.getTime();
      else if (enquiryFilterDate === 'week') matchesDate = date >= new Date(now.getTime() - 7 * 86400000);
      else if (enquiryFilterDate === 'month') matchesDate = date >= new Date(now.getTime() - 30 * 86400000);
    }
    
    let matchesQuantity = true;
    if (quantityRange.min && enquiry.quantity < Number(quantityRange.min)) matchesQuantity = false;
    if (quantityRange.max && enquiry.quantity > Number(quantityRange.max)) matchesQuantity = false;

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

  const totalEnquiriesFiltered = filteredEnquiries.length;
  const totalPages = Math.ceil(totalEnquiriesFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEnquiriesFiltered);
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  if (loading) {
     return (
       <div className="flex min-h-[60vh] items-center justify-center">
         <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
       </div>
     );
  }

  return (
    <main className="p-4 lg:p-6 bg-stone-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Manage customer enquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard 
           title="Total Enquiries" 
           value={totalEnquiries} 
           icon={<InboxIcon />} 
           iconBgColor="bg-red-50"
           iconColor="text-red-600"
        />
        <StatsCard 
           title="Solved" 
           value={solvedEnquiries} 
           icon={<CheckCircleIcon />} 
           iconBgColor="bg-emerald-50"
           iconColor="text-emerald-600"
        />
        <StatsCard 
           title="Pending" 
           value={pendingEnquiries} 
           icon={<ClockIcon />} 
           iconBgColor="bg-amber-50"
           iconColor="text-amber-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-4 mb-6 shadow-sm space-y-4">
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
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <SortIcon /> Sort
              </span>
              <select
                value={enquirySort}
                onChange={(e) => setEnquirySort(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-medium text-slate-700 bg-stone-50 focus:outline-none focus:border-red-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="quantity-high">Highest Qty</option>
                <option value="quantity-low">Lowest Qty</option>
                <option value="pending">Pending First</option>
                <option value="solved">Solved First</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <FilterIcon /> Status
              </span>
              <select
                value={enquiryFilterStatus}
                onChange={(e) => setEnquiryFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-medium text-slate-700 bg-stone-50 focus:outline-none focus:border-red-400"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="solved">Solved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <CalendarIcon /> Date
              </span>
              <select
                value={enquiryFilterDate}
                onChange={(e) => setEnquiryFilterDate(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm font-medium text-slate-700 bg-stone-50 focus:outline-none focus:border-red-400"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <HashIcon /> Qty
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-red-400"
                  value={quantityRange.min}
                  onChange={(e) => setQuantityRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-16 px-2 py-1.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-red-400"
                  value={quantityRange.max}
                  onChange={(e) => setQuantityRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-center gap-1">
              <LightningIcon /> Quick
            </span>
            <button
              onClick={() => setEnquiryFilterStatus('pending')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterStatus === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white text-slate-600 border-stone-200 hover:border-amber-200'}`}
            >
              Pending Only
            </button>
            <button
              onClick={() => setEnquiryFilterStatus('solved')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterStatus === 'solved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-white text-slate-600 border-stone-200 hover:border-emerald-200'}`}
            >
              Solved Only
            </button>
            <button
              onClick={() => setEnquiryFilterDate('today')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${enquiryFilterDate === 'today' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-600 border-stone-200 hover:border-red-200'}`}
            >
              Today's
            </button>
          </div>
        </div>
      </div>

      <PaginationControls 
        currentPage={currentPage}
        totalItems={totalEnquiriesFiltered}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        itemName="enquiries"
      />

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <EnquiriesTable
          enquiries={paginatedEnquiries}
          onDelete={handleDeleteEnquiry}
          onStatusUpdate={handleUpdateEnquiryStatus}
          onBatchDelete={handleBatchDeleteEnquiries}
          onBatchStatusUpdate={handleBatchUpdateEnquiryStatus}
          onRowClick={(enquiry) => setSelectedEnquiry(enquiry)}
        />
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
             <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Enquiry Details</h2>
              <button onClick={() => setSelectedEnquiry(null)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-slate-500">
                <CloseIcon />
              </button>
            </div>
            {/* Modal Content - Red/Stone */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedEnquiry.status === 'solved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedEnquiry.status === 'solved' ? '✓ Solved' : '⏳ Pending'}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</h3>
                <p className="text-sm font-medium text-slate-900">{selectedEnquiry.firstName} {selectedEnquiry.lastName}</p>
                <div className="flex flex-col gap-1 text-sm text-slate-600">
                  <span>📞 {selectedEnquiry.phone}</span><span>✉️ {selectedEnquiry.email}</span>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</h3>
                <p className="text-sm font-medium text-slate-900">{selectedEnquiry.productName}</p>
                 <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    selectedEnquiry.productCategory === 'Marbles' ? 'bg-red-50 text-red-700' : selectedEnquiry.productCategory === 'Tiles' ? 'bg-stone-100 text-stone-700' : 'bg-orange-50 text-orange-700'
                  }`}>{selectedEnquiry.productCategory}</span>
                  <span className="text-sm text-slate-600">Quantity: {selectedEnquiry.quantity}</span>
                </div>
              </div>

               {selectedEnquiry.message && <div className="bg-stone-50 rounded-xl p-4 space-y-2"><h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</h3><p className="text-sm text-slate-700">{selectedEnquiry.message}</p></div>}
              

               <div className="flex gap-2 pt-2">
                <a 
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.296-1.04 1.015-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  WhatsApp
                </a>
                <a 
                  href={`tel:${selectedEnquiry.phone}`} 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Call
                </a>
                <a 
                  href={`mailto:${selectedEnquiry.email}?subject=Response to Your Product Enquiry`} 
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-700 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Icons needed for Enquiries Page (re-declaring if needed or import)
const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
