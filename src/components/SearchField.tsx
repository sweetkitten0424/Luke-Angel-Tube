'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      router.push('/');
    } else {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-[600px] mx-4 items-center group relative">
      <div className="flex flex-1 items-center bg-zinc-950 border border-zinc-700 rounded-l-full px-4 h-9 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none pr-2"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(''); router.push('/'); }} className="text-zinc-400 hover:text-white mr-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button type="submit" className="bg-zinc-800 border-y border-r border-zinc-700 hover:bg-zinc-700 text-zinc-200 px-6 h-9 rounded-r-full flex items-center justify-center transition">
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
