import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateTotalProductionCost } from '@/lib/pricing-engine';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF', 'SHAREHOLDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const costings = await prisma.productCosting.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            regularPrice: true,
            discountPrice: true,
            wholesalePrice: true,
            resellerPrice: true,
            stockQuantity: true,
          },
        },
      },
    });

    return NextResponse.json({ costings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch costing data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { productId, fabricCost, accessoriesCost, printingCost, labelCost, packagingCost, labourCost, overheadCost, otherCost, notes } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const totalCost = calculateTotalProductionCost({
      fabricCost: parseFloat(fabricCost || 0),
      accessoriesCost: parseFloat(accessoriesCost || 0),
      printingCost: parseFloat(printingCost || 0),
      labelCost: parseFloat(labelCost || 0),
      packagingCost: parseFloat(packagingCost || 0),
      labourCost: parseFloat(labourCost || 0),
      overheadCost: parseFloat(overheadCost || 0),
      otherCost: parseFloat(otherCost || 0),
    });

    const costing = await prisma.productCosting.upsert({
      where: { productId },
      update: {
        fabricCost: parseFloat(fabricCost || 0),
        accessoriesCost: parseFloat(accessoriesCost || 0),
        printingCost: parseFloat(printingCost || 0),
        labelCost: parseFloat(labelCost || 0),
        packagingCost: parseFloat(packagingCost || 0),
        labourCost: parseFloat(labourCost || 0),
        overheadCost: parseFloat(overheadCost || 0),
        otherCost: parseFloat(otherCost || 0),
        totalCost,
        notes,
      },
      create: {
        productId,
        fabricCost: parseFloat(fabricCost || 0),
        accessoriesCost: parseFloat(accessoriesCost || 0),
        printingCost: parseFloat(printingCost || 0),
        labelCost: parseFloat(labelCost || 0),
        packagingCost: parseFloat(packagingCost || 0),
        labourCost: parseFloat(labourCost || 0),
        overheadCost: parseFloat(overheadCost || 0),
        otherCost: parseFloat(otherCost || 0),
        totalCost,
        notes,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'COSTING_UPDATED',
        entityType: 'ProductCosting',
        entityId: costing.id,
        details: `Costing updated for product ${productId}. Total cost: ৳${totalCost}`,
      },
    });

    return NextResponse.json({ success: true, costing });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update costing' }, { status: 500 });
  }
}
