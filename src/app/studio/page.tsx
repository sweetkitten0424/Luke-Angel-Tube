'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function StudioPage() {
  const router = useRouter();
  const [nasFiles, setNasFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [publishing, setPublishing] = useState(false);
  
  // Thumbnail Capture States
  const [selectedFile, setSelectedFile] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [capturing, setCapturing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function loadAvailableVideos() {
      try {
        const res = await fetch('/api/nas-files');
        const data = await res.json();
        if (data.files && data.files.length > 0) {
          setNasFiles(data.files);
          setSelectedFile(data.files[0]);
        }
      } catch (err) {
        console.error('Error loading NAS files:', err);
      } finally {
        setLoadingFiles(false);
      }
    }
    loadAvailableVideos();
  }, []);

  // 🛠️ The Core Random Thumbnail Engine Function
  const generateRandomThumbnail = () => {
    if (!selectedFile) return;
    setCapturing(true);

    const baseUrl = process.env.NEXT_PUBLIC_APACHE_MEDIA_URL;
    const fullVideoUrl = `${baseUrl}/${selectedFile}`;

    // Create a transient, off-screen HTML5 Video Node
    const video = document.createElement('video');
    video.src = fullVideoUrl;
    video.crossOrigin = 'anonymous'; // Prevents cross-origin canvas security errors
    video.preload = 'auto';

    video.onloadedmetadata = () => {
      // Pick a random spot between 5% and 85% of the video to avoid black intros/outros
      const minPoint = video.duration * 0.05;
      const maxPoint = video.duration * 0.85;
      const randomTimestamp = Math.random() * (maxPoint - minPoint) + minPoint;
      
      video.currentTime = randomTimestamp;
    };

    video.onseeked = () => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set matching resolution targets (16:9 Aspect Ratio)
        canvas.width = 640;
        canvas.height = 360;

        // Paint the current video frame onto the canvas sheet matrix
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Export the raw visual matrix data as a compressed JPEG string
        const base64Image = canvas.toDataURL('image/jpeg', 0.85);
        setThumbnailUrl(base64Image);
      } catch (error) {
        console.error('Canvas capture failed. Check CORS configuration settings:', error);
        alert('CORS Error: Please verify your NAS Apache .htaccess settings allow origin requests.');
      } finally {
        setCapturing(false);
        // Clean up memory structures explicitly
        video.src = '';
        video.load();
      }
    };

    video.onerror = () => {
      alert('Failed to stream chosen video source path file from your server.');
      setCapturing(false);
    };
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!thumbnailUrl) {
      alert('Please generate a snapshot thumbnail before publishing.');
      return;
    }
    setPublishing(true);
    
    const formData = new FormData(e.currentTarget);
    const baseUrl = process.env.NEXT_PUBLIC_APACHE_MEDIA_URL;
    const finalVideoUrl = `${baseUrl}/${selectedFile}`;

    try {
      const res = await fetch('/api/videos/create', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          thumbnailUrl: thumbnailUrl, // Stores the compact Base64 image directly inside MongoDB
          videoUrl: finalVideoUrl, 
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Database layout submission error');
      
      alert("Success! Your video is live on Vercel with a custom thumbnail image.");
      router.push('/');
    } catch (err) {
      alert("Error saving metadata settings to your MongoDB cluster.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h1 className="text-xl font-bold mb-1">NAS Smart Publishing Hub</h1>
      <p className="text-xs text-zinc-400 mb-6">Select files from nas418.lusd1.org and generate thumbnails on the fly.</p>
      
      {/* Hidden processing canvas canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <form onSubmit={handlePublish} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Choose Video File</label>
          {loadingFiles ? (
            <div className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-500 animate-pulse">
              Scanning your NAS folder for videos...
            </div>
          ) : (
            <select 
              name="filename" 
              value={selectedFile}
              onChange={(e) => { setSelectedFile(e.target.value); setThumbnailUrl(''); }}
              required 
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm font-mono text-zinc-200 focus:outline-none"
            >
              {nasFiles.map((file) => (
                <option key={file} value={file}>{file}</option>
              ))}
            </select>
          )}
        </div>

        {/* Thumbnail Snapshot Render Card Preview Section */}
        <div>
          <label className="text-xs text-zinc-400 block mb-1.5">Video Thumbnail Asset</label>
          <div className="w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative flex flex-col items-center justify-center group">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Snapshot Preview" />
            ) : (
              <p className="text-xs text-zinc-500 italic">No image generated yet</p>
            )}
            
            {/* Overlay trigger control */}
            {selectedFile && (
              <button
                type="button"
                disabled={capturing}
                onClick={generateRandomThumbnail}
                className="absolute bg-black/80 hover:bg-black text-white text-xs border border-zinc-700 font-medium px-4 py-2 rounded-full shadow-xl transition disabled:opacity-50"
              >
                {capturing ? 'Scanning Frame Matrix...' : thumbnailUrl ? 'Roll Different Frame 🎲' : 'Generate Random Thumbnail 🎲'}
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1">Video Display Title</label>
          <input type="text" name="title" placeholder="e.g. My Favorite NAS Travel Vlog" required className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm" />
        </div>

        <div>
          <label className="text-xs text-zinc-400 block mb-1">Description</label>
          <textarea name="description" placeholder="Write a description..." rows={4} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-sm" />
        </div>

        <button 
          type="submit" 
          disabled={publishing || capturing || !thumbnailUrl}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 disabled:opacity-50"
        >
          {publishing ? 'Publishing Link...' : 'Publish Video Live'}
        </button>
      </form>
    </div>
  );
}
