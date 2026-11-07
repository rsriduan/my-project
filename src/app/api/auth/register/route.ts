import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role, district, upazila, address, businessName, tradeLicense } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = ['CUSTOMER', 'RESELLER', 'WHOLESALE'].includes(role) ? role : 'CUSTOMER';
    const initialStatus = assignedRole === 'CUSTOMER' ? 'ACTIVE' : 'PENDING_APPROVAL';

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: assignedRole,
        status: initialStatus,
        district,
        upazila,
        address,
      },
    });

    // Create role-specific profile
    if (assignedRole === 'RESELLER') {
      await prisma.resellerProfile.create({
        data: {
          userId: newUser.id,
          businessName: businessName || name + "'s Wardrobe",
          tradeLicense: tradeLicense || '',
          status: 'PENDING',
          commissionRate: 15.0,
        },
      });
    } else if (assignedRole === 'WHOLESALE') {
      await prisma.wholesaleProfile.create({
        data: {
          userId: newUser.id,
          companyName: businessName || name + ' Enterprise',
          tradeLicense: tradeLicense || '',
          tier: 'TIER_1',
          discountPercentage: 25.0,
          status: 'PENDING',
        },
      });
    }

    const payload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status,
    };

    const token = signToken(payload);

    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: newUser.id,
        details: `New registration as ${assignedRole}`,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: payload,
    });

    response.cookies.set({
      name: 'delied_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
  }
}
