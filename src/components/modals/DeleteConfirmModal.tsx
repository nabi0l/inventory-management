'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { Product } from '@/lib/db/schema';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  product,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm motion-safe:animate-[fadeIn_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50">
          <AlertTriangle className="h-6 w-6 text-rose-600" />
        </div>

        <h3 id="delete-modal-title" className="mb-2 text-center text-xl font-bold text-zinc-900">
          Delete product?
        </h3>

        <p className="mb-6 text-center text-zinc-500">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-zinc-900">{product.name}</span>? This action cannot
          be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition duration-150 hover:bg-zinc-100 hover:shadow-md focus:ring-2 focus:ring-zinc-400/50 outline-none disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-150 hover:bg-rose-600 hover:shadow-md focus:ring-2 focus:ring-rose-500/50 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
