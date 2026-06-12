'use client';
import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '../api/uploadthing/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function StudioPage() {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState('');

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await fetch('/api/videos/create', {
      method: 'POST',
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        thumbnailUrl: formData.get('thumbnailUrl'),
        videoUrl: videoUrl,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    router.push('/');
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h1 className="text-xl font-bold mb-6">Upload Video Content</h1>
      {!videoUrl ? (
        <div className="border-2 border-dashed border-zinc-700 p-8 rounded-xl flex flex-col items-center">
          <UploadButton<OurFileRouter, "videoUploader">
            endpoint="videoUploader"
            onClientUploadComplete={(res) => {
              setVideoUrl(res[0].url);
              alert("Video Upload Completed Successfully!");
            }}
          />
        </div>
      ) : (
        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <input type="text" name="title" placeholder="Title" required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm" />
          <textarea name="description" placeholder="Description" rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm" />
          <input type="text" name="thumbnailUrl" placeholder="Thumbnail Image URL" required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm" />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition">Publish Video</button>
        </form>
      )}
    </div>
  );
}
