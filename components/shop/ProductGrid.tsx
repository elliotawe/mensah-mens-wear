'use client';

import { useState } from 'react';
import type { ItemDisplay } from '@/lib/api/items';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'in-stock' | 'out-of-stock';

interface ProductGridProps {
  items: ItemDisplay[];
}

export function ProductGrid({ items }: ProductGridProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = items.filter(item => {
    if (filter === 'in-stock') return item.in_stock;
    if (filter === 'out-of-stock') return !item.in_stock;
    return true;
  });

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: `All (${items.length})` },
    { value: 'in-stock', label: `Available (${items.filter(i => i.in_stock).length})` },
    { value: 'out-of-stock', label: `Unavailable (${items.filter(i => !i.in_stock).length})` },
  ];

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center gap-3 flex-wrap mb-10" role="group" aria-label="Filter products">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'h-9 px-5 font-accent text-[10px] tracking-widest uppercase rounded-[4px] border transition-all duration-200 cursor-pointer',
              filter === f.value
                ? 'bg-[var(--color-obsidian)] text-[var(--color-parchment)] border-[var(--color-obsidian)]'
                : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-secondary)]'
            )}
            aria-pressed={filter === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-2xl font-300 text-[var(--color-text-primary)] mb-3">
            No items match your filter
          </p>
          <p className="font-body text-sm text-[var(--color-text-muted)] mb-6">
            Try a different filter to see more pieces.
          </p>
          <button
            onClick={() => setFilter('all')}
            className="font-accent text-[11px] tracking-widest uppercase text-[var(--color-gold)] hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(item => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
