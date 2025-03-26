import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies(); // ❌ žiadne await
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    select: { id: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}


