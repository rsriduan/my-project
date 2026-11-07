import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const requests = await prisma.withdrawalRequest.findMany({
      include: {
        reseller: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch withdrawal requests' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { id, status, txHash } = await req.json();

    const request = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { reseller: true },
    });

    if (!request) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: 'Request is already processed' }, { status: 400 });
    }

    if (status === 'APPROVED' || status === 'PAID') {
      if (request.reseller.walletBalance < request.amount) {
        return NextResponse.json({ error: 'Reseller balance is lower than withdrawal amount' }, { status: 400 });
      }

      // Deduct from wallet balance and increase totalWithdrawn
      await prisma.resellerProfile.update({
        where: { id: request.resellerId },
        data: {
          walletBalance: { decrement: request.amount },
          totalWithdrawn: { increment: request.amount },
        },
      });

      // Record transaction
      await prisma.walletTransaction.create({
        data: {
          resellerId: request.resellerId,
          type: 'WITHDRAWAL',
          amount: request.amount,
          status: 'COMPLETED',
          reference: txHash || 'DISBURSED',
          note: `Disbursed ৳${request.amount} via ${request.method} (${txHash || 'Manual Transfer'})`,
        },
      });
    }

    const updated = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: status === 'APPROVED' ? 'PAID' : status,
        txHash: txHash || null,
        reviewedBy: user.name,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'WITHDRAWAL_REVIEWED',
        entityType: 'WithdrawalRequest',
        entityId: id,
        details: `Withdrawal of ৳${request.amount} changed to ${status}`,
      },
    });

    return NextResponse.json({ success: true, withdrawal: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update withdrawal request' }, { status: 500 });
  }
}
