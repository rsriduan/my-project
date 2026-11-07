import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['MARKETER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized: Marketer access required' }, { status: 403 });
    }

    const where: any = {};
    let marketerProfile = null;

    if (user.role === 'MARKETER') {
      marketerProfile = await prisma.marketerProfile.findUnique({
        where: { userId: user.userId },
      });
      if (!marketerProfile) return NextResponse.json({ campaigns: [] });
      where.marketerId = marketerProfile.id;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        attributions: {
          include: {
            order: { select: { orderNumber: true, totalAmount: true, status: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      profile: marketerProfile,
      campaigns,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['MARKETER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, code, channel, budget, commissionRate, startDate } = await req.json();

    let marketerProfileId: string;
    if (user.role === 'MARKETER') {
      const profile = await prisma.marketerProfile.findUnique({
        where: { userId: user.userId },
      });
      if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      marketerProfileId = profile.id;
    } else {
      const firstMarketer = await prisma.marketerProfile.findFirst();
      if (!firstMarketer) return NextResponse.json({ error: 'No marketer profile found' }, { status: 400 });
      marketerProfileId = firstMarketer.id;
    }

    const campaign = await prisma.campaign.create({
      data: {
        marketerId: marketerProfileId,
        name,
        code: code.toUpperCase().replace(/\s+/g, '_'),
        channel: channel || 'FACEBOOK',
        budget: parseFloat(budget || 0),
        commissionRate: parseFloat(commissionRate || 5.0),
        startDate: new Date(startDate || Date.now()),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}
