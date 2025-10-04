import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAuth } from '@/utils/auth';
import { generateSlug } from '@/utils/seo';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// PUT /api/categories/[id] - Update category (Admin only)
export const PUT = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();

    const categoryData = await request.json();
    const { id } = params;

    // Validate required fields
    const { name } = categoryData;
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided or if name changed
    if (!categoryData.slug) {
      categoryData.slug = generateSlug(name);
    }

    const category = await Category.findByIdAndUpdate(
      id,
      categoryData,
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
  } catch (error) {
    console.error('Update category error:', error);
    
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

// DELETE /api/categories/[id] - Delete category (Admin only)
export const DELETE = requireAuth(async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();

    const { id } = params;

    const category = await Category.findByIdAndDelete(id);

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
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
