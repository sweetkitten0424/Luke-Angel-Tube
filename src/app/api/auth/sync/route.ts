import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import User from '@/src/models/User';

export async function GET() {
  const session = await getSession();
  if (!session || !session.user) return NextResponse.redirect(new URL('/', process.env.AUTH0_BASE_URL));

  await connectDB();
  
  // Create user database document if it doesn't already exist
  await User.findOneAndUpdate(
    { auth0Id: session.user.sub },
    {
      auth0Id: session.user.sub,
      email: session.user.email,
      name: session.user.name,
      picture: session.user.picture,
    },
    { upsert: true, new: true }
  );

  return NextResponse.redirect(new URL('/', process.env.AUTH0_BASE_URL));
}
