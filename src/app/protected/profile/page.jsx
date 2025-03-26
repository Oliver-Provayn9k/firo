// 👇 na začiatok
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch('/api/protected/me');
      if (!res.ok) {
        router.push('/protected/login');
        return;
      }
      const data = await res.json();
      setName(data.name);
      setUserId(data.id);
    }

    async function fetchMyPosts() {
      const res = await fetch('/api/protected/posts/mine');
      const data = await res.json();
      // 👇 ak `tags` je JSON string, rozparsujeme
      const postsWithParsedTags = (data.posts || []).map(post => ({
        ...post,
        tags: safeParseJSON(post.tags),
      }));
      setPosts(postsWithParsedTags);
    }

    fetchProfile();
    fetchMyPosts();
  }, [router]);

  const safeParseJSON = (json) => {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const res = await fetch('/api/protected/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          tags: tagsArray,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Failed to create post.');
        return;
      }

      setMessage('Post created successfully!');
      setTitle('');
      setBody('');
      setTags('');

      setPosts(prev => [
        {
          ...data,
          tags: safeParseJSON(data.tags),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('Unexpected error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hi, {name}</h1>
        <button
          onClick={() => router.push('/protected')}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
        >
          Blog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4 mb-10">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-orange-500 text-white text-lg"
          required
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-3 rounded bg-orange-500 text-white text-lg"
          rows={5}
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 rounded bg-orange-500 text-white text-lg"
          required
        />

        {message && <p className="text-center text-green-400">{message}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-orange-600 text-white font-bold rounded text-lg"
        >
          Publish Article
        </button>
      </form>

      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
        <ul className="space-y-4">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id} className="bg-gray-900 p-4 rounded-lg">
                <a
                  href={`/protected/post/${post.id}`}
                  className="text-orange-400 underline hover:text-orange-200 text-xl"
                >
                  {post.title}
                </a>
                {post.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-orange-700 text-white px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">No posts yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}


