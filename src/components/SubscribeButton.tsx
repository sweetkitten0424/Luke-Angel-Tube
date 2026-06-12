'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface SubscribeButtonProps {
  channelId: string;
}

export default function SubscribeButton({ channelId }: SubscribeButtonProps) {
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/channels/${channelId}/subscribe`);
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [user, channelId]);

  const handleSubscribeToggle = async () => {
    if (!user) {
      window.location.href = '/api/auth/login';
      return;
    }

    // Optimistic UI Update
    setIsSubscribed(!isSubscribed);

    try {
      const res = await fetch(`/api/channels/${channelId}/subscribe`, { method: 'POST' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
    } catch {
      // Revert layout on failures
      setIsSubscribed(isSubscribed);
    }
  };

  if (loading) {
    return <div className="w-24 h-9 bg-zinc-800 animate-pulse rounded-full" />;
  }

  return (
    <button
      onClick={handleSubscribeToggle}
      className={`px-4 py-2 rounded-full font-medium text-sm transition duration-150 ${
        isSubscribed
          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
          : 'bg-red-600 text-white hover:bg-red-700'
      }`}
    >
      {isSubscribed ? 'Subscribed' : 'Subscribe'}
    </button>
  );
}
