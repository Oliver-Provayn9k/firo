'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = document.cookie.includes('auth=true');
    if (isAuth) {
      router.push('/protected');
    } else {
      router.push('/access');
    }
  }, [router]); // ✅ tu je oprava

  return null;
}

