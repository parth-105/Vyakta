import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import User from '@/models/User';
import { requireAuth } from '@/utils/auth';
import { calculateSEOScore, generateSlug } from '@/utils/seo';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// GET /api/posts - Public endpoint for fetching published posts
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = { status: 'published' };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.categories = categoryDoc._id;
      }
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortQuery: any = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { publishedAt: -1 };
        break;
    }

    // Execute query
    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .populate('author', 'name avatar bio')
        .populate('categories', 'name slug')
        .select('-content') // Exclude full content for listing
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Get posts error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new post (Admin only)
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    const user = (request as any).user;
    const postData = await request.json();
    // Validate required fields
    const { title, content, metaDescription } = postData;
    if (!title || !content || !metaDescription) {
      return NextResponse.json(
        { error: 'Title, content, and meta description are required' },
        { status: 400 }
      );
    }
    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = generateSlug(title);
    }
    // Calculate SEO score
    const seoScore = calculateSEOScore(postData);
    // Trending logic
    if (postData.trending && postData.trending.isTrending) {
      postData.trending.trendingAt = new Date();
    } else if (postData.trending) {
      postData.trending.trendingAt = undefined;
    }
    // Create post
    const post = new BlogPost({
      ...postData,
      author: user.userId,
      seoScore,
    });
    await post.save();
    // Populate author and categories
    await post.populate('author', 'name avatar bio');
    await post.populate('categories', 'name slug');
    return NextResponse.json({
      success: true,
      data: post,
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Create post error:', err);
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