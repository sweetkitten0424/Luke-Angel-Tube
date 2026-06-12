'use client';
import { useSidebarStore } from '@/src/lib/store';
import { Home, Compass, FolderHeart, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <div className="flex flex-1">
      <aside className={`${isOpen ? 'w-64 px-3' : 'w-0 overflow-hidden'} bg-zinc-950 transition-all duration-200 pt-4 flex flex-col gap-1 border-r border-zinc-900`}>
        <Link href="/" className="flex items-center gap-5 p-3 hover:bg-zinc-900 rounded-xl"><Home className="w-5 h-5" /> Home</Link>
        <Link href="/subscriptions" className="flex items-center gap-5 p-3 hover:bg-zinc-900 rounded-xl"><FolderHeart className="w-5 h-5" /> Subscriptions</Link>
        <Link href="/studio" className="flex items-center gap-5 p-3 hover:bg-zinc-900 rounded-xl"><Compass className="w-5 h-5" /> Studio</Link>
        <Link href="/admin" className="flex items-center gap-5 p-3 hover:bg-zinc-900 rounded-xl text-red-400"><ShieldCheck className="w-5 h-5" /> Admin</Link>
      </aside>
      <main className="flex-1 p-6 bg-zinc-950">{children}</main>
    </div>
  );
}
