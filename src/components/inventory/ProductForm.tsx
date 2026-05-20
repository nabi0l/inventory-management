'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Upload, Loader2, X, PlusCircle, PencilLine, ImageIcon } from 'lucide-react';
import { Product } from '@/lib/db/schema';
import Image from 'next/image';
import PanelCard from '@/components/ui/PanelCard';

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/25 outline-none transition duration-150';

const btnSecondary =
  'flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition duration-150 hover:bg-zinc-100 hover:shadow-md focus:ring-2 focus:ring-zinc-400/40 outline-none disabled:opacity-50 disabled:cursor-not-allowed';

const btnPrimary =
  'flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-500/25 transition duration-150 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/35 focus:ring-2 focus:ring-amber-500/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md';

const MAX_IMAGE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  categories: string[];
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
  categories,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setCategory(product.category);
      setPrice(product.price);
      setStock(product.stock.toString());
      setImagePreview(product.imageUrl || null);
      setImageFile(null);
      setImageRemoved(false);
      setErrors({});
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setStock('');
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(false);
    setErrors({});
  };

  const validateImageFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, WebP, or GIF images are allowed.';
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      return `Image must be ${MAX_IMAGE_MB}MB or smaller.`;
    }
    return null;
  };

  const applyImageFile = (file: File) => {
    const imageError = validateImageFile(file);
    if (imageError) {
      setErrors((prev) => ({ ...prev, image: imageError }));
      return;
    }
    clearFieldError('image');
    setImageFile(file);
    setImageRemoved(false);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyImageFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) applyImageFile(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (product?.imageUrl) setImageRemoved(true);
  };

  const isDataPreview = imagePreview?.startsWith('data:') ?? false;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (stock === '' || parseInt(stock) < 0) newErrors.stock = 'Stock must be 0 or greater';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('stock', stock);
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageRemoved && product) {
      formData.append('deleteOldImage', 'true');
    }

    await onSubmit(formData);
    if (!product) resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <PanelCard
      title={product ? 'Edit product' : 'New product'}
      subtitle={
        product
          ? `Editing “${product.name}” — save or cancel when done.`
          : 'Add a new item to your inventory.'
      }
      icon={product ? PencilLine : PlusCircle}
      className={product ? 'ring-2 ring-amber-400/40 border-amber-300/80' : ''}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5" aria-busy={isLoading}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Product image
          </label>
          {errors.image && !imagePreview && (
            <p className="mb-2 text-xs text-rose-600">{errors.image}</p>
          )}
          {imagePreview ? (
            <div className="relative overflow-hidden rounded-xl border-2 border-amber-200 bg-zinc-50">
              <div className="relative aspect-[16/10] w-full">
                {isDataPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-amber-100 bg-white/90 px-3 py-2">
                <span className="text-xs text-zinc-500 truncate">
                  {imageFile
                    ? `${imageFile.name} → uploads to Cloudinary on save`
                    : imageRemoved
                      ? 'Image will be removed on save'
                      : 'Stored in Cloudinary'}
                </span>
                <div className="flex shrink-0 gap-2">
                  <label className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm transition duration-150 hover:bg-zinc-50 hover:shadow-md">
                    Change
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearImage}
                    disabled={isLoading}
                    className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm transition duration-150 hover:bg-zinc-50 hover:shadow-md disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                if (!isLoading) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`group/upload flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition duration-150 ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/50'
                  : 'border-zinc-200 bg-zinc-50/50 hover:border-amber-400 hover:bg-amber-50/30 hover:shadow-sm'
              }`}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition group-hover/upload:scale-105">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs text-zinc-500">
                <span className="font-semibold text-amber-600">Click to upload</span> or drag here
              </span>
              <span className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                <ImageIcon className="h-3 w-3" /> PNG, JPG up to 5MB
              </span>
              <input
                type="file"
                className="hidden"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </label>
          )}
          <p className="mt-1.5 text-[11px] text-zinc-400">
            Images are uploaded to Cloudinary when you save the product.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError('name');
            }}
            className={`${inputClass} ${errors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' : ''}`}
            placeholder="e.g. Wireless Mouse"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="Short description (optional)"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              clearFieldError('category');
            }}
            className={`${inputClass} ${errors.category ? 'border-rose-400' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Price <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  clearFieldError('price');
                }}
                onWheel={(e) => e.currentTarget.blur()}
                className={`${inputClass} pl-7 ${errors.price ? 'border-rose-400' : ''}`}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                clearFieldError('stock');
              }}
              onWheel={(e) => e.currentTarget.blur()}
              className={`${inputClass} ${errors.stock ? 'border-rose-400' : ''}`}
              placeholder="0"
              disabled={isLoading}
            />
            {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
          </div>
        </div>

        <div className="flex gap-2 border-t border-zinc-100 pt-4">
          {(product || name || category || price || stock) && (
            <button type="button" onClick={handleCancel} className={btnSecondary} disabled={isLoading}>
              {product ? (
                <>
                  <X className="h-4 w-4" /> Cancel
                </>
              ) : (
                'Reset'
              )}
            </button>
          )}
          <button type="submit" className={btnPrimary} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {imageFile ? 'Uploading image…' : 'Saving…'}
              </>
            ) : product ? (
              'Update product'
            ) : (
              'Add to inventory'
            )}
          </button>
        </div>
      </form>
    </PanelCard>
  );
}
