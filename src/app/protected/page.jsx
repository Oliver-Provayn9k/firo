import prisma from '@/lib/prisma';
import ClientWrapper from './ClientWrapper';

export default async function ProtectedPage() {
  // Server-side fetch
  const posts = await prisma.post.findMany({
    orderBy: { id: 'desc' },
    take: 10,
  });

  const count = await prisma.post.count();
  const totalPages = Math.ceil(count / 10);

  return (
    <ClientWrapper posts={posts} totalPages={totalPages} />
  );
}



