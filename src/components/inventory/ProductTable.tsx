'use client';

import { Product } from '@/lib/db/schema';
import { Edit2, Trash2, Package, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/inventory/ProductCard';
import MobileSortBar from '@/components/inventory/MobileSortBar';
import StockDisplay from '@/components/inventory/StockDisplay';
import type { SortField, SortDirection } from '@/lib/types/inventory';

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isBusy?: boolean;
  processingId?: number | null;
  sortField?: SortField | null;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
  onSetSort?: (field: SortField | null, direction: SortDirection) => void;
  editingId?: number | null;
}

function SortHeader({
  label,
  field,
  align = 'left',
  sortField,
  sortDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  align?: 'left' | 'right';
  sortField?: SortField | null;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
}) {
  const active = sortField === field;
  const Icon = active
    ? sortDirection === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <th className={`px-5 py-3.5 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        type="button"
        onClick={() => onSort?.(field)}
        className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition duration-150 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 rounded ${
          align === 'right' ? 'ml-auto' : ''
        } ${active ? 'text-amber-700' : 'text-zinc-500'}`}
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${active ? 'text-amber-600' : 'opacity-50'}`} />
      </button>
    </th>
  );
}

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  isBusy = false,
  processingId = null,
  sortField = null,
  sortDirection = 'asc',
  onSort,
  onSetSort,
  editingId = null,
}: ProductTableProps) {
  return (
    <>
      {onSetSort && (
        <MobileSortBar
          sortField={sortField}
          sortDirection={sortDirection}
          onSetSort={onSetSort}
        />
      )}
      <div className="space-y-4 p-3 pb-5 sm:p-4 md:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            isBusy={isBusy}
            isProcessing={processingId === product.id}
            isEditing={editingId === product.id}
          />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left">
              <SortHeader
                label="Product"
                field="name"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Category"
                field="category"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Price"
                field="price"
                align="right"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <SortHeader
                label="Stock"
                field="stock"
                align="right"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isProcessing = processingId === product.id;
              const rowDisabled = isBusy;

              return (
                <tr
                  key={product.id}
                  onClick={() => !rowDisabled && onView(product)}
                  className={`group/row cursor-pointer border-b border-zinc-100/80 transition-colors duration-150 last:border-0 hover:bg-zinc-50/80 ${
                    editingId === product.id ? 'bg-amber-50/50' : ''
                  } ${rowDisabled ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div
                      className="flex min-w-0 w-full items-center gap-3 text-left"
                      title="Click to view details"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                            <Package className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 truncate group-hover/row:text-amber-700 transition-colors">
                          {product.name}
                        </p>
                        {product.description && (
                          <p className="mt-0.5 max-w-[220px] truncate text-xs text-zinc-500 leading-relaxed">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-2.5 py-1 text-xs font-medium text-zinc-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm font-semibold tabular-nums text-zinc-900">
                      ${product.price}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <StockDisplay stock={product.stock} variant="table" />
                    </div>
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        disabled={rowDisabled}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-amber-600 transition duration-150 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800 hover:shadow-sm focus:ring-2 focus:ring-amber-500/30 outline-none disabled:cursor-not-allowed disabled:opacity-40"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        disabled={rowDisabled}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent p-2 text-rose-500 transition duration-150 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:shadow-sm focus:ring-2 focus:ring-rose-500/30 outline-none disabled:cursor-not-allowed disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {isProcessing && (
                        <span className="ml-1 text-xs text-zinc-400">…</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
