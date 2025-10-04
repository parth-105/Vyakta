import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { requireAuth } from '@/utils/auth';
import { calculateSEOScore, generateSlug } from '@/utils/seo';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// GET /api/posts/[slug] - Public endpoint for fetching single post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const { slug } = params;

    const post = await BlogPost.findOne({ slug, status: 'published' })
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
    BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get post error:', error);
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

    const { slug } = params;
    const updateData = await request.json();

    // Generate slug if title changed and no slug provided
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Calculate SEO score if content changed
    if (updateData.title || updateData.content || updateData.metaDescription) {
      updateData.seoScore = calculateSEOScore(updateData);
    }

    const post = await BlogPost.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'name avatar bio')
      .populate('categories', 'name slug');

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Update post error:', error);
    
    if (error.code === 11000) {
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

    const { slug } = params;

    const post = await BlogPost.findOneAndDelete({ slug });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

