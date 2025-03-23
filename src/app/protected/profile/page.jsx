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
      const data = await res.json();
      setName(data.name);
      setUserId(data.id);
    }

    async function fetchMyPosts() {
      const res = await fetch('/api/protected/posts/mine');
      const data = await res.json();
      setPosts(data);
    }

    fetchProfile();
    fetchMyPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/protected/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        body,
        tags: tags.split(',').map(tag => tag.trim()), // rozdelenie tagov
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
    setPosts(prev => [...prev, data]); // pridá nový post lokálne
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-4">Hure, {name}</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4 mb-8">
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

        {message && <p className="text-center text-lg text-green-400">{message}</p>}

        <button
          type="submit"
          className="w-full p-3 bg-orange-600 text-white font-bold rounded text-lg"
        >
          Publish Article
        </button>
      </form>

      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-semibold mb-4">Your Articles</h2>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/protected/post/${post.id}`} className="text-orange-400 underline hover:text-orange-200">
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

