export type ProductFormInput = {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  image: File | null;
  deleteOldImage: boolean;
};

export function parseProductFormData(formData: FormData): ProductFormInput {
  return {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    price: formData.get('price') as string,
    stock: formData.get('stock') as string,
    image: formData.get('image') as File | null,
    deleteOldImage: formData.get('deleteOldImage') === 'true',
  };
}

export function validateProductInput(input: ProductFormInput): string | null {
  if (!input.name || !input.category || !input.price || !input.stock) {
    return 'Missing required fields';
  }
  return null;
}
