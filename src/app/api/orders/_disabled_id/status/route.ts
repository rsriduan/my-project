import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export function generateStaticParams() {
  return [];
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF', 'MODERATOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized to change order status' }, { status: 403 });
    }

    const { status, note, courier, trackingNumber, paymentStatus } = await req.json();
    const orderId = params.id;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, reseller: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const previousStatus = existingOrder.status;

    // Build update object
    const updateData: any = {
      status,
    };
    if (courier) updateData.deliveryCourier = courier;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // If order delivered and payment was COD, automatically mark payment as PAID
    if (status === 'DELIVERED' && existingOrder.paymentStatus === 'UNPAID') {
      updateData.paymentStatus = 'PAID';
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    // Add Timeline Entry
    await prisma.orderTimeline.create({
      data: {
        orderId,
        status,
        note: note || `Status updated from ${previousStatus} to ${status} by ${user.name}`,
        changedBy: user.name,
      },
    });

    // If marked DELIVERED and has reseller profit, credit reseller wallet!
    if (status === 'DELIVERED' && existingOrder.resellerId && existingOrder.resellerProfit > 0) {
      await prisma.resellerProfile.update({
        where: { id: existingOrder.resellerId },
        data: {
          walletBalance: { increment: existingOrder.resellerProfit },
          totalEarned: { increment: existingOrder.resellerProfit },
        },
      });

      await prisma.walletTransaction.create({
        data: {
          resellerId: existingOrder.resellerId,
          type: 'EARNING',
          amount: existingOrder.resellerProfit,
          status: 'COMPLETED',
          reference: existingOrder.orderNumber,
          note: `Delivered: ৳${existingOrder.resellerProfit} credited to wallet for ${existingOrder.orderNumber}`,
        },
      });
    }

    // If order CANCELLED, restore stock
    if (status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      for (const item of existingOrder.items) {
        const prod = await prisma.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });

        await prisma.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'RETURN',
            quantity: item.quantity,
            previousStock: prod.stockQuantity - item.quantity,
            newStock: prod.stockQuantity,
            reason: `Restocked due to cancellation of Order ${existingOrder.orderNumber}`,
            responsibleUserId: user.userId,
            reference: existingOrder.orderNumber,
          },
        });
      }
    }

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'ORDER_STATUS_UPDATE',
        entityType: 'Order',
        entityId: orderId,
        details: `Order ${existingOrder.orderNumber} changed from ${previousStatus} to ${status}`,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
