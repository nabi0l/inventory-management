'use client';

import { Product } from '@/lib/db/schema';
import { Edit2, Trash2, Package, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import StockDisplay from '@/components/inventory/StockDisplay';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isBusy?: boolean;
  isProcessing?: boolean;
  isEditing?: boolean;
}

export default function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  isBusy = false,
  isProcessing = false,
  isEditing = false,
}: ProductCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_2px_16px_-4px_rgba(24,24,27,0.08)] transition duration-200 ${
        isEditing
          ? 'border-amber-300 ring-2 ring-amber-400/25'
          : 'border-zinc-200/90 hover:border-zinc-300 hover:shadow-[0_8px_24px_-8px_rgba(24,24,27,0.1)]'
      } ${isBusy ? 'opacity-70' : ''}`}
    >
      <button
        type="button"
        onClick={() => !isBusy && onView(product)}
        disabled={isBusy}
        className="block w-full text-left disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500/50"
      >
        <div className="relative aspect-[2/1] w-full bg-zinc-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
              <Package className="h-10 w-10 text-zinc-300" />
            </div>
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/35 to-transparent p-3">
            <span className="rounded-lg border border-white/20 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 backdrop-blur-sm">
              {product.category}
            </span>
            <span className="rounded-lg bg-white/90 px-2 py-0.5 text-sm font-bold tabular-nums text-zinc-900 backdrop-blur-sm">
              ${product.price}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-base font-semibold leading-snug text-zinc-900">
              {product.name}
            </h3>
            <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" aria-hidden />
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
              {product.description}
            </p>
          ) : (
            <p className="text-sm italic text-zinc-400">No description</p>
          )}

          <div className="rounded-xl bg-zinc-50/80 px-3 py-2.5 ring-1 ring-zinc-100">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              Stock level
            </p>
            <StockDisplay stock={product.stock} variant="card" />
          </div>

          <p className="text-center text-[11px] font-medium text-amber-700/90">
            Tap for full details
          </p>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 bg-zinc-50/40 p-3">
        <button
          type="button"
          onClick={() => onEdit(product)}
          disabled={isBusy}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-amber-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-amber-800 shadow-sm transition active:scale-[0.98] hover:bg-amber-50 disabled:opacity-40"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          disabled={isBusy}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-rose-200/80 bg-white px-3 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition active:scale-[0.98] hover:bg-rose-50 disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          {isProcessing ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </article>
  );
}
