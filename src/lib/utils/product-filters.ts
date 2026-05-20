import type { Product } from '@/lib/db/schema';
import type { SortDirection, SortField } from '@/lib/types/inventory';

export function filterProducts(
  products: Product[],
  searchTerm: string,
  selectedCategory: string
): Product[] {
  let filtered = products;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    );
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(
      (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  return filtered;
}

export function sortProducts(
  products: Product[],
  sortField: SortField | null,
  sortDirection: SortDirection
): Product[] {
  if (!sortField) return products;

  return [...products].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case 'name':
        cmp = a.name.localeCompare(b.name);
        break;
      case 'category':
        cmp = a.category.localeCompare(b.category);
        break;
      case 'price':
        cmp = parseFloat(a.price) - parseFloat(b.price);
        break;
      case 'stock':
        cmp = a.stock - b.stock;
        break;
    }
    return sortDirection === 'asc' ? cmp : -cmp;
  });
}
