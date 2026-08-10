import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const verificationRecord = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_verification_token', req.url)
      );
    }

    if (new Date() > verificationRecord.expiresAt) {
      await db.verificationToken.delete({ where: { id: verificationRecord.id } });
      return NextResponse.redirect(
        new URL('/login?error=expired_verification_token', req.url)
      );
    }

    // Mark user as verified
    const user = await db.user.update({
      where: { email: verificationRecord.email },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await db.verificationToken.delete({ where: { id: verificationRecord.id } });

    await logActivity(user.id, 'EMAIL_VERIFIED', { email: user.email }, req);

    return NextResponse.redirect(
      new URL('/login?message=email_verified_successfully', req.url)
    );
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
