import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import User from '@/src/models/User';
import Video from '@/src/models/Video';
import Comment from '@/src/models/Comment';

export const revalidate = 0; // Prevent Next.js from caching engine results staticly

export async function GET() {
  try {
    // Phase 1: Test Connectivity Core
    await connectDB();
    
    // Phase 2: Query Sample Records from Database State
    const sampleUserCount = await User.countDocuments();
    const latestVideosWithCreators = await Video.find()
      .populate('userId', 'name email role')
      .limit(2)
      .sort({ createdAt: -1 });

    const totalCommentsMapped = await Comment.countDocuments();

    // Return System Integrity Diagnosis Report
    return NextResponse.json({
      status: 'operational',
      databaseState: 'connected',
      telemetry: {
        totalRegisteredUsers: sampleUserCount,
        totalVideosIndexed: latestVideosWithCreators.length,
        totalCommentsStored: totalCommentsMapped
      },
      diagnosticsDataSamples: {
        videosSamplePayload: latestVideosWithCreators
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'degraded',
      error: error.message || 'An unhandled Mongoose query engine pipeline exception occured.'
    }, { status: 500 });
  }
}
