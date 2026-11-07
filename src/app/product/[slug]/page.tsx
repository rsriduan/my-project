import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailsClient from './ProductDetailsClient';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ slug: '_placeholder' }];
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: { customer: { select: { name: true } } },
        },
      },
    });

    if (!product) {
      notFound();
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: 'PUBLISHED',
      },
      take: 4,
    });

    return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
  } catch {
    notFound();
  }
}
