import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export const runtime = 'nodejs';

// GET /api/posts/trending - Trending posts in last 24h
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const now = new Date();
    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const posts = await BlogPost.find({
      status: 'published',
      'trending.isTrending': true,
      'trending.trendingAt': { $gte: since },
    })
      .populate('author', 'name avatar bio')
      .populate('categories', 'name slug')
      .sort({ 'trending.trendingAt': -1 })
      .lean();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Get trending posts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
