import { connectDB } from '@/src/lib/db';
import Video from '@/src/models/Video';
import Comment from '@/src/models/Comment';
import LikeButton from '@/src/components/LikeButton';
import SubscribeButton from '@/src/components/SubscribeButton';
import CommentSection from '@/src/components/CommentSection';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Force dynamic server rendering for real-time view updates

export default async function WatchPage({ params }: { params: { id: string } }) {
  await connectDB();
  
  // 1. Fetch current video details and populate creator data
  const video = await Video.findById(params.id).populate('userId', 'name picture auth0Id');
  if (!video) notFound();

  // 2. Increment video view counts natively in MongoDB on layout load
  video.views += 1;
  await video.save();

  // 3. Parallel fetch comments and right-side context recommendations
  const [comments, suggestions] = await Promise.all([
    Comment.find({ videoId: video._id }).sort({ createdAt: -1 }),
    Video.find({ _id: { $ne: video._id } }).limit(8).populate('userId', 'name')
  ]);

  // Safe deep-copy transformation of database objects into plain JSON for Client Components
  const serializedComments = JSON.parse(JSON.stringify(comments));
  const serializedLikes = JSON.parse(JSON.stringify(video.likes || []));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* LEFT COLUMN: Main Media Player, Metadata, and Communications */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Dynamic Video Streaming Node */}
        <video 
          src={video.videoUrl} 
          controls 
          autoPlay 
          className="w-full aspect-video rounded-xl bg-black border border-zinc-900 shadow-lg" 
        />
        
        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight line-clamp-2">{video.title}</h1>
        
        {/* Interaction Bar (Creator Info, Subscribe, and Like Mechanisms) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src={video.userId?.picture || 'https://unsplash.com'} 
              className="w-10 h-10 rounded-full object-cover bg-zinc-800" 
              alt={video.userId?.name || 'Channel'} 
            />
            <div className="flex flex-col mr-2">
              <p className="font-bold text-sm text-zinc-100">{video.userId?.name || 'Anonymous Creator'}</p>
              <p className="text-xs text-zinc-400">Creator Channel</p>
            </div>
            {/* Interactive Subscription Component */}
            {video.userId?._id && (
              <SubscribeButton channelId={video.userId._id.toString()} />
            )}
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Interactive Like Component */}
            <LikeButton videoId={video._id.toString()} initialLikes={serializedLikes} />
          </div>
        </div>
        
        {/* Expandable Content Description Block */}
        <div className="bg-zinc-900 hover:bg-zinc-900/80 transition p-4 rounded-xl text-sm border border-zinc-800">
          <div className="flex gap-3 font-semibold text-zinc-200 mb-2">
            <span>{video.views.toLocaleString()} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <p className="text-zinc-300 whitespace-pre-line leading-relaxed break-words">
            {video.description || 'No description provided.'}
          </p>
        </div>
        
        {/* Interactive Comment Module */}
        <CommentSection videoId={video._id.toString()} initialComments={serializedComments} />
      </div>

      {/* RIGHT COLUMN: Contextual Sidebar Recommendations */}
      <div className="flex flex-col gap-4 lg:border-l lg:border-zinc-900 lg:pl-6">
        <h2 className="font-bold text-sm text-zinc-400 tracking-wider uppercase">Up Next</h2>
        
        {suggestions.length === 0 ? (
          <p className="text-xs text-zinc-500 italic mt-2">No recommended videos found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {suggestions.map((suggestion: any) => (
              <Link href={`/watch/${suggestion._id}`} key={suggestion._id} className="flex gap-3 group">
                {/* Micro Thumbnail Canvas */}
                <div className="w-40 aspect-video bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-800 relative">
                  <img 
                    src={suggestion.thumbnailUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200" 
                    alt="" 
                  />
                </div>
                {/* Meta Summary Texts */}
                <div className="flex flex-col gap-1 min-w-0">
                  <h4 className="text-sm font-semibold line-clamp-2 leading-tight text-zinc-100 group-hover:text-red-400 transition duration-150 break-words">
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{suggestion.userId?.name}</p>
                  <p className="text-[11px] text-zinc-500">{suggestion.views.toLocaleString()} views</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
