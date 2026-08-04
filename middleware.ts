import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/'];

// Role-specific route prefixes
const adminRoutes = '/admin';
const supportRoutes = '/support';
const userRoutes = '/user-dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    // If user is already authenticated and tries to access login/signup, redirect to their dashboard
    if (token && (pathname === '/login' || pathname === '/signup')) {
      const session = verifyToken(token);
      if (session) {
        let redirectUrl = '/user-dashboard/dashboard';
        if (session.role === 'admin') {
          redirectUrl = '/admin/dashboard';
        } else if (session.role === 'support') {
          redirectUrl = '/support/dashboard';
        }
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect role-specific routes
  if (!token) {
    // No token found, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and check role
  const session = verifyToken(token);
  if (!session) {
    // Invalid or expired token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (pathname.startsWith(adminRoutes)) {
    if (session.role !== 'admin') {
      // User is not admin, redirect to appropriate dashboard
      let redirectUrl = '/user-dashboard/dashboard';
      if (session.role === 'support') {
        redirectUrl = '/support/dashboard';
      }
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  if (pathname.startsWith(supportRoutes)) {
    if (session.role !== 'admin' && session.role !== 'support') {
      // User is not support or admin, redirect to user dashboard
      return NextResponse.redirect(new URL('/user-dashboard/dashboard', request.url));
    }
  }

  if (pathname.startsWith(userRoutes)) {
    // All authenticated users can access user routes
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
