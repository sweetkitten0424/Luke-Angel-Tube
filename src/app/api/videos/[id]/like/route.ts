import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Video from '@/src/models/Video';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const video = await Video.findById(params.id);
  if (!video) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

  const userId = session.user.sub;
  const hasLiked = video.likes.includes(userId);

  if (hasLiked) {
    video.likes = video.likes.filter((id: string) => id !== userId);
  } else {
    video.likes.push(userId);
  }

  await video.save();
  return NextResponse.json({ likesCount: video.likes.length, hasLiked: !hasLiked });
}
