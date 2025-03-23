import prisma from "@/lib/prisma";
import PostDetailClient from "./PostDetailClient";

export default async function PostDetailPage({ params }) {
  const id = parseInt(params?.id, 10);

  if (!id) {
    return <div className="text-center text-xl text-gray-300">Post not found</div>;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
      },
    });

    if (!post) {
      return <div className="text-center text-xl text-gray-300">Post not found</div>;
    }

    return <PostDetailClient post={post} />;
  } catch (error) {
    console.error("Error loading post details:", error);
    return <div className="text-center text-xl text-gray-300">Error loading post details.</div>;
  }
}

