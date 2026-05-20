'use client';

import { Package } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 shadow-sm shadow-zinc-200/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/25 sm:h-10 sm:w-10">
          <Package className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold leading-tight tracking-tight text-zinc-900 sm:text-lg">
            Inventory Management
          </h1>
          <p className="text-[11px] text-zinc-500 sm:text-xs">
            Create, update, and track your products
          </p>
        </div>
      </div>
    </header>
  );
}
