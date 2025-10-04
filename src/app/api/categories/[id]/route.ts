import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import BlogPost from '@/models/BlogPost';
import { requireAuth } from '@/utils/auth';

export const runtime = 'nodejs';

// GET /api/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: category,
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Get category error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update category (Admin only)
export const PUT = requireAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    
    const updateData = await request.json();
    const { name, slug, description } = updateData;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, slug, description },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: category,
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Update category error:', err);
    
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

// DELETE /api/categories/[id] - Delete category (Admin only)
export const DELETE = requireAuth(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    
    // Check if category has posts
    const postsCount = await BlogPost.countDocuments({ categories: params.id });
    
    if (postsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as any;
    console.error('Delete category error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});