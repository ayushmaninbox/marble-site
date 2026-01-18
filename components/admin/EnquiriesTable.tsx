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
        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === enquiries.length && enquiries.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
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
            <tbody className="divide-y divide-slate-100">
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
                    className={`transition-colors hover:bg-slate-50 cursor-pointer ${selectedIds.has(enquiry.id) ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(enquiry.id)}
                        onChange={() => toggleSelection(enquiry.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
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
                          <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${enquiry.productCategory === 'Marbles' ? 'bg-blue-50 text-blue-700' :
                            enquiry.productCategory === 'Tiles' ? 'bg-emerald-50 text-emerald-700' :
                              'bg-purple-50 text-purple-700'
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
                          href={`https://wa.me/91${enquiry.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-colors"
                          title="WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(enquiry.email)}&su=${encodeURIComponent('Response to Your Product Enquiry')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
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
                          className="px-2.5 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
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
