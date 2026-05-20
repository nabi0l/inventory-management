'use client';

import { Package, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onAddFirst?: () => void;
}

export default function EmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <div className="flex justify-center px-6 py-14 motion-safe:animate-[fadeIn_0.4s_ease-out]">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-10 text-center shadow-[0_8px_32px_-8px_rgba(245,158,11,0.2)] ring-1 ring-zinc-900/[0.03] transition duration-200 hover:scale-[1.01]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400" />
        <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-orange-300/15 blur-2xl" />

        <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/80 shadow-inner">
          <Package className="h-8 w-8 text-amber-600" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-amber-500" />
        </div>

        <h3 className="relative text-lg font-semibold text-zinc-900">Your shelf is empty</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-zinc-500">
          Add your first product to start tracking stock, prices, and images in one place.
        </p>

        {onAddFirst && (
          <button
            onClick={onAddFirst}
            className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-500/25 transition duration-150 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg focus:ring-2 focus:ring-amber-500/50 outline-none"
          >
            <Plus className="h-4 w-4" />
            Add first item
          </button>
        )}
      </div>
    </div>
  );
}
