'use client';

import { Product } from '@/lib/db/schema';
import { X, Edit2, Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import StockDisplay from '@/components/inventory/StockDisplay';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isBusy?: boolean;
}

export default function ProductDetailModal({
  product,
  onClose,
  onEdit,
  onDelete,
  isBusy = false,
}: ProductDetailModalProps) {
  if (!product) return null;

  const handleEdit = () => {
    onClose();
    onEdit(product);
  };

  const handleDelete = () => {
    onClose();
    onDelete(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4 motion-safe:animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-zinc-200 bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Product details</p>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="relative aspect-[16/9] w-full bg-zinc-100">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 512px) 100vw, 512px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full min-h-[10rem] items-center justify-center">
                <Package className="h-14 w-14 text-zinc-300" />
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div>
              <span className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600">
                {product.category}
              </span>
              <h2
                id="product-detail-title"
                className="mt-2 text-xl font-bold leading-snug text-zinc-900 break-words"
              >
                {product.name}
              </h2>
            </div>

            {product.description ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Description
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 break-words whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            ) : (
              <p className="text-sm italic text-zinc-400">No description provided.</p>
            )}

            <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Price
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">
                  ${product.price}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Stock
                </p>
                <div className="mt-1">
                  <StockDisplay stock={product.stock} variant="detail" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-zinc-100 bg-white p-4 sm:p-5">
          <button
            type="button"
            onClick={handleEdit}
            disabled={isBusy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 hover:shadow-sm disabled:opacity-50"
          >
            <Edit2 className="h-4 w-4" />
            Edit product
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isBusy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 hover:shadow-sm disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
