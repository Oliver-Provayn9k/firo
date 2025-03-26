import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies(); // 🛠 await je potrebné
  const authCookie = cookieStore.get('auth')?.value;
  const userId = cookieStore.get('userId')?.value;

  if (authCookie !== 'true' || !userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    where: { userId: parseInt(userId, 10) },
    orderBy: { id: 'desc' },
    select: {
      id: true,
      title: true,
    },
  });

  return NextResponse.json({ posts });
}


