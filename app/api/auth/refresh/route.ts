import { NextRequest, NextResponse } from 'next/server';
import { rotateRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const { accessToken, refreshToken: newRefreshToken, user } = await rotateRefreshToken(refreshToken);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        avatarUrl: user.avatarUrl,
        emailVerified: user.emailVerified,
      },
      token: accessToken,
    });

    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    response.cookies.set('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    // Clear cookies if refresh fails
    const response = NextResponse.json(
      { error: error.message || 'Token refresh failed' },
      { status: 401 }
    );
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('auth_token');
    return response;
  }
}
