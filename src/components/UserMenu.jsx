'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // ➕ Funkcia na aktualizáciu usera
  const updateUserFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  };

  useEffect(() => {
    updateUserFromStorage(); // pri načítaní

    const handleUserChanged = () => {
      updateUserFromStorage();
    };

    // ➕ Počúvame náš vlastný event
    window.addEventListener('userChanged', handleUserChanged);

    return () => {
      window.removeEventListener('userChanged', handleUserChanged);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/protected/logout', { method: 'POST' });
    localStorage.removeItem('user');
    setUser(null);
    router.push('/protected');
    window.dispatchEvent(new Event('userChanged')); // 👈 aktualizuj menu
  };

  if (pathname === '/access') return null;

  return (
    <div className="flex items-center gap-4">
      {!user ? (
        <>
          <button
            onClick={() => router.push('/protected/login')}
            className="rounded-3xl bg-orange-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-orange-600"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/protected/register')}
            className="rounded-3xl bg-orange-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-orange-600"
          >
            Register
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => router.push('/protected/profile')}
            className="text-white text-sm font-semibold hover:underline"
          >
            {user.name}
          </button>
          <button
            onClick={handleLogout}
            className="rounded-3xl bg-orange-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-orange-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );  
}















