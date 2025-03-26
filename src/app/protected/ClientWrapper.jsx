'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchablePostList from './SearchablePostList';

export default function ClientWrapper({ posts, totalPages }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = čakáme

  useEffect(() => {
    const isAuth = document.cookie.includes('auth=true');
    if (!isAuth) {
      router.push('/access');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return null; // alebo spinner
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    document.cookie = 'auth=; Max-Age=0; path=/;';
    router.push('/access');
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Blog</h1>

        <button
          onClick={logout}
          className="mb-6 bg-red-500 text-white px-4 py-2 rounded"
        >
          Exit project
        </button>

        <SearchablePostList
          initialPosts={posts}
          initialTotalPages={totalPages}
          initialPageSize={10}
        />
      </div>
    </main>
  );
}
