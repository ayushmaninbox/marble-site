'use client';

import { useState, useEffect } from 'react';
import { Product, Enquiry } from '@/lib/types';
import Link from 'next/link';

// SVG Icons
const BoxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, enquiriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/enquiries')
        ]);
        const productsData = await productsRes.json();
        const enquiriesData = await enquiriesRes.json();
        setProducts(productsData);
        setEnquiries(enquiriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Stats calculations
  const totalProducts = products.length;
  const totalEnquiries = enquiries.length;
  const pendingEnquiries = enquiries.filter(e => e.status === 'pending').length;
  const solvedEnquiries = enquiries.filter(e => e.status === 'solved').length;

  // Category enquiry counts
  const categoryEnquiries = {
    Marbles: enquiries.filter(e => e.productCategory === 'Marbles').length,
    Tiles: enquiries.filter(e => e.productCategory === 'Tiles').length,
    Handicraft: enquiries.filter(e => e.productCategory === 'Handicraft').length,
  };
  const maxCategoryEnquiries = Math.max(...Object.values(categoryEnquiries), 1);

  // Recent enquiries (last 5)
  const recentEnquiries = [...enquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Generate monthly data for chart (last 6 months)
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const count = enquiries.filter(e => {
        const enquiryDate = new Date(e.createdAt);
        return enquiryDate.getMonth() === date.getMonth() && 
               enquiryDate.getFullYear() === date.getFullYear();
      }).length;
      months.push({ month: monthName, count });
    }
    return months;
  };

  const monthlyData = getMonthlyData();
  const maxMonthlyCount = Math.max(...monthlyData.map(m => m.count), 1);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, Admin 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your business today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-48 lg:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Products</span>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <BoxIcon />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalProducts}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
            <TrendUpIcon />
            <span>Active listings</span>
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Total Enquiries</span>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ChatIcon />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalEnquiries}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
            <TrendUpIcon />
            <span>All time</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Pending</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <ClockIcon />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{pendingEnquiries}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
            <span>Requires attention</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Resolved</span>
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
              <CheckCircleIcon />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{solvedEnquiries}</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-violet-600">
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Enquiry Statistics - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800">Enquiry Statistics</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Monthly</span>
          </div>
          
          {/* Simple Area Chart */}
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {monthlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {data.count} enquiries
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-600 hover:to-emerald-500"
                    style={{ height: `${(data.count / maxMonthlyCount) * 140}px`, minHeight: '8px' }}
                  />
                </div>
                <span className="text-xs text-slate-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800">Enquiry Status</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Today</span>
          </div>
          
          {/* Donut Chart */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Background circle */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="4"
                />
                {/* Solved segment */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray={`${totalEnquiries > 0 ? (solvedEnquiries / totalEnquiries) * 88 : 0} 88`}
                  strokeLinecap="round"
                />
                {/* Pending segment */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray={`${totalEnquiries > 0 ? (pendingEnquiries / totalEnquiries) * 88 : 0} 88`}
                  strokeDashoffset={`${totalEnquiries > 0 ? -(solvedEnquiries / totalEnquiries) * 88 : 0}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-800">{totalEnquiries}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs text-slate-600">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-xs text-slate-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800">Recent Enquiries</h3>
            <Link
              href="/admin/enquiries"
              className="text-xs text-red-600 hover:text-red-700 font-bold uppercase tracking-wider flex items-center gap-1"
            >
              View All <ArrowRightIcon />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Product</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Qty</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-sm text-slate-400 py-8">
                      No enquiries yet
                    </td>
                  </tr>
                ) : (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-slate-800 truncate max-w-[150px] block">
                          {enquiry.productName}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-600">
                          {enquiry.firstName} {enquiry.lastName}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-500">
                          {new Date(enquiry.createdAt).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-slate-600">{enquiry.quantity}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          enquiry.status === 'solved' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {enquiry.status === 'solved' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-slate-800">Category Overview</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Enquiries</span>
          </div>
          
          <div className="space-y-5">
            {/* Marbles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Marbles</span>
                <span className="text-sm font-bold text-slate-800">
                  {((categoryEnquiries.Marbles / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Marbles / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1">{categoryEnquiries.Marbles} enquiries</span>
            </div>

            {/* Tiles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Tiles</span>
                <span className="text-sm font-bold text-slate-800">
                  {((categoryEnquiries.Tiles / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Tiles / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1">{categoryEnquiries.Tiles} enquiries</span>
            </div>

            {/* Handicraft */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Handicraft</span>
                <span className="text-sm font-bold text-slate-800">
                  {((categoryEnquiries.Handicraft / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Handicraft / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1">{categoryEnquiries.Handicraft} enquiries</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
