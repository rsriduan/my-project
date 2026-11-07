import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await prisma.liveChatSession.findUnique({
        where: { id: sessionId },
        include: {
          messages: { orderBy: { createdAt: 'asc' } },
        },
      });
      return NextResponse.json({ session });
    }

    // List all sessions (for Moderator or Admin)
    const sessions = await prisma.liveChatSession.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ sessions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch live chat' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { sessionId, customerName, customerEmail, message, senderType = 'CUSTOMER' } = body;

    let activeSessionId = sessionId;

    // Create session if first message
    if (!activeSessionId) {
      const session = await prisma.liveChatSession.create({
        data: {
          customerName: customerName || user?.name || 'Guest Shopper',
          customerEmail: customerEmail || user?.email || null,
          status: 'ACTIVE',
          assignedToName: 'Fatema (Customer Care Lead)',
        },
      });
      activeSessionId = session.id;

      // Welcome automated reply
      await prisma.liveChatMessage.create({
        data: {
          sessionId: activeSessionId,
          senderType: 'SYSTEM',
          senderName: 'DELIED Concierge',
          message: 'Assalamu Alaikum! Welcome to DELIED Fashion. Our customer care specialist will assist you shortly.',
        },
      });
    }

    if (message) {
      const chatMsg = await prisma.liveChatMessage.create({
        data: {
          sessionId: activeSessionId,
          senderType: user && ['ADMIN', 'MODERATOR'].includes(user.role) ? 'MODERATOR' : senderType,
          senderName: user ? user.name : customerName || 'Shopper',
          message,
        },
      });

      return NextResponse.json({
        success: true,
        sessionId: activeSessionId,
        message: chatMsg,
      });
    }

    return NextResponse.json({ success: true, sessionId: activeSessionId });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
