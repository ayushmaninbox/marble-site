'use client';

import { useState, useEffect } from 'react';
import { Product, Enquiry } from '@/lib/types';
import Link from 'next/link';
import StatsCard from '@/components/admin/StatsCard';

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
  const [userName, setUserName] = useState('Admin');
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredData, setHoveredData] = useState<{ x: number; y: number; value: number; month: string } | null>(null);

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

    // Get user name
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
         // Capitalize first letter
        const name = user.name || 'Admin';
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      } catch (e) { console.error(e); }
    }
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

  // Chart SVG Points
  // Y-Scale: 0 (top) to 100 (bottom).
  // Value 0 => y=100. Value Max => y=5 (leave 5% top padding).
  const MAX_Y_PERCENT = 5;
  const MIN_Y_PERCENT = 100;
  const Y_RANGE = MIN_Y_PERCENT - MAX_Y_PERCENT;

  const chartPoints = monthlyData.map((d, i) => {
    const x = (i / (monthlyData.length - 1)) * 100;
    const y = MIN_Y_PERCENT - (d.count / maxMonthlyCount) * Y_RANGE;
    return `${x},${y}`;
  }).join(' ');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="p-4 lg:p-6 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900">Hello, {userName} 👋</h1>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-wide">Business Overview</p>
        </div>
        <div className="flex items-center gap-3">
          {/* User Profile or notification icons could go here */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Products */}
        <StatsCard 
          title="Total Products"
          value={totalProducts}
          icon={<BoxIcon />}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
          trend={{ text: 'Active listings', icon: <TrendUpIcon />, color: 'text-red-600' }}
        />

        {/* Total Enquiries */}
        <StatsCard 
          title="Total Enquiries"
          value={totalEnquiries}
          icon={<ChatIcon />}
          iconBgColor="bg-stone-100"
          iconColor="text-stone-600"
          trend={{ text: 'All time', icon: <TrendUpIcon />, color: 'text-stone-600' }}
        />

        {/* Pending */}
        <StatsCard 
          title="Pending"
          value={pendingEnquiries}
          icon={<ClockIcon />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          trend={{ text: 'Requires attention', color: 'text-amber-600' }}
        />

        {/* Resolved */}
        <StatsCard 
          title="Resolved"
          value={solvedEnquiries}
          icon={<CheckCircleIcon />}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ text: 'Completed', color: 'text-emerald-600' }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Enquiry Statistics - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-100 shadow-sm z-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Enquiry Trend</h3>
            <span className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">Monthly</span>
          </div>
          
          <div className="flex gap-4 h-64 w-full">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between py-0 text-xs text-slate-400 font-medium text-right w-8 h-full select-none">
              {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
                 // Map Ratio to Y-Position? 
                 // If chart uses 5% to 100%, labels should likely align 0% to 100% physically.
                 // We will simply display labels at Top, 75%, 50%, 25%, Bottom. 
                 // And matched with grid lines.
                 // Note: Chart max value effectively touches 5% line (top padding). 
                 // It's cleaner to label the Max Value at the 5% line? 
                 // Let's just label strictly 0-Max at equal intervals and draw lines there.
                 return (
                    <span key={ratio} className="leading-none transform -translate-y-[50%] first:translate-y-0 last:translate-y-0">
                      {Math.round(maxMonthlyCount * ratio)}
                    </span>
                 );
              })}
            </div>

            {/* Chart Area */}
            <div className="relative flex-1 h-full group z-10">
              {/* HTML Tooltip Overlay */}
              {hoveredData && (
                <div 
                  className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
                  style={{ 
                    left: `${hoveredData.x}%`, 
                    top: `${hoveredData.y}%`,
                    transform: 'translate(-50%, -120%)'
                  }}
                >
                  <div className="bg-slate-800 text-white rounded-lg shadow-xl px-3 py-2 text-center min-w-[80px]">
                    <div className="text-sm font-bold">{hoveredData.value} Enquiries</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{hoveredData.month}</div>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                </div>
              )}

              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* 
                   Grid Lines: 
                   We have 5 labels distributed via justify-between (0, 25, 50, 75, 100% height).
                   So lines should be at 0, 25, 50, 75, 100 y-coordinates.
                   However, we strictly mapped data to 5-100 range. 
                   If we want lines to match labels, we should draw lines at 0, 25, 50, 75, 100.
                   But our Max Value (Data) hits 5%. 
                   So Max Value label (at top, 0%) aligns with y=0 line.
                   But Data max is y=5. So data peak is slightly below the top line. This is good behavior.
                   Bottom label (0) aligns with y=100.
                */}
                {[0, 25, 50, 75, 100].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#f5f5f4" strokeWidth="0.5" strokeDasharray="4" />
                ))}

                {/* Area */}
                <polygon 
                  points={`0,100 ${chartPoints} 100,100`} 
                  fill="url(#chartGradient)" 
                />
                
                {/* Line */}
                <polyline 
                  points={chartPoints} 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {monthlyData.map((d, i) => {
                  const x = (i / (monthlyData.length - 1)) * 100;
                  const y = MIN_Y_PERCENT - (d.count / maxMonthlyCount) * Y_RANGE;
                  
                  return (
                    <g key={i} 
                       onMouseEnter={() => setHoveredData({ x, y, value: d.count, month: d.month })}
                       onMouseLeave={() => setHoveredData(null)}
                    >
                      {/* Visible dot on hover or if matches hoveredData */}
                      <circle 
                         cx={x} cy={y} r="4" 
                         className={`fill-white stroke-red-500 stroke-[2px] transition-opacity duration-200 ${hoveredData?.month === d.month ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} 
                         vectorEffect="non-scaling-stroke" 
                      />
                      
                      {/* Large invisible hit area */}
                      <circle cx={x} cy={y} r="20" fill="transparent" vectorEffect="non-scaling-stroke" className="cursor-pointer" />
                    </g>
                  );
                })}
              </svg>
              
              {/* X Axis Labels */}
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium absolute top-full left-0 w-full pt-2">
                {monthlyData.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Status</h3>
            <span className="text-xs text-slate-400 bg-stone-50 px-3 py-1 rounded-full font-medium">Today</span>
          </div>
          
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-40 h-40 mb-6">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {/* Background circle */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#f5f5f4" // stone-100
                  strokeWidth="3"
                />
                {/* Solved segment */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#10b981" // emerald-500
                  strokeWidth="3"
                  strokeDasharray={`${totalEnquiries > 0 ? (solvedEnquiries / totalEnquiries) * 88 : 0} 88`}
                  strokeLinecap="round"
                />
                {/* Pending segment */}
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="#f59e0b" // amber-500
                  strokeWidth="3"
                  strokeDasharray={`${totalEnquiries > 0 ? (pendingEnquiries / totalEnquiries) * 88 : 0} 88`}
                  strokeDashoffset={`${totalEnquiries > 0 ? -(solvedEnquiries / totalEnquiries) * 88 : 0}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{totalEnquiries}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Total</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Resolved</span>
                  <span className="text-[10px] text-slate-400">{(totalEnquiries > 0 ? (solvedEnquiries / totalEnquiries * 100) : 0).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">Pending</span>
                  <span className="text-[10px] text-slate-400">{(totalEnquiries > 0 ? (pendingEnquiries / totalEnquiries * 100) : 0).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-stone-100">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Recent Enquiries</h3>
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
                <tr className="bg-stone-50">
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Qty</th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
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
                    <tr key={enquiry.id} className="border-b border-stone-50 hover:bg-red-50/10 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm font-semibold text-slate-800 truncate max-w-[150px] block">
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
                        <span className="text-sm font-medium text-slate-700">{enquiry.quantity}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          enquiry.status === 'solved' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {enquiry.status === 'solved' ? 'Solved' : 'Pending'}
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
        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">Categories</h3>
            <span className="text-xs text-slate-400 bg-stone-50 px-3 py-1 rounded-full font-medium">Breakdown</span>
          </div>
          
          <div className="space-y-6">
            {/* Marbles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Marbles</span>
                <span className="text-sm font-bold text-red-600">
                  {((categoryEnquiries.Marbles / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Marbles / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1.5 block">{categoryEnquiries.Marbles} enquiries</span>
            </div>

            {/* Tiles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Tiles</span>
                <span className="text-sm font-bold text-stone-600">
                  {((categoryEnquiries.Tiles / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-stone-500 to-stone-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Tiles / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1.5 block">{categoryEnquiries.Tiles} enquiries</span>
            </div>

            {/* Handicraft */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">Handicraft</span>
                <span className="text-sm font-bold text-orange-600">
                  {((categoryEnquiries.Handicraft / (totalEnquiries || 1)) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${(categoryEnquiries.Handicraft / (totalEnquiries || 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 mt-1.5 block">{categoryEnquiries.Handicraft} enquiries</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
