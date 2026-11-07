import { NextResponse } from 'next/server';
import { getCurrentUser, getFullUserProfile } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const fullProfile = await getFullUserProfile(session.userId);
    if (!fullProfile) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { passwordHash, ...safeUser } = fullProfile;

    return NextResponse.json({
      user: {
        userId: safeUser.id,
        email: safeUser.email,
        name: safeUser.name,
        phone: safeUser.phone,
        role: safeUser.role,
        status: safeUser.status,
        address: safeUser.address,
        district: safeUser.district,
        upazila: safeUser.upazila,
        profile:
          safeUser.resellerProfile ||
          safeUser.wholesaleProfile ||
          safeUser.shareholderProfile ||
          safeUser.staffProfile ||
          safeUser.moderatorProfile ||
          safeUser.marketerProfile ||
          null,
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
