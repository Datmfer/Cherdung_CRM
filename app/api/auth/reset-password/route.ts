import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    const resetRecord = await db.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (new Date() > resetRecord.expiresAt) {
      await db.passwordResetToken.delete({ where: { id: resetRecord.id } });
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: resetRecord.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordHash = await hashPassword(password);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete token
    await db.passwordResetToken.delete({ where: { id: resetRecord.id } });

    // Revoke all active refresh tokens for security
    await db.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revokedAt: new Date() },
    });

    await logActivity(user.id, 'PASSWORD_RESET_COMPLETED', { email: user.email }, req);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
