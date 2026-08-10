import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { resetPasswordRequestSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = resetPasswordRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email address', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const normalizedEmail = email.toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success even if user not found to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Delete existing reset tokens for this email
    await db.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    });

    // Create new reset token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expiresAt,
      },
    });

    // Send email
    await sendPasswordResetEmail(normalizedEmail, token);
    await logActivity(user.id, 'PASSWORD_RESET_REQUESTED', { email: user.email }, req);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error: any) {
    console.error('Request reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
