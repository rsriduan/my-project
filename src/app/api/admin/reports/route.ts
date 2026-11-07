import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [
      totalOrders,
      totalUsers,
      totalProducts,
      orders,
      auditLogs,
      recentStockMovements,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        include: { items: true },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: { user: { select: { name: true, role: true } } },
      }),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { product: { select: { name: true, sku: true } } },
      }),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveredSales = orders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const ordersByStatus: Record<string, number> = {};
    const ordersByType: Record<string, number> = {};

    orders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
      ordersByType[o.orderType] = (ordersByType[o.orderType] || 0) + 1;
    });

    const resellerCount = await prisma.resellerProfile.count();
    const wholesaleCount = await prisma.wholesaleProfile.count();

    return NextResponse.json({
      metrics: {
        totalOrders,
        totalSales,
        deliveredSales,
        totalUsers,
        totalProducts,
        resellerCount,
        wholesaleCount,
      },
      ordersByStatus,
      ordersByType,
      auditLogs,
      recentStockMovements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate admin reports' }, { status: 500 });
  }
}
