import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyEdgeToken } from '@/lib/auth-edge';

const publicRoutes = ['/login', '/signup', '/reset-password', '/how-it-works', '/about-us', '/contact', '/investment-plans', '/'];

const adminRoutes = '/admin';
const supportRoutes = '/support';
const userRoutes = '/user-dashboard';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value || request.cookies.get('auth_token')?.value;

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (publicRoutes.some(route => pathname === route || (route !== '/' && pathname.startsWith(route)))) {
    if (accessToken && (pathname === '/login' || pathname === '/signup')) {
      const session = verifyEdgeToken(accessToken);
      if (session) {
        let redirectUrl = '/user-dashboard/dashboard';
        const role = session.role.toLowerCase();
        if (role === 'admin') {
          redirectUrl = '/admin/dashboard';
        } else if (role === 'support') {
          redirectUrl = '/support/dashboard';
        }
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
    return response;
  }

  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = verifyEdgeToken(accessToken);
  if (!session) {
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const role = session.role.toLowerCase();

  if (pathname.startsWith(adminRoutes)) {
    if (role !== 'admin') {
      let redirectUrl = '/user-dashboard/dashboard';
      if (role === 'support') {
        redirectUrl = '/support/dashboard';
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  if (pathname.startsWith(supportRoutes)) {
    if (role !== 'admin' && role !== 'support') {
      return NextResponse.redirect(new URL('/user-dashboard/dashboard', request.url));
    }
  }

  if (pathname.startsWith(userRoutes)) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|uploads).*)',
  ],
};
