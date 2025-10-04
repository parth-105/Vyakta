import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import { requireAuth } from '@/utils/auth';

export const runtime = 'nodejs';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const includeEmpty = searchParams.get('includeEmpty') === 'true';
    
    let categories;
    
    if (includeEmpty) {
      // Get all categories, including those with no posts
      categories = await Category.find({}).sort({ name: 1 });
    } else {
      // Get categories with post counts
      categories = await Category.aggregate([
        {
          $lookup: {
            from: 'blogposts',
            localField: '_id',
            foreignField: 'categories',
            as: 'posts'
          }
        },
        {
          $addFields: {
            postCount: { $size: '$posts' }
          }
        },
        {
          $match: {
            postCount: { $gt: 0 }
          }
        },
        {
          $sort: { name: 1 }
        }
      ]);
    }

    return NextResponse.json({
      success: true,
      categories: categories,
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Get categories error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (Admin only)
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const { name, slug, description } = await request.json();

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = new Category({
      name,
      slug,
      description,
    });

    await category.save();

    return NextResponse.json({
      success: true,
      category: category,
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Create category error:', err);
    
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: 'A category with this name or slug already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});