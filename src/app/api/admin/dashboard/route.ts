import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import { requireAuth } from '@/utils/auth';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// GET /api/admin/dashboard - Get dashboard statistics (Admin only)
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    // Get statistics
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      recentPosts,
      totalViews
    ] = await Promise.all([
      BlogPost.countDocuments(),
      BlogPost.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'draft' }),
      Category.countDocuments(),
      BlogPost.find()
        .populate('author', 'name')
        .populate('categories', 'name')
        .select('title slug status publishedAt views')
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean(),
      BlogPost.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ])
    ]);

    const stats = {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalViews: totalViews[0]?.total || 0,
      recentPosts,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

