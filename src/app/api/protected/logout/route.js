import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  const expired = {
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Minulý dátum => zmazanie
  };

  response.cookies.set('userId', '', expired);
  response.cookies.set('auth', '', expired);
  response.cookies.set('email', '', expired);

  return response;
}
