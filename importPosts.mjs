// Using import statements instead of require
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fetchApiPosts() {
    const response = await fetch('https://dummyjson.com/posts?limit=20');
    const data = await response.json();
    return data.posts;
}

async function updatePosts() {
    const apiPosts = await fetchApiPosts();
    for (const apiPost of apiPosts) {
        const dbPost = await prisma.post.findUnique({
            where: { id: apiPost.id }
        });

        if (dbPost && (
            dbPost.title !== apiPost.title ||
            dbPost.body !== apiPost.body ||
            dbPost.likes !== apiPost.likes ||
            dbPost.dislikes !== apiPost.dislikes ||
            dbPost.views !== apiPost.views ||
            dbPost.userId !== apiPost.userId
        )) {
            // Update record since it exists and has differences
            await prisma.post.update({
                where: { id: apiPost.id },
                data: {
                    title: apiPost.title,
                    body: apiPost.body,
                    likes: apiPost.likes,
                    dislikes: apiPost.dislikes,
                    views: apiPost.views,
                    userId: apiPost.userId
                }
            });
            console.log(`Updated post ID ${apiPost.id}`);
        }
    }
}

async function main() {
    try {
        await updatePosts();
        console.log("Posts have been successfully imported or updated.");
    } catch (error) {
        console.error("Error during post import:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

