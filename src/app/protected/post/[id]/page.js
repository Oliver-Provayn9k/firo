import PostDetailClient from "./PostDetailClient"; // Opravený import
import prisma from "@/lib/prisma";

export default async function PostDetailPage({ params }) {
  const resolvedParams = await params; // 🛠 awaitujeme params
  const postId = parseInt(resolvedParams.id, 10); // Konverzia na číslo

  if (isNaN(postId)) {
    return <div className="text-center text-xl text-gray-300">Post not found</div>;
  }

  try {
    // Načítanie článku a jeho autora
    const post = await prisma.post.findUnique({
      where: { id: postId }, // Prisma očakáva Int
      include: {
        user: {
          select: {
            name: true,
          },
        },
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

