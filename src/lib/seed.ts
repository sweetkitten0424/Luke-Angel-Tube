import mongoose from 'mongoose';
import { connectDB } from './db';
import User from '../models/User';
import Video from '../models/Video';
import Comment from '../models/Comment';

async function seedDatabase() {
  await connectDB();
  console.log('✨ Connected to MongoDB Atlas Cluster...');

  // 1. Wipe current collections clean
  await User.deleteMany({});
  await Video.deleteMany({});
  await Comment.deleteMany({});

  // 2. Create Mock Admin and Creator Accounts
  const adminUser = await User.create({
    auth0Id: 'google-oauth2|111111111111111111111',
    email: 'admin@viewtube.com',
    name: 'Alex Admin',
    picture: 'https://unsplash.com',
    role: 'admin'
  });

  const creatorUser = await User.create({
    auth0Id: 'google-oauth2|222222222222222222222',
    email: 'creator@viewtube.com',
    name: 'Sarah Studios',
    picture: 'https://unsplash.com',
    role: 'user'
  });

  console.log('👥 Mock Users Seeded Successfully.');

  // 3. Create Sample Video Content Linked to the Creator Account
  const video1 = await Video.create({
    userId: creatorUser._id,
    title: 'Building a Next.js App from Scratch 🚀',
    description: 'A deep-dive tutorial explaining layout routers, server actions, and middleware optimizations in modern framework projects.',
    videoUrl: 'https://googleapis.com',
    thumbnailUrl: 'https://unsplash.com',
    views: 1420,
    likes: [adminUser.auth0Id]
  });

  const video2 = await Video.create({
    userId: creatorUser._id,
    title: 'Advanced MongoDB Aggregation Mechanics Explained',
    description: 'Learn how to optimize compound queries, indexing pipelines, and multi-stage joins across database structures with sub-millisecond latencies.',
    videoUrl: 'https://googleapis.com',
    thumbnailUrl: 'https://unsplash.com',
    views: 89,
    likes: []
  });

  console.log('🎥 Mock Video Database Inventories Configured.');

  // 4. Seed Interactive Comments
  await Comment.create({
    videoId: video1._id,
    auth0Id: adminUser.auth0Id,
    name: adminUser.name,
    picture: adminUser.picture,
    text: 'Incredible pacing! Could you record a separate video talking about connection pool configurations next week?'
  });

  console.log('💬 Conversation Logs Seeded.');
  await mongoose.connection.close();
  console.log('🏁 Seeding finished. Database connection terminated cleanly.');
}

seedDatabase().catch((err) => {
  console.error('💥 Critical database seeding failure encountered:', err);
  process.exit(1);
});
