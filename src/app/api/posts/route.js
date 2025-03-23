import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const where = q
            ? {
                  OR: [
                      { title: { contains: q, mode: "insensitive" } },
                      { body: { contains: q, mode: "insensitive" } },
                  ],
              }
            : {};

        const [posts, count] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy: { id: "desc" },
                skip,
                take: limit,
            }),
            prisma.post.count({ where }),
        ]);

        return NextResponse.json({ posts, totalPages: Math.ceil(count / limit) });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching posts", error: error.message },
            { status: 500 }
        );
    }
}

