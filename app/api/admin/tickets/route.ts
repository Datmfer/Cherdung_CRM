import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';

// In-memory support tickets store for platform demo
let mockTickets = [
  { id: 'TICK-101', user: 'Deepak Magar', email: 'dpk@gmail.com', subject: 'Account 2FA Setup Query', status: 'OPEN', priority: 'HIGH', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'TICK-102', user: 'Ram Bahadur', email: 'ram@chd.com', subject: 'Billing & Invoice Question', status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'TICK-103', user: 'Demo Client', email: 'user@cherdung.com', subject: 'Profile Avatar Upload Assistance', status: 'RESOLVED', priority: 'LOW', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || (session.role.toLowerCase() !== 'admin' && session.role.toLowerCase() !== 'support')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ success: true, tickets: mockTickets });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || (session.role.toLowerCase() !== 'admin' && session.role.toLowerCase() !== 'support')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, status } = await req.json();
    const ticket = mockTickets.find((t) => t.id === id);
    if (ticket) {
      ticket.status = status;
      await logActivity(session.userId, 'TICKET_STATUS_UPDATED', { ticketId: id, status }, req);
    }

    return NextResponse.json({ success: true, tickets: mockTickets });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
