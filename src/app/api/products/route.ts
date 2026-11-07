import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const filter = searchParams.get('filter'); // featured, new, best, winter
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort'); // price-asc, price-desc, newest

    const where: any = {
      status: 'PUBLISHED',
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (filter === 'featured') where.isFeatured = true;
    if (filter === 'new') where.isNewArrival = true;
    if (filter === 'best') where.isBestSeller = true;
    if (filter === 'winter') where.isWinterCollection = true;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameBn: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.regularPrice = {};
      if (minPrice) where.regularPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.regularPrice.lte = parseFloat(maxPrice);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { regularPrice: 'asc' };
    if (sort === 'price-desc') orderBy = { regularPrice: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        costing: true,
      },
      orderBy,
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      nameBn,
      slug,
      sku,
      description,
      regularPrice,
      discountPrice,
      wholesalePrice,
      resellerPrice,
      suggestedRetailPrice,
      minWholesaleQty,
      stockQuantity,
      categoryId,
      images,
      sizes,
      colors,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isWinterCollection,
      costing,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        nameBn: nameBn || name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        description,
        regularPrice: parseFloat(regularPrice),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        wholesalePrice: parseFloat(wholesalePrice || regularPrice * 0.65),
        resellerPrice: parseFloat(resellerPrice || regularPrice * 0.75),
        suggestedRetailPrice: parseFloat(suggestedRetailPrice || regularPrice),
        minWholesaleQty: parseInt(minWholesaleQty || '20', 10),
        stockQuantity: parseInt(stockQuantity || '0', 10),
        categoryId,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || ['M', 'L', 'XL']),
        colors: JSON.stringify(colors || ['Black', 'Navy']),
        isFeatured: Boolean(isFeatured),
        isNewArrival: Boolean(isNewArrival),
        isBestSeller: Boolean(isBestSeller),
        isWinterCollection: Boolean(isWinterCollection),
        costing: costing
          ? {
              create: {
                fabricCost: parseFloat(costing.fabricCost || 0),
                accessoriesCost: parseFloat(costing.accessoriesCost || 0),
                printingCost: parseFloat(costing.printingCost || 0),
                labelCost: parseFloat(costing.labelCost || 0),
                packagingCost: parseFloat(costing.packagingCost || 0),
                labourCost: parseFloat(costing.labourCost || 0),
                overheadCost: parseFloat(costing.overheadCost || 0),
                otherCost: parseFloat(costing.otherCost || 0),
                totalCost: parseFloat(costing.totalCost || 0),
              },
            }
          : undefined,
      },
      include: { costing: true, category: true },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: 'STOCK_IN',
        quantity: product.stockQuantity,
        previousStock: 0,
        newStock: product.stockQuantity,
        reason: 'Initial stock entry on product creation',
        responsibleUserId: user.userId,
        reference: `PROD-CREATE-${product.sku}`,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
