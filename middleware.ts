import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('auth')?.value;
  const userId = request.cookies.get('userId')?.value;

  console.log('🔐 middleware:', pathname, '| auth:', auth, '| userId:', userId);

  // ✅ Verejné cesty (ktoré nevyžadujú prihlásenie)
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

  // ✅ Verejná cesta = pusti ďalej
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔐 Chránené vnútorné route: /protected/**
  if (pathname.startsWith('/protected')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/access', request.url));
    }
    return NextResponse.next();
  }

  // 🔐 Všetko ostatné chráni cookie auth=true
  if (!auth || auth !== 'true') {
    return NextResponse.redirect(new URL('/access', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(?!_next|favicon.ico).*'], // všetko okrem statických súborov
};


