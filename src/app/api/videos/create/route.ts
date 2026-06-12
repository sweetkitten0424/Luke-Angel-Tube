import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import User from '@/src/models/User';
import Video from '@/src/models/Video';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const internalUser = await User.findOne({ auth0Id: session.user.sub });
  if (!internalUser) return NextResponse.json({ error: 'User Sync Missing' }, { status: 400 });

  const { title, description, videoUrl, thumbnailUrl } = await req.json();

  const newVideo = await Video.create({
    userId: internalUser._id,
    title,
    description,
    videoUrl,
    thumbnailUrl,
  });

  return NextResponse.json(newVideo);
}
