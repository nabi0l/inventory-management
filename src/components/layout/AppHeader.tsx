'use client';

import { Package } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500">
          <Package className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-zinc-900">
            Inventory
          </h1>
          <p className="text-xs text-zinc-500">
            Keep track of your stuff
          </p>
        </div>
      </div>
    </header>
  );
}
