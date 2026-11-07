import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'RESELLER') {
      return NextResponse.json({ error: 'Unauthorized: Reseller access required' }, { status: 403 });
    }

    const profile = await prisma.resellerProfile.findUnique({
      where: { userId: user.userId },
      include: {
        walletTransactions: { orderBy: { createdAt: 'desc' } },
        withdrawalRequests: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Reseller profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      wallet: {
        balance: profile.walletBalance,
        totalEarned: profile.totalEarned,
        totalWithdrawn: profile.totalWithdrawn,
        status: profile.status,
        transactions: profile.walletTransactions,
        withdrawals: profile.withdrawalRequests,
        payoutMethods: {
          bkashNumber: profile.bkashNumber,
          nagadNumber: profile.nagadNumber,
          bankName: profile.bankName,
          accountNumber: profile.accountNumber,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch wallet information' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'RESELLER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { amount, method, paymentDetails } = await req.json();

    if (!amount || amount <= 0 || !method || !paymentDetails) {
      return NextResponse.json({ error: 'Amount, method and payout details are required' }, { status: 400 });
    }

    const profile = await prisma.resellerProfile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Reseller profile not found' }, { status: 404 });
    }

    if (amount > profile.walletBalance) {
      return NextResponse.json(
        { error: `Insufficient wallet balance. Available: ৳${profile.walletBalance.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Minimum withdrawal threshold in BDT
    if (amount < 500) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is ৳500' }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        resellerId: profile.id,
        amount: parseFloat(amount),
        method,
        paymentDetails,
        status: 'PENDING',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'WITHDRAWAL_REQUESTED',
        entityType: 'WithdrawalRequest',
        entityId: withdrawal.id,
        details: `Reseller requested ৳${amount} via ${method}`,
      },
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to submit withdrawal request' }, { status: 500 });
  }
}
