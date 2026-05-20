export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food',
  'Furniture',
  'Books',
  'Toys',
  'Other',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
