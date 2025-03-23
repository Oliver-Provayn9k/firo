import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('auth')?.value;

  console.log('🔐 middleware:', pathname, '| auth:', auth);

  // ✅ Verejné cesty
  const publicPaths = [
    '/access',
    '/api/auth/access',
    '/api/auth/logout',
    '/api/protected/register',
    '/api/protected/login',
    '/_next',
    '/favicon.ico',
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // ❌ Zakáž starý /login
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  // ✅ Ak ide o verejnú cestu → pusti ďalej
  if (isPublic) {
    return NextResponse.next();
  }

  // ❌ Ak nie je prihlásený → presmeruj na /access
  if (!auth || auth !== 'true') {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  // ✅ Inak povoliť prístup
  return NextResponse.next();
}

export const config = {
  matcher: ['/(?!_next|favicon.ico).*'],
};

