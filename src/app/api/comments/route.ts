import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Comment from '@/src/models/Comment';

// GET /api/comments?videoId=...
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/comments
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { videoId, text } = await req.json();

    if (!videoId || !text.trim()) {
      return NextResponse.json({ error: 'Invalid payload data' }, { status: 400 });
    }

    const newComment = await Comment.create({
      videoId,
      auth0Id: session.user.sub,
      name: session.user.name,
      picture: session.user.picture,
      text: text.trim(),
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
