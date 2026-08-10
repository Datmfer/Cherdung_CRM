import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = verifyToken(token);
    if (!session || (session.role.toLowerCase() !== 'support' && session.role.toLowerCase() !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, users: [] });
    }

    const users = await db.user.findMany({
      where: {
        OR: [
          { email: { contains: query.toLowerCase() } },
          { name: { contains: query } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        totpEnabled: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        role: u.role.toLowerCase(),
      })),
    });
  } catch (error: any) {
    console.error('Support user lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
