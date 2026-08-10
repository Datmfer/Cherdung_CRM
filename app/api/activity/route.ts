import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const role = session.role.toLowerCase();
    const where = role === 'admin' ? {} : { userId: session.userId };

    const activities = await db.activity.findMany({
      where,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      activities: activities.map((a) => ({
        id: a.id,
        userId: a.userId,
        userName: a.user?.name || 'System',
        userEmail: a.user?.email || '',
        avatarUrl: a.user?.avatarUrl || null,
        action: a.action,
        metadata: a.metadata ? JSON.parse(a.metadata) : null,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error('Activity logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
