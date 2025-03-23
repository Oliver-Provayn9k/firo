import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const authCookie = request.cookies.get('auth')?.value;
    const userEmail = request.cookies.get('email')?.value;

    if (authCookie !== 'true' || !userEmail) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { title, body, tags } = await request.json();

    const newPost = await prisma.post.create({
      data: {
        title,
        body,
        tags: Array.isArray(tags) ? tags : [tags],
        likes: 0,
        dislikes: 0,
        views: 0,
        userId: user.id,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
