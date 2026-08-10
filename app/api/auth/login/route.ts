import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createAuthTokens } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import * as OTPAuth from 'otpauth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email, password, totpCode } = validation.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check 2FA requirement if enabled
    if (user.totpEnabled) {
      if (!totpCode) {
        return NextResponse.json(
          { error: '2FA token required', requires2FA: true },
          { status: 403 }
        );
      }

      if (!user.totpSecret) {
        return NextResponse.json(
          { error: '2FA setup error' },
          { status: 500 }
        );
      }

      const totp = new OTPAuth.TOTP({
        issuer: 'Cherdung CRM',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(user.totpSecret),
      });

      const delta = totp.validate({ token: totpCode, window: 1 });
      if (delta === null) {
        return NextResponse.json(
          { error: 'Invalid 2FA code', requires2FA: true },
          { status: 401 }
        );
      }
    }

    // Create auth tokens
    const { accessToken, refreshToken, user: userPayload } = await createAuthTokens(user.id);

    // Log activity
    await logActivity(user.id, 'USER_LOGIN', { email: user.email }, req);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
        role: userPayload.role.toLowerCase(),
        avatarUrl: userPayload.avatarUrl,
        emailVerified: userPayload.emailVerified,
      },
      token: accessToken,
    });

    // Set HTTP-only cookies
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 mins
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Legacy cookie for backward compatibility
    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
