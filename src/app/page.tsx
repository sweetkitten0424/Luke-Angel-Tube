import { connectDB } from '@/src/lib/db';
import Video from '@/src/models/Video';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage({ searchParams }: { searchParams: { search?: string } }) {
  await connectDB();
  
  const queryFilter: any = {};
  if (searchParams.search) {
    queryFilter.title = { $regex: searchParams.search, $options: 'i' };
  }

  const videos = await Video.find(queryFilter).populate('userId', 'name picture').sort({ createdAt: -1 });

  return (
    <div>
      {videos.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <p className="text-lg font-semibold">No videos found matching your criteria.</p>
          <Link href="/" className="text-sm text-blue-500 hover:underline mt-2 inline-block">Reset search filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video: any) => (
            <Link href={`/watch/${video._id}`} key={video._id} className="group flex flex-col gap-2">
              <div className="aspect-video bg-zinc-800 rounded-xl overflow-hidden relative">
                <img src={video.thumbnailUrl} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-200" />
              </div>
              <div className="flex gap-3 px-1">
                <img src={video.userId?.picture} className="w-9 h-9 rounded-full bg-zinc-700" alt="Avatar" />
                <div>
                  <h3 className="font-semibold line-clamp-2 text-sm leading-tight">{video.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{video.userId?.name}</p>
                  <p className="text-xs text-zinc-400">{video.views.toLocaleString()} views</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
