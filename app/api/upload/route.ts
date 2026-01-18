import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      );
    }

    // Get file extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const filename = `product-${timestamp}-${randomSuffix}.${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL path
    const publicPath = `/uploads/products/${filename}`;
    
    return NextResponse.json({ 
      success: true,
      path: publicPath,
      filename: filename
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove uploaded images
export async function DELETE(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: 'No image path provided' },
        { status: 400 }
      );
    }

    // Validate that the path is within the uploads directory (security check)
    if (!imagePath.startsWith('/uploads/products/')) {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 400 }
      );
    }

    // Extract filename and construct full path
    const filename = path.basename(imagePath);
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);

    // Check if file exists before attempting to delete
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Image file not found' },
        { status: 404 }
      );
    }

    // Delete the file
    await unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
