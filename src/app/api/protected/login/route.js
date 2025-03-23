import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = body;

    // Kontrola vstupov
    if (!email || !password || !recaptchaToken) {
      return NextResponse.json({ message: 'Missing credentials.' }, { status: 400 });
    }

    // Overenie reCAPTCHA
    console.log('Verifying reCAPTCHA...');
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
    const verifyRes = await fetch(verifyUrl, { method: 'POST' });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.log('reCAPTCHA failed:', verifyData);
      return NextResponse.json({ message: 'reCAPTCHA failed.' }, { status: 400 });
    }

    // Vyhladanie pouzivatela podla emailu
    console.log('Finding user by email...');
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Porovnanie hesla
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Nastavenie autentifikacneho cookie
    console.log('Setting authentication cookies...');

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 den
    });

    response.cookies.set('userId', String(user.id), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}