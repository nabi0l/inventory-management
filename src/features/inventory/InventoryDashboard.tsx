'use client';

import { useState, useRef } from 'react';
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
  const formRef = useRef<HTMLDivElement>(null);
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
    if (success) {
      setSelectedProduct(null);
      scrollToTop();
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const success = await deleteProduct(productToDelete);
    if (!success) return;

    setIsDeleteModalOpen(false);
    if (selectedProduct?.id === productToDelete.id) setSelectedProduct(null);
    if (viewingProduct?.id === productToDelete.id) setViewingProduct(null);
    setProductToDelete(null);
    scrollToTop();
  };

  const handleView = (product: Product) => {
    if (isSubmitting) return;
    setViewingProduct(product);
  };

  const handleEdit = (product: Product) => {
    if (isSubmitting) return;
    setViewingProduct(null);
    setSelectedProduct(product);
    scrollToTop();
  };

  const handleDeleteClick = (product: Product) => {
    if (isSubmitting) return;
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const scrollToTop = () => {
    // Try multiple methods to ensure scroll works
    requestAnimationFrame(() => {
      // Method 1: Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Method 2: Scroll form into view if ref exists
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Method 3: Force scroll on document elements (fallback)
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 50);
    });
  };

  const focusForm = scrollToTop;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          className: '!bg-white !text-zinc-900 !border !border-zinc-200 !text-sm',
          success: { iconTheme: { primary: '#f59e0b', secondary: '#fff' } },
        }}
      />

      <AppHeader />

      <main className="flex-1 pb-safe">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
            <section className="order-1 min-w-0 space-y-4 lg:order-2">
              {!isLoading && products.length > 0 && (
                <InventorySummary
                  totalItems={totalItems}
                  totalStock={totalStock}
                  lowStockCount={lowStockCount}
                  lastUpdated={lastUpdated}
                />
              )}

              <PanelCard
                title="Products"
                subtitle={
                  isLoading
                    ? 'Loading...'
                    : products.length === 0
                      ? 'No products yet'
                      : `${displayProducts.length} of ${products.length}`
                }
                icon={LayoutList}
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
                  <div className="border-b border-amber-200 bg-amber-50 px-5 py-2">
                    <p className="text-xs font-medium text-amber-900">
                      {lowStockCount} item{lowStockCount !== 1 ? 's' : ''} low on stock
                    </p>
                  </div>
                )}

                {isLoading ? (
                  <LoadingSkeleton />
                ) : products.length === 0 ? (
                  <EmptyState onAddFirst={focusForm} />
                ) : displayProducts.length === 0 ? (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm text-zinc-500">No matches found</p>
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

            <aside ref={formRef} className="order-2 min-w-0 lg:order-1">
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
