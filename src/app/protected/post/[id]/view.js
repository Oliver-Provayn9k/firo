import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { id } = params;

  try {
    await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ message: "View counted" });
  } catch (error) {
    return NextResponse.json({ error: "Error updating views" }, { status: 500 });
  }
}
