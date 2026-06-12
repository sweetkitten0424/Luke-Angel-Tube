'use client';
import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface LikeButtonProps {
  videoId: string;
  initialLikes: string[];
}

export default function LikeButton({ videoId, initialLikes }: LikeButtonProps) {
  const { user } = useUser();
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (user?.sub) {
      setHasLiked(initialLikes.includes(user.sub));
    }
  }, [user, initialLikes]);

  const handleLikeToggle = async () => {
    if (!user) {
      window.location.href = '/api/auth/login';
      return;
    }

    // Optimistic UI Update
    setHasLiked(!hasLiked);
    setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/videos/${videoId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      // Sync state with actual server values
      setLikesCount(data.likesCount);
      setHasLiked(data.hasLiked);
    } catch {
      // Revert states on exception errors
      setHasLiked(hasLiked);
      setLikesCount((prev) => (hasLiked ? prev + 1 : prev - 1));
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition duration-150 ${
        hasLiked 
          ? 'bg-white text-zinc-950 hover:bg-zinc-200' 
          : 'bg-zinc-900 text-white hover:bg-zinc-800'
      }`}
    >
      <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
      <span>{likesCount}</span>
    </button>
  );
}
