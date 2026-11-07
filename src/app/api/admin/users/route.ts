import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        district: true,
        upazila: true,
        createdAt: true,
        resellerProfile: true,
        wholesaleProfile: true,
        staffProfile: true,
        shareholderProfile: true,
        moderatorProfile: true,
        marketerProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { userId, role, status, resellerApproval, wholesaleApproval } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Handle Reseller approval status
    if (resellerApproval) {
      await prisma.resellerProfile.updateMany({
        where: { userId },
        data: { status: resellerApproval },
      });
    }

    // Handle Wholesale approval status
    if (wholesaleApproval) {
      await prisma.wholesaleProfile.updateMany({
        where: { userId },
        data: { status: wholesaleApproval },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'USER_ROLE_OR_STATUS_MODIFIED',
        entityType: 'User',
        entityId: userId,
        details: `Admin changed user status/role to role: ${role || 'unchanged'}, status: ${status || 'unchanged'}, reseller: ${resellerApproval || 'none'}`,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
