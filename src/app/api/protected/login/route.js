import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = body;

    if (!email || !password || !recaptchaToken) {
      return NextResponse.json({ message: 'Missing credentials.' }, { status: 400 });
    }

    // ✅ Verify reCAPTCHA
    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: 'POST' }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json({ message: 'reCAPTCHA failed.' }, { status: 400 });
    }

    // ✅ Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // ✅ Check password (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // ✅ Create response and set cookie on it
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set('userId', user.id.toString(), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (error) {
    console.error('Error processing login:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

