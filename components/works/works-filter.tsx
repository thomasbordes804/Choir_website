'use client';

import { useState } from 'react';

interface WorksFilterProps {
  categories?: string[];
}

export function WorksFilter({ categories = ['all'] }: WorksFilterProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="flex items-center gap-6 mb-16 pb-4 border-b border-zinc-200">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveFilter(category)}
          className={`px-0 py-2 text-sm font-medium transition-all duration-300 ${
            activeFilter === category
              ? 'text-zinc-900 border-b-2 border-zinc-900'
              : 'text-zinc-500 hover:text-zinc-700 border-b-2 border-transparent hover:border-zinc-300'
          }`}
        >
          {category === 'all' ? 'Tout' : category}
        </button>
      ))}
    </div>
  );
}