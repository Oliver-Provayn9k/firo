import prisma from './prisma';
import type { NextRequest } from 'next/server';

export async function getUserFromCookie(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  return user;
}
