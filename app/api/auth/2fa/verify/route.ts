import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';
import * as OTPAuth from 'otpauth';

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

    const { secret, code } = await req.json();
    if (!secret || !code) {
      return NextResponse.json({ error: 'Secret and verification code are required' }, { status: 400 });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'Cherdung CRM',
      label: session.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Save secret and enable 2FA
    await db.user.update({
      where: { id: session.userId },
      data: {
        totpSecret: secret,
        totpEnabled: true,
      },
    });

    await logActivity(session.userId, '2FA_ENABLED', {}, req);

    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error: any) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Failed to enable 2FA' }, { status: 500 });
  }
}
