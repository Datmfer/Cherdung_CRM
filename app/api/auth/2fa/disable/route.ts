import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value || req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await db.user.update({
      where: { id: session.userId },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
    });

    await logActivity(session.userId, '2FA_DISABLED', {}, req);

    return NextResponse.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error: any) {
    console.error('Disable 2FA error:', error);
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 });
  }
}
