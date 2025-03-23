'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function PostDetailClient({ post }) {
  const [likes, setLikes] = useState(post?.likes || 0);
  const [dislikes, setDislikes] = useState(post?.dislikes || 0);
  const [views, setViews] = useState(post?.views || 0);
  const [selectedReaction, setSelectedReaction] = useState(null);

  useEffect(() => {
    if (!post?.id) return;

    const viewed = localStorage.getItem(`viewed-${post.id}`);
    if (!viewed) {
      localStorage.setItem(`viewed-${post.id}`, 'true');
      setViews((prev) => prev + 1);
      fetch(`/api/posts/${post.id}/view`, { method: 'POST' });
    }

    const storedReaction = localStorage.getItem(`reaction-${post.id}`);
    if (storedReaction === 'like') setSelectedReaction('like');
    if (storedReaction === 'dislike') setSelectedReaction('dislike');
  }, [post?.id]);

  async function handleReaction(newReaction) {
    if (selectedReaction === newReaction) return;

    let newLikes = likes;
    let newDislikes = dislikes;

    if (selectedReaction === null) {
      if (newReaction === 'like') newLikes++;
      else newDislikes++;
    } else {
      if (selectedReaction === 'like') newLikes--;
      else newDislikes--;
      if (newReaction === 'like') newLikes++;
      else newDislikes++;
    }

    setLikes(newLikes);
    setDislikes(newDislikes);
    setSelectedReaction(newReaction);
    localStorage.setItem(`reaction-${post.id}`, newReaction);

    try {
      await fetch(`/api/posts/${post.id}/${newReaction}`, { method: 'POST' });
    } catch (err) {
      console.error('Nepodarilo sa odoslať reakciu:', err);
    }
  }

  let tags = [];
  try {
    tags = Array.isArray(post?.tags) ? post.tags : JSON.parse(post?.tags || '[]');
  } catch (e) {
    console.error('Chyba pri parsovaní tags:', e);
    tags = [];
  }

  if (!post) {
    return <div className="text-center text-white">Post not found</div>;
  }

  return (
    <main className="bg-black text-worange-500 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
        <p className="text-lg text-white">{post.body}</p>

        <div className="mt-4 text-left text-orange-500">
          <p><strong>Author:</strong> {post.user?.name ?? 'Unknown'}</p>
          <p><strong>Views:</strong> {views}</p>

          <div className="flex flex-col space-y-2 mt-2">
            <button
              onClick={() => handleReaction('like')}
              className={`flex items-center space-x-1 ${selectedReaction === 'like' ? 'text-blue-500' : 'text-orange-500'}`}
              disabled={selectedReaction !== null}
            >
              <FaThumbsUp />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => handleReaction('dislike')}
              className={`flex items-center space-x-1 ${selectedReaction === 'dislike' ? 'text-red-500' : 'text-orange-500'}`}
              disabled={selectedReaction !== null}
            >
              <FaThumbsDown />
              <span>{dislikes}</span>
            </button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-orange-500">Tags:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-orange-500 px-3 py-1 rounded-md text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link href="/" className="inline-block bg-orange-500 text-white px-4 py-2 rounded-2xl hover:bg-orange-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}








