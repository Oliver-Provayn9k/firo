import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: content, tags } = body;

    if (!title || !content || !tags) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : tags;

    const newPost = await prisma.post.create({
      data: {
        title,
        body: content,
        tags: tagsJson,
        likes: 0,
        dislikes: 0,
        views: 0,
        userId: parseInt(userId, 10), // nezabudni parseInt
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

