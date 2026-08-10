import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

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

    // Generate TOTP secret
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: 'Cherdung CRM',
      label: session.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });

    const uri = totp.toString();
    const qrCodeUrl = await QRCode.toDataURL(uri);

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
    });
  } catch (error: any) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Failed to generate 2FA setup' }, { status: 500 });
  }
}
