import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { id } = req.query;

  try {
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: { likes: { increment: 1 } },
    });

    res.status(200).json({ message: "Liked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
