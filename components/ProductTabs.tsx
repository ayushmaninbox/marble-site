'use client';

import { useState } from 'react';
import { ProductCategory } from '@/lib/types';

interface ProductTabsProps {
  activeTab: ProductCategory;
  onTabChange: (tab: ProductCategory) => void;
}

const tabs: ProductCategory[] = ['Marbles', 'Tiles', 'Handicraft'];

export default function ProductTabs({ activeTab, onTabChange }: ProductTabsProps) {
  return (
    <div className="flex justify-center mb-12">
      <div className="glass rounded-full p-2 inline-flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
