import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const authCookie = request.cookies.get('auth')?.value;
  const userEmail = request.cookies.get('email')?.value;

  if (authCookie !== 'true' || !userEmail) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
