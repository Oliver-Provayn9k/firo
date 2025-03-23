import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = body;

    // Validácia vstupov
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

    // Vyhľadanie používateľa
    console.log('EMAIL z formulára:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('Používateľ z databázy:', user);

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Porovnanie hesla
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // Nastavenie cookies pomocou serialize
    const authCookie = serialize('auth', 'true', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    const emailCookie = serialize('email', user.email, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': [authCookie, emailCookie],
        'Content-Type': 'application/json',
      },
    });

    return response;

  } catch (error) {
    console.error('Error processing login:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
