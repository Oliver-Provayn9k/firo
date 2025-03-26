'use client';

import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function ClientOnlyWrapper() {
  const pathname = usePathname();

  // Skryť menu len na /access
  if (pathname === '/access') return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <UserMenu />
    </div>
  );
}





