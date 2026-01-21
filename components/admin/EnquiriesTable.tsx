'use client';

import { useState } from 'react';
import { Enquiry } from '@/lib/types';

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: 'pending' | 'solved') => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchStatusUpdate: (ids: string[], status: 'pending' | 'solved') => void;
  onRowClick?: (enquiry: Enquiry) => void;
}

export default function EnquiriesTable({
  enquiries,
  onDelete,
  onStatusUpdate,
  onBatchDelete,
  onBatchStatusUpdate,
  onRowClick
}: EnquiriesTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === enquiries.length && enquiries.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(enquiries.map(e => e.id)));
    }
  };

  const handleStatusClick = (enquiry: Enquiry) => {
    if (enquiry.status === 'solved') {
      if (confirm('Mark this enquiry as pending regarding?')) {
        onStatusUpdate(enquiry.id, 'pending');
      }
    } else {
      if (confirm('Has this enquiry been successfully solved?')) {
        onStatusUpdate(enquiry.id, 'solved');
      }
    }
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to PERMANENTLY delete these ${selectedIds.size} enquiries?`)) {
      onBatchDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleBatchMarkSolved = () => {
    if (confirm(`Mark ${selectedIds.size} selected enquiries as SOLVED?`)) {
      onBatchStatusUpdate(Array.from(selectedIds), 'solved');
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Selection Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700">{selectedIds.size} selected</span>
            </div>

            <div className="h-4 w-px bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchMarkSolved}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Mark Solved
              </button>

              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected
              </button>
            </div>
          </div>

          <button
            className="text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50/80 border-b border-stone-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === enquiries.length && enquiries.length > 0}
                    onChange={toggleAll}
                    className="rounded border-stone-300 text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                </th>
                <th className="w-10 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">📭</span>
                      <span>No enquiries received yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => onRowClick?.(enquiry)}
                    className={`transition-colors hover:bg-red-50/20 cursor-pointer ${selectedIds.has(enquiry.id) ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(enquiry.id)}
                        onChange={() => toggleSelection(enquiry.id)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleStatusClick(enquiry)}
                        title={enquiry.status === 'solved' ? 'Mark as Pending' : 'Mark as Solved'}
                        className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${enquiry.status === 'solved'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-300 text-transparent hover:border-emerald-400'
                          }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${enquiry.status === 'solved' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {enquiry.firstName} {enquiry.lastName}
                        </span>
                        <span className="text-xs text-slate-500">{enquiry.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-slate-900 line-clamp-1">{enquiry.productName}</span>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${enquiry.productCategory === 'Marbles' ? 'bg-red-50 text-red-700' :
                            enquiry.productCategory === 'Tiles' ? 'bg-stone-100 text-stone-700' :
                              'bg-orange-50 text-orange-700'
                            }`}>
                            {enquiry.productCategory}
                          </span>
                          <span className="text-[10px] text-slate-400">Qty: {enquiry.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[200px] truncate text-xs text-slate-500" title={enquiry.message}>
                        {enquiry.message || '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1.5">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(enquiry.email)}&su=${encodeURIComponent('Response to Your Product Enquiry')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-stone-100 text-stone-600 hover:bg-stone-600 hover:text-white rounded-lg transition-colors"
                          title="Email"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this enquiry?')) {
                              onDelete(enquiry.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
