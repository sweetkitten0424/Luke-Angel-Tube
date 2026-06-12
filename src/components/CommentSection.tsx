'use client';
import { useState, startTransition } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface CommentSectionProps {
  videoId: string;
  initialComments: any[];
}

export default function CommentSection({ videoId, initialComments }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;

    const optimisticComment = {
      _id: Math.random().toString(),
      name: user.name || 'Anonymous',
      picture: user.picture || '',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    // Update UI elements instantly
    setComments((prev) => [optimisticComment, ...prev]);
    const commentText = text;
    setText('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, text: commentText }),
      });

      if (!res.ok) throw new Error();
      const realComment = await res.json();

      // Swap out the transient temporary element for the real database index item
      setComments((prev) => prev.map((c) => (c._id === optimisticComment._id ? realComment : c)));
    } catch {
      alert('Failed to post comment. Please try again.');
      setComments((prev) => prev.filter((c) => c._id !== optimisticComment._id));
      setText(commentText);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">{comments.length} Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6 items-start">
          <img src={user.picture || ''} className="w-9 h-9 rounded-full bg-zinc-800" alt="" />
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-700 focus:border-white focus:outline-none py-1 text-sm"
            />
            {text.trim() && (
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setText('')} className="px-3 py-1.5 hover:bg-zinc-800 rounded-full font-medium">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-full font-medium text-black">Comment</button>
              </div>
            )}
          </div>
        </form>
      ) : (
        <p className="text-zinc-500 text-sm mb-6">Log in to post a comment.</p>
      )}

      <div className="flex flex-col gap-5">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3 text-sm animate-fadeIn">
            <img src={comment.picture} className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0" alt="" />
            <div>
              <p className="font-semibold text-zinc-300 text-xs">{comment.name}</p>
              <p className="text-zinc-100 mt-1 whitespace-pre-wrap">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
