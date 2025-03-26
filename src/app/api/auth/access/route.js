import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { password } = await request.json();

  const isValid = password === process.env.ADMIN_PASSWORD;

  if (isValid) {
    const response = NextResponse.json({ success: true });

    // správne použitie cookies().set na odpoveď
    response.cookies.set('auth', 'true', {
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 deň
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}


