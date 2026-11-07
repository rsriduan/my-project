import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

const ROLE_DEMO_EMAILS: Record<string, string> = {
  ADMIN: 'admin@delied.com',
  CUSTOMER: 'customer@delied.com',
  RESELLER: 'reseller@delied.com',
  WHOLESALE: 'wholesale@delied.com',
  STAFF: 'staff@delied.com',
  SHAREHOLDER: 'shareholder@delied.com',
  MODERATOR: 'moderator@delied.com',
  MARKETER: 'marketer@delied.com',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, demoRole } = body;

    let targetEmail = email;

    // Support instant demo login
    if (demoRole && ROLE_DEMO_EMAILS[demoRole]) {
      targetEmail = ROLE_DEMO_EMAILS[demoRole];
    }

    if (!targetEmail) {
      return NextResponse.json({ error: 'Email or demo role is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    // If regular login, verify password
    if (!demoRole) {
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Account has been suspended. Please contact admin.' }, { status: 403 });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    const token = signToken(payload);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: `Successful login as ${user.role} (${demoRole ? 'Demo Quick-Login' : 'Standard'})`,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: payload,
    });

    // Set cookie
    response.cookies.set({
      name: 'delied_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
