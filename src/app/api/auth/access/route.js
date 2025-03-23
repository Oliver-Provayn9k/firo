import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();

  const isValid = password === process.env.ADMIN_PASSWORD;

  if (isValid) {
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.cookies.set('auth', 'true', {
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 deň
    });

    return response;
  }

  return new NextResponse(JSON.stringify({ success: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
