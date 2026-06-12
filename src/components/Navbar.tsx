'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Menu, Video, User } from 'lucide-react';
import { useSidebarStore } from '@/src/lib/store';
import SearchField from './SearchField';
import Link from 'next/link';

export default function Navbar() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const { user } = useUser();

  return (
    <nav className="h-14 bg-zinc-900 px-4 flex items-center justify-between sticky top-0 z-50 border-b border-zinc-800">
      <div className="flex items-center gap-4 flex-shrink-0">
        <button onClick={toggleSidebar} className="p-2 hover:bg-zinc-800 rounded-full">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="font-bold text-xl tracking-tighter text-red-500">ViewTube</Link>
      </div>

      {/* Embedded Client-Side Search Mechanism */}
      <SearchField />

      <div className="flex items-center gap-3 flex-shrink-0">
        {user ? (
          <>
            <Link href="/studio" className="p-2 hover:bg-zinc-800 rounded-full"><Video className="w-5 h-5" /></Link>
            <img src={user.picture || ''} className="w-8 h-8 rounded-full" alt="Profile" />
            <a href="/api/auth/logout" className="text-sm text-zinc-400 hover:text-white">Logout</a>
          </>
        ) : (
          <a href="/api/auth/login" className="flex items-center gap-2 border border-blue-500 text-blue-500 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-500/10">
            <User className="w-4 h-4" /> Sign In
          </a>
        )}
      </div>
    </nav>
  );
}
