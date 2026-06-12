import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import Subscription from '@/src/models/Subscription';

// GET /api/channels/[id]/subscribe - Check status
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) return NextResponse.json({ isSubscribed: false });

    await connectDB();
    const subExists = await Subscription.findOne({
      subscriberId: session.user.sub,
      channelId: params.id,
    });

    return NextResponse.json({ isSubscribed: !!subExists });
  } catch {
    return NextResponse.json({ isSubscribed: false });
  }
}

// POST /api/channels/[id]/subscribe - Toggle subscription
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const query = { subscriberId: session.user.sub, channelId: params.id };
    const existingSub = await Subscription.findOne(query);

    if (existingSub) {
      await Subscription.deleteOne(query);
      return NextResponse.json({ isSubscribed: false });
    } else {
      await Subscription.create(query);
      return NextResponse.json({ isSubscribed: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
