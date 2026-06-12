import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Video from '@/src/models/Video';
import User from '@/src/models/User';

// DELETE /api/videos/[id]
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const video = await Video.findById(params.id).populate('userId');
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const dbUser = await User.findOne({ auth0Id: session.user.sub });
    const isOwner = video.userId.auth0Id === session.user.sub;
    const isAdmin = dbUser?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden access scope' }, { status: 403 });
    }

    await Video.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Video removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
