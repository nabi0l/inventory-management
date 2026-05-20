import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { parseProductFormData, validateProductInput } from '@/lib/api/product-form';
import { isCloudinaryConfigured, uploadImage } from '@/lib/services/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }
    if (category && category !== 'all') {
      conditions.push(eq(products.category, category));
    }

    const allProducts =
      conditions.length > 0
        ? await db
            .select()
            .from(products)
            .where(and(...conditions))
            .orderBy(desc(products.createdAt))
        : await db.select().from(products).orderBy(desc(products.createdAt));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const input = parseProductFormData(formData);
    const validationError = validateProductInput(input);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (input.image && input.image.size > 0) {
      if (!isCloudinaryConfigured()) {
        return NextResponse.json(
          { error: 'Image upload is not configured. Add Cloudinary credentials to .env.local' },
          { status: 503 }
        );
      }
      try {
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
    }

    const [newProduct] = await db
      .insert(products)
      .values({
        name: input.name,
        description: input.description || null,
        category: input.category,
        price: input.price,
        stock: parseInt(input.stock),
        imageUrl,
        imagePublicId,
      })
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
