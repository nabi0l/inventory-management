'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { Product } from '@/lib/db/schema';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProduct = async (formData: FormData, product: Product | null) => {
    try {
      setIsSubmitting(true);
      if (product) setProcessingId(product.id);

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, { method, body: formData });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data.error?.toLowerCase().includes('image') ||
          data.error?.toLowerCase().includes('upload')
            ? 'Image upload failed, please try again.'
            : data.error || 'Failed to save product';
        throw new Error(message);
      }

      toast.success(
        product ? 'Product updated successfully.' : 'Product added successfully.'
      );
      await fetchProducts();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(message);
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
      setProcessingId(null);
    }
  };

  const deleteProduct = async (product: Product) => {
    try {
      setIsSubmitting(true);
      setProcessingId(product.id);

      const response = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted successfully.');
      await fetchProducts();
      return true;
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
      setProcessingId(null);
    }
  };

  return {
    products,
    isLoading,
    lastUpdated,
    isSubmitting,
    processingId,
    fetchProducts,
    saveProduct,
    deleteProduct,
  };
}
