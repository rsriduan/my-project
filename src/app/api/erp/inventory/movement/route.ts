import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const movements = await prisma.stockMovement.findMany({
      include: {
        product: { select: { name: true, sku: true } },
        responsibleUser: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ movements });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch stock movements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { productId, type, quantity, reason, reference } = await req.json();

    if (!productId || !type || quantity === undefined || !reason) {
      return NextResponse.json({ error: 'Product, type, quantity and reason are required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const qty = parseInt(quantity, 10);
    const prevStock = product.stockQuantity;
    let newStock = prevStock;

    if (type === 'STOCK_IN' || type === 'RETURN') {
      newStock = prevStock + qty;
    } else if (type === 'STOCK_OUT' || type === 'DAMAGE' || type === 'TRANSFER') {
      newStock = Math.max(0, prevStock - qty);
    } else if (type === 'ADJUSTMENT') {
      newStock = qty; // Direct adjustment to new level
    }

    await prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newStock },
    });

    const movement = await prisma.stockMovement.create({
      data: {
        productId,
        type,
        quantity: type === 'ADJUSTMENT' ? newStock - prevStock : qty,
        previousStock: prevStock,
        newStock,
        reason,
        reference: reference || `ADJ-${Date.now()}`,
        responsibleUserId: user.userId,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'INVENTORY_ADJUSTMENT',
        entityType: 'StockMovement',
        entityId: movement.id,
        details: `${type} of ${qty} for ${product.name} (${product.sku}). Stock: ${prevStock} -> ${newStock}. Reason: ${reason}`,
      },
    });

    return NextResponse.json({ success: true, movement, newStock });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record stock movement' }, { status: 500 });
  }
}
