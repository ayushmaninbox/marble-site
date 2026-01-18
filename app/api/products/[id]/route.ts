import { NextRequest, NextResponse } from 'next/server';
import { readProducts, updateProduct, deleteProduct } from '@/lib/csvUtils';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Helper function to delete an uploaded image
async function deleteUploadedImage(imagePath: string): Promise<boolean> {
  if (!imagePath || !imagePath.startsWith('/uploads/products/')) {
    return false;
  }
  
  try {
    const filename = path.basename(imagePath);
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
  return false;
}

// Delete multiple images
async function deleteImages(images: string[]): Promise<void> {
  for (const img of images) {
    await deleteUploadedImage(img);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Get the current product to check if images are being changed
    const products = readProducts();
    const currentProduct = products.find(p => p.id === id);
    
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate images array if provided
    if (body.images !== undefined) {
      const imageArray = Array.isArray(body.images) ? body.images : [body.images];
      if (imageArray.length === 0) {
        return NextResponse.json(
          { error: 'At least one image is required' },
          { status: 400 }
        );
      }
      if (imageArray.length > 7) {
        return NextResponse.json(
          { error: 'Maximum 7 images allowed' },
          { status: 400 }
        );
      }
      body.images = imageArray;
    }
    
    // Track old images for cleanup
    const oldImages = currentProduct.images || [];
    const newImages = body.images || oldImages;
    
    // Update the product first
    const updatedProduct = updateProduct(id, body);
    
    // Find and delete removed images
    const removedImages = oldImages.filter(img => !newImages.includes(img));
    await deleteImages(removedImages);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get the product to find its images before deleting
    const products = readProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Delete the product from CSV
    const success = deleteProduct(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }
    
    // Delete all associated images
    await deleteImages(product.images || []);
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

