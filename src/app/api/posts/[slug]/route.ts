import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';
import { requireAuth } from '@/utils/auth';
import { calculateSEOScore } from '@/utils/seo';

export const runtime = 'nodejs';

// GET /api/posts/[slug] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    // Ensure the User model is registered before populate calls
    User;
    
    const post = await BlogPost.findOne({ slug: params.slug, status: 'published' })
      .populate('author', 'name avatar bio socialLinks')
      .populate('categories', 'name slug description')
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count (fire and forget)
    BlogPost.findByIdAndUpdate((post as any)._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Get post error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Update post (Admin only)
export const PUT = requireAuth(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    await connectDB();
    
    const user = (request as any).user;
    const updateData = await request.json();
    
    // Find the post
    const existingPost = await BlogPost.findOne({ slug: params.slug });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (existingPost.author.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this post' },
        { status: 403 }
      );
    }

    // Calculate SEO score if content changed
    if (updateData.title || updateData.content || updateData.metaDescription) {
      updateData.seoScore = calculateSEOScore({
        ...existingPost.toObject(),
        ...updateData,
      });
    }

    // Handle trending logic
    if (updateData.trending && updateData.trending.isTrending) {
      updateData.trending.trendingAt = new Date();
    } else if (updateData.trending) {
      updateData.trending.trendingAt = undefined;
    }

    const post = await BlogPost.findOneAndUpdate(
      { slug: params.slug },
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar bio')
     .populate('categories', 'name slug');

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Update post error:', err);
    
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// DELETE /api/posts/[slug] - Delete post (Admin only)
export const DELETE = requireAuth(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    await connectDB();
    
    const user = (request as any).user;
    
    // Find the post
    const post = await BlogPost.findOne({ slug: params.slug });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author or admin
    if (post.author.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      );
    }

    await BlogPost.findByIdAndDelete(post._id);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Delete post error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});