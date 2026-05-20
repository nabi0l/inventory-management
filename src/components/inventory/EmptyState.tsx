'use client';

import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddFirst?: () => void;
}

export default function EmptyState({ onAddFirst }: EmptyStateProps) {
  return (
    <div className="flex justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100">
          <Package className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />
        </div>

        <h3 className="text-base font-medium text-zinc-900">Nothing here yet</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Add your first product to get started.
        </p>

        {onAddFirst && (
          <button
            onClick={onAddFirst}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        )}
      </div>
    </div>
  );
}
