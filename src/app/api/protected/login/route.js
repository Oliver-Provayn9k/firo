import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = body;

    // 🧪 Kontrola vstupov
    if (!email || !password || !recaptchaToken) {
      return NextResponse.json({ message: 'Missing credentials.' }, { status: 400 });
    }

    // ✅ Overenie reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
    const verifyRes = await fetch(verifyUrl, { method: 'POST' });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json({ message: 'reCAPTCHA failed.' }, { status: 400 });
    }

    // 🔍 Vyhľadanie používateľa podľa emailu
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // 🔐 Porovnanie hesla
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // 🍪 Nastavenie autentifikačného cookie
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.cookies.set('auth', 'true', {
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 deň
    });

    response.cookies.set('userId', String(user.id), {
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });
    

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }


  
}

