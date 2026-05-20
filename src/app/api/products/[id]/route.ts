import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { parseProductFormData } from '@/lib/api/product-form';
import {
  deleteImage,
  isCloudinaryConfigured,
  uploadImage,
} from '@/lib/services/cloudinary';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const formData = await request.formData();
    const input = parseProductFormData(formData);

    const [existingProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let imageUrl = existingProduct.imageUrl;
    let imagePublicId = existingProduct.imagePublicId;

    if (input.image && input.image.size > 0) {
      if (!isCloudinaryConfigured()) {
        return NextResponse.json(
          { error: 'Image upload is not configured. Add Cloudinary credentials to .env.local' },
          { status: 503 }
        );
      }
      try {
        if (existingProduct.imagePublicId) {
          await deleteImage(existingProduct.imagePublicId);
        }
        const uploadResult = await uploadImage(input.image);
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        const message =
          uploadError instanceof Error ? uploadError.message : 'Image upload failed';
        return NextResponse.json(
          { error: message.includes('upload') ? message : `Image upload failed: ${message}` },
          { status: 400 }
        );
      }
    } else if (input.deleteOldImage && existingProduct.imagePublicId) {
      try {
        await deleteImage(existingProduct.imagePublicId);
        imageUrl = null;
        imagePublicId = null;
      } catch (deleteError) {
        console.error('Cloudinary delete error:', deleteError);
        return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 });
      }
    }

    const [updatedProduct] = await db
      .update(products)
      .set({
        name: input.name,
        description: input.description || null,
        category: input.category,
        price: input.price,
        stock: parseInt(input.stock),
        imageUrl,
        imagePublicId,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    const [product] = await db.select().from(products).where(eq(products.id, id));

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId);
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
