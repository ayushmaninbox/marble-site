'use client';

import { ProductCategory } from '@/lib/types';

interface ProductTabsProps {
  activeTab: ProductCategory;
  onTabChange: (tab: ProductCategory) => void;
}

const tabs: ProductCategory[] = ['Marbles', 'Tiles', 'Handicraft'];

export default function ProductTabs({ activeTab, onTabChange }: ProductTabsProps) {
  return (
    <div className="mb-10 flex justify-center">
      <div className="inline-flex gap-2 rounded-full border border-sky-200 bg-white/90 p-1 shadow-sm shadow-sky-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-700'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
