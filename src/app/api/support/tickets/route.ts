import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const where: any = {};
    if (user.role === 'CUSTOMER') {
      where.customerId = user.userId;
    } else if (user.role === 'MODERATOR') {
      // Can view all or assigned
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        assignedModerator: { select: { name: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { action, ticketId, subject, category, priority, message, isInternalNote, status } = body;

    // Action 1: Create a new ticket
    if (action === 'CREATE_TICKET') {
      if (!subject || !message) {
        return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
      }

      const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newTicket = await prisma.supportTicket.create({
        data: {
          ticketNumber,
          customerId: user.userId,
          subject,
          category: category || 'GENERAL',
          priority: priority || 'MEDIUM',
          status: 'OPEN',
          messages: {
            create: [
              {
                senderId: user.userId,
                senderName: user.name,
                senderRole: user.role,
                message,
                isInternalNote: false,
              },
            ],
          },
        },
        include: { messages: true },
      });

      return NextResponse.json({ success: true, ticket: newTicket });
    }

    // Action 2: Reply to existing ticket
    if (action === 'REPLY') {
      if (!ticketId || !message) {
        return NextResponse.json({ error: 'Ticket ID and message are required' }, { status: 400 });
      }

      const reply = await prisma.ticketMessage.create({
        data: {
          ticketId,
          senderId: user.userId,
          senderName: user.name,
          senderRole: user.role,
          message,
          isInternalNote: Boolean(isInternalNote && ['ADMIN', 'MODERATOR'].includes(user.role)),
        },
      });

      // Update ticket status / timestamp
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
          status: status || (['ADMIN', 'MODERATOR'].includes(user.role) ? 'IN_PROGRESS' : 'OPEN'),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process ticket request' }, { status: 500 });
  }
}
