'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LayoutList } from 'lucide-react';
import type { Product } from '@/lib/db/schema';
import { PRODUCT_CATEGORIES } from '@/lib/constants/categories';
import { getInventoryStats } from '@/lib/utils/inventory-stats';
import { useProducts } from '@/hooks/use-products';
import { useProductFilters } from '@/hooks/use-product-filters';
import AppHeader from '@/components/layout/AppHeader';
import InventorySummary from '@/components/inventory/InventorySummary';
import ProductForm from '@/components/inventory/ProductForm';
import ProductTable from '@/components/inventory/ProductTable';
import SearchAndFilter from '@/components/inventory/SearchAndFilter';
import EmptyState from '@/components/inventory/EmptyState';
import LoadingSkeleton from '@/components/inventory/LoadingSkeleton';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import ProductDetailModal from '@/components/modals/ProductDetailModal';
import PanelCard from '@/components/ui/PanelCard';

export default function InventoryDashboard() {
  const {
    products,
    isLoading,
    lastUpdated,
    isSubmitting,
    processingId,
    saveProduct,
    deleteProduct,
  } = useProducts();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortField,
    sortDirection,
    displayProducts,
    handleSort,
    handleSetSort,
  } = useProductFilters(products);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const { totalItems, totalStock, lowStockCount } = getInventoryStats(products);
  const isBusy = isSubmitting;

  const handleSubmit = async (formData: FormData) => {
    const success = await saveProduct(formData, selectedProduct);
    if (success) setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const success = await deleteProduct(productToDelete);
    if (!success) return;

    setIsDeleteModalOpen(false);
    if (selectedProduct?.id === productToDelete.id) setSelectedProduct(null);
    if (viewingProduct?.id === productToDelete.id) setViewingProduct(null);
    setProductToDelete(null);
  };

  const handleView = (product: Product) => {
    if (isSubmitting) return;
    setViewingProduct(product);
  };

  const handleEdit = (product: Product) => {
    if (isSubmitting) return;
    setViewingProduct(null);
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (product: Product) => {
    if (isSubmitting) return;
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const focusForm = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/25 via-zinc-100 to-zinc-100">
      <Toaster
        position="top-center"
        containerClassName="!top-3 sm:!top-4"
        toastOptions={{
          duration: 3500,
          className: '!bg-white !text-zinc-900 !border !border-zinc-200 !shadow-lg !text-sm',
          success: { iconTheme: { primary: '#d97706', secondary: '#fff' } },
        }}
      />

      <AppHeader />

      <main className="flex-1 pb-safe">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
            <section className="order-1 min-w-0 space-y-3 sm:space-y-4 lg:order-2">
              {!isLoading && products.length > 0 && (
                <InventorySummary
                  totalItems={totalItems}
                  totalStock={totalStock}
                  lowStockCount={lowStockCount}
                  lastUpdated={lastUpdated}
                />
              )}

              <PanelCard
                title="Your inventory"
                subtitle={
                  isLoading
                    ? 'Loading products...'
                    : products.length === 0
                      ? 'No items yet — add one from the form.'
                      : `Showing ${displayProducts.length} of ${products.length} product${products.length !== 1 ? 's' : ''}`
                }
                icon={LayoutList}
                headerVariant="inventory"
                toolbar={
                  products.length > 0 ? (
                    <SearchAndFilter
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      categories={[...PRODUCT_CATEGORIES]}
                    />
                  ) : undefined
                }
              >
                {lowStockCount > 0 && !isLoading && products.length > 0 && (
                  <div className="border-b border-amber-100 bg-amber-50/60 px-4 py-2 sm:px-5">
                    <p className="text-xs font-medium text-amber-800">
                      {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} running low on stock
                    </p>
                  </div>
                )}

                {isLoading ? (
                  <LoadingSkeleton />
                ) : products.length === 0 ? (
                  <EmptyState onAddFirst={focusForm} />
                ) : displayProducts.length === 0 ? (
                  <div className="px-4 py-12 text-center sm:px-5 sm:py-14">
                    <p className="text-sm text-zinc-500">No products match your search.</p>
                  </div>
                ) : (
                  <ProductTable
                    products={displayProducts}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    isBusy={isBusy}
                    processingId={processingId}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onSetSort={handleSetSort}
                    editingId={selectedProduct?.id ?? null}
                  />
                )}
              </PanelCard>
            </section>

            <aside className="order-2 min-w-0 lg:order-1">
              <ProductForm
                product={selectedProduct}
                onSubmit={handleSubmit}
                onCancel={() => setSelectedProduct(null)}
                isLoading={isSubmitting}
                categories={[...PRODUCT_CATEGORIES]}
              />
            </aside>
          </div>
        </div>
      </main>

      <ProductDetailModal
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        isBusy={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onConfirm={handleDelete}
        onCancel={() => {
          if (isSubmitting) return;
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        isLoading={isSubmitting}
      />
    </div>
  );
}
