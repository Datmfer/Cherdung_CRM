import { NextRequest, NextResponse } from 'next/server';
import { revokeRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('auth_token');

  return response;
}
