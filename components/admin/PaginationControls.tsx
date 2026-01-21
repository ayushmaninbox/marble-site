import { ReactNode } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
  itemName?: string; // e.g. "products"
}

export default function PaginationControls({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange,
  itemName = 'items'
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 bg-white rounded-lg border border-stone-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing</span>
          <span className="font-semibold text-slate-900">{totalItems > 0 ? startIndex + 1 : 0}-{endIndex}</span>
          <span>of</span>
          <span className="font-semibold text-slate-900">{totalItems}</span>
          <span>{itemName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 hidden sm:inline">Per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => { onItemsPerPageChange(Number(e.target.value)); onPageChange(1); }}
              className="rounded-lg border border-stone-200 px-2 py-1 text-sm outline-none focus:border-red-400 cursor-pointer bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="h-4 w-px bg-stone-200 mx-1"></div>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 px-2 rounded border border-stone-200 text-sm disabled:opacity-50 hover:bg-stone-50 transition-colors text-slate-600"
            >
              Previous
            </button>
            <span className="px-2 py-1 text-sm text-slate-600 font-medium flex items-center">{currentPage} / {totalPages || 1}</span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 px-2 rounded border border-stone-200 text-sm disabled:opacity-50 hover:bg-stone-50 transition-colors text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
  );
}
