import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';
import { uploadImage } from '@/utils/cloudinary';

// Force Node.js runtime (required for JWT and crypto)
export const runtime = 'nodejs';

// POST /api/upload - Upload image to Cloudinary (Admin only)
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'blog-images';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type - support all common image formats
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif', 
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/avif'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only image files are allowed (JPEG, PNG, WebP, GIF, SVG, BMP, TIFF, AVIF).' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, {
      folder,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
});

