import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Staff role required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'orders'; // orders, finance, inventory

    let csvContent = '';
    let fileName = `delied-${type}-export-${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'orders') {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'District', 'Type', 'Status', 'Payment Method', 'Payment Status', 'Subtotal', 'Delivery Charge', 'Total Amount'];
      const rows = orders.map((o) => [
        o.orderNumber,
        new Date(o.createdAt).toISOString().slice(0, 10),
        `"${o.customerName}"`,
        `"${o.customerPhone}"`,
        `"${o.district}"`,
        o.orderType,
        o.status,
        o.paymentMethod,
        o.paymentStatus,
        o.subtotal,
        o.deliveryCharge,
        o.totalAmount,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'finance') {
      const transactions = await prisma.financialTransaction.findMany({
        include: { account: true, createdByUser: true },
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Tx Number', 'Date', 'Account', 'Type', 'Category', 'Amount', 'Description', 'Created By'];
      const rows = transactions.map((t) => [
        t.transactionNumber,
        new Date(t.createdAt).toISOString().slice(0, 10),
        `"${t.account.name}"`,
        t.type,
        t.category,
        t.amount,
        `"${t.description}"`,
        `"${t.createdByUser?.name || 'System'}"`,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    } else if (type === 'inventory') {
      const movements = await prisma.stockMovement.findMany({
        include: { product: true, responsibleUser: true },
        orderBy: { createdAt: 'desc' },
      });

      const headers = ['Date', 'Product', 'SKU', 'Movement Type', 'Quantity Changed', 'Previous Stock', 'New Stock', 'Reason', 'Responsible User'];
      const rows = movements.map((m) => [
        new Date(m.createdAt).toISOString().slice(0, 10),
        `"${m.product.name}"`,
        m.product.sku,
        m.type,
        m.quantity,
        m.previousStock,
        m.newStock,
        `"${m.reason}"`,
        `"${m.responsibleUser?.name || 'System'}"`,
      ]);

      csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
