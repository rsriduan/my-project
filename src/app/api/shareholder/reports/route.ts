import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['SHAREHOLDER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized: Shareholder access required' }, { status: 403 });
    }

    let shareholderProfile = null;
    if (user.role === 'SHAREHOLDER') {
      shareholderProfile = await prisma.shareholderProfile.findUnique({
        where: { userId: user.userId },
        include: {
          dividends: { orderBy: { createdAt: 'desc' } },
        },
      });
    }

    const documents = await prisma.shareholderDocument.findMany({
      orderBy: { publishedAt: 'desc' },
    });

    const announcements = await prisma.announcement.findMany({
      where: {
        targetRole: { in: ['ALL', 'SHAREHOLDER'] },
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Approved high-level performance metrics for shareholders
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { totalAmount: true },
    });
    const grossRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      profile: shareholderProfile,
      documents,
      announcements,
      financialSummary: {
        fiscalYear: 'FY 2025-2026',
        grossRevenue,
        dividendYield: '14.2%',
        totalEquitySharesIssued: 500000,
        auditedBy: 'Rahman & Co Chartered Accountants',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch shareholder portal data' }, { status: 500 });
  }
}
