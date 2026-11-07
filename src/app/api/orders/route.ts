import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getDeliveryCharge } from '@/lib/bangladesh';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const orderNumber = searchParams.get('orderNumber');

    // Public lookup for order tracking page
    if (orderNumber) {
      const singleOrder = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
          timeline: { orderBy: { createdAt: 'asc' } },
        },
      });
      if (!singleOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ order: singleOrder });
    }

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Role-based visibility
    if (['ADMIN', 'STAFF', 'MODERATOR'].includes(user.role)) {
      // Full view
    } else if (user.role === 'CUSTOMER') {
      where.customerId = user.userId;
    } else if (user.role === 'RESELLER') {
      const resellerProfile = await prisma.resellerProfile.findUnique({
        where: { userId: user.userId },
      });
      if (!resellerProfile) return NextResponse.json({ orders: [] });
      where.resellerId = resellerProfile.id;
    } else if (user.role === 'WHOLESALE') {
      const wsProfile = await prisma.wholesaleProfile.findUnique({
        where: { userId: user.userId },
      });
      if (!wsProfile) return NextResponse.json({ orders: [] });
      where.wholesaleBuyerId = wsProfile.id;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'desc' } },
        customer: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      district,
      upazila,
      notes,
      paymentMethod,
      paymentTxId,
      items,
      couponCode,
      orderType = 'RETAIL',
      campaignCode,
    } = body;

    if (!customerName || !customerPhone || !shippingAddress || !district || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing mandatory shipping or order item details' }, { status: 400 });
    }

    const deliveryCharge = getDeliveryCharge(district);

    // Compute subtotal and validate items from database
    let subtotal = 0;
    let resellerTotalProfit = 0;
    const validatedItems: any[] = [];

    let resellerProfile: any = null;
    let wholesaleProfile: any = null;

    if (user && user.role === 'RESELLER') {
      resellerProfile = await prisma.resellerProfile.findUnique({
        where: { userId: user.userId },
      });
    } else if (user && user.role === 'WHOLESALE') {
      wholesaleProfile = await prisma.wholesaleProfile.findUnique({
        where: { userId: user.userId },
      });
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` },
          { status: 400 }
        );
      }

      let unitPrice = product.discountPrice || product.regularPrice;
      let customResellerPrice = null;

      if (orderType === 'RESELLER' && resellerProfile) {
        // Base reseller price
        unitPrice = product.resellerPrice;
        customResellerPrice = item.customResellerPrice || product.suggestedRetailPrice;
        const profit = Math.max(0, customResellerPrice - unitPrice) * item.quantity;
        resellerTotalProfit += profit;
      } else if (orderType === 'WHOLESALE' && wholesaleProfile) {
        unitPrice = product.wholesalePrice;
      }

      const itemTotal = (customResellerPrice || unitPrice) * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: unitPrice,
        customResellerPrice,
        quantity: item.quantity,
        total: itemTotal,
        size: item.size || 'Standard',
        color: item.color || 'Standard',
      });
    }

    // Apply Coupon if present
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (coupon && coupon.isActive && new Date() <= coupon.validUntil && subtotal >= coupon.minPurchase) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { timesUsed: { increment: 1 } },
        });
      }
    }

    const totalAmount = Math.max(0, subtotal - discount + deliveryCharge);
    const orderNumber = `DEL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order with Items and Timeline
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerId: user?.userId || null,
        resellerId: resellerProfile?.id || null,
        wholesaleBuyerId: wholesaleProfile?.id || null,
        orderType,
        status: 'PENDING',
        subtotal,
        discount,
        deliveryCharge,
        totalAmount,
        resellerProfit: resellerTotalProfit,
        paymentMethod: paymentMethod || 'COD',
        paymentStatus: paymentMethod === 'COD' ? 'UNPAID' : paymentTxId ? 'PAID' : 'UNPAID',
        paymentTxId: paymentTxId || null,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        district,
        upazila,
        notes,
        campaignCode: campaignCode || null,
        items: {
          create: validatedItems,
        },
        timeline: {
          create: [
            {
              status: 'PENDING',
              note: `Order placed via ${paymentMethod || 'COD'}`,
              changedBy: user?.name || customerName,
            },
          ],
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Deduct stock & create StockMovement records
    for (const item of validatedItems) {
      const updatedProduct = await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });

      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'SALES_DEDUCTION',
          quantity: -item.quantity,
          previousStock: updatedProduct.stockQuantity + item.quantity,
          newStock: updatedProduct.stockQuantity,
          reason: `Sold in order ${orderNumber}`,
          responsibleUserId: user?.userId || null,
          reference: orderNumber,
        },
      });
    }

    // If Reseller order, add pending commission to wallet
    if (resellerProfile && resellerTotalProfit > 0) {
      await prisma.walletTransaction.create({
        data: {
          resellerId: resellerProfile.id,
          type: 'EARNING',
          amount: resellerTotalProfit,
          status: 'PENDING',
          reference: orderNumber,
          note: `Estimated profit for Order ${orderNumber} (Credited upon delivery)`,
        },
      });
    }

    // Campaign Attribution if campaignCode exists
    if (campaignCode) {
      const campaign = await prisma.campaign.findUnique({
        where: { code: campaignCode },
      });
      if (campaign && campaign.status === 'ACTIVE') {
        const commission = (subtotal * campaign.commissionRate) / 100;
        await prisma.campaignAttribution.create({
          data: {
            campaignId: campaign.id,
            orderId: newOrder.id,
            orderAmount: subtotal,
            commissionAmount: commission,
            status: 'PENDING',
          },
        });
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            conversions: { increment: 1 },
            revenue: { increment: subtotal },
          },
        });
      }
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId || null,
        action: 'ORDER_PLACED',
        entityType: 'Order',
        entityId: newOrder.id,
        details: `Order ${orderNumber} placed for ৳${totalAmount.toLocaleString()} (${orderType})`,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
