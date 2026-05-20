'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/db/schema';
import { filterProducts, sortProducts } from '@/lib/utils/product-filters';
import type { SortDirection, SortField } from '@/lib/types/inventory';

export function useProductFilters(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const displayProducts = useMemo(() => {
    const filtered = filterProducts(products, searchTerm, selectedCategory);
    return sortProducts(filtered, sortField, sortDirection);
  }, [products, searchTerm, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSetSort = (field: SortField | null, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortField,
    sortDirection,
    displayProducts,
    handleSort,
    handleSetSort,
  };
}
