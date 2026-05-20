'use client';

import { ArrowUpDown } from 'lucide-react';
import type { SortField, SortDirection } from '@/lib/types/inventory';

interface MobileSortBarProps {
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSetSort: (field: SortField | null, direction: SortDirection) => void;
}

const SORT_OPTIONS: { value: string; label: string; field: SortField | null; dir: SortDirection }[] = [
  { value: 'default', label: 'Default order', field: null, dir: 'asc' },
  { value: 'name-asc', label: 'Name A → Z', field: 'name', dir: 'asc' },
  { value: 'name-desc', label: 'Name Z → A', field: 'name', dir: 'desc' },
  { value: 'price-asc', label: 'Price: low to high', field: 'price', dir: 'asc' },
  { value: 'price-desc', label: 'Price: high to low', field: 'price', dir: 'desc' },
  { value: 'stock-asc', label: 'Stock: low to high', field: 'stock', dir: 'asc' },
  { value: 'stock-desc', label: 'Stock: high to low', field: 'stock', dir: 'desc' },
];

export default function MobileSortBar({
  sortField,
  sortDirection,
  onSetSort,
}: MobileSortBarProps) {
  const current =
    SORT_OPTIONS.find((o) => o.field === sortField && o.dir === sortDirection)?.value ??
    'default';

  return (
    <div className="flex items-center gap-2.5 border-b border-zinc-100 bg-zinc-50/80 px-3 py-3 md:hidden">
      <ArrowUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
      <label className="sr-only" htmlFor="mobile-sort">
        Sort products
      </label>
      <select
        id="mobile-sort"
        value={current}
        onChange={(e) => {
          const option = SORT_OPTIONS.find((o) => o.value === e.target.value);
          if (option) onSetSort(option.field, option.dir);
        }}
        className="min-h-[44px] flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
