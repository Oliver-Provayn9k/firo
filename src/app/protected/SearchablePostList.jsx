"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SearchablePostList({ initialPosts, initialTotalPages, initialPageSize = 10 }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages || 1);
  const pageSize = initialPageSize;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/protected/posts/list?q=${encodeURIComponent(query)}&page=${page}&limit=${pageSize}`);
        if (!res.ok) {
          console.error("Chyba pri načítaní článkov");
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Chyba pri fetch:", error);
      }
    }
    fetchPosts();
  }, [query, page, pageSize]);

  function handleSearchChange(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  function handlePrev() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function handleNext() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  function handleSelectPage(e) {
    const selectedPage = parseInt(e.target.value, 10);
    setPage(selectedPage);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Hľadať články..."
        value={query}
        onChange={handleSearchChange}
        className="
          w-full
          p-3
          mb-4
          bg-orange-500
          text-white
          text-center
          placeholder-white/70
          rounded-2xl
          focus:outline-none
          focus:ring-2
          focus:ring-orange-300
        "
      />

      <ul className="space-y-6 list-none">
        {posts.map((post) => {
          const snippet = post.body.substring(0, 100);
          return (
            <li key={post.id}>
              <div className="bg-orange-500 text-center rounded-2xl p-4">
                <Link
                  href={`/protected/post/${post.id}`}
                  className="block text-xl font-semibold text-white hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-2 text-white">{snippet}...</p>
              </div>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6 sm:flex-row sm:justify-center">
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="bg-orange-500 text-white px-4 py-2 rounded-2xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="bg-orange-500 text-white px-4 py-2 rounded-2xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Page</span>
            <select
              value={page}
              onChange={handleSelectPage}
              className="bg-orange-500 text-white px-2 py-1 rounded-2xl hover:bg-orange-600"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>of {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
}





