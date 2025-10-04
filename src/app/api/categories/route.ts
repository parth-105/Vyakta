import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAuth } from '@/utils/auth';
import { generateSlug } from '@/utils/seo';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// GET /api/categories - Public endpoint for fetching categories
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeEmpty = searchParams.get('includeEmpty') === 'true';

    const query = includeEmpty ? {} : { postCount: { $gt: 0 } };

    const categories = await Category.find(query)
      .sort({ postCount: -1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
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

    const categoryData = await request.json();

    // Validate required fields
    const { name } = categoryData;
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = generateSlug(name);
    }

    const category = new Category(categoryData);
    await category.save();

    return NextResponse.json({
      success: true,
      category: category,
    }, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
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

