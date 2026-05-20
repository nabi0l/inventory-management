import type { Product } from '@/lib/db/schema';

const LOW_STOCK_THRESHOLD = 10;

export function getInventoryStats(products: Product[]) {
  return {
    totalItems: products.length,
    totalStock: products.reduce((sum, product) => sum + product.stock, 0),
    lowStockCount: products.filter((product) => product.stock < LOW_STOCK_THRESHOLD).length,
  };
}
