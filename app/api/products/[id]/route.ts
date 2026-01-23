import { NextRequest, NextResponse } from 'next/server';
import { readProducts, updateProduct, deleteProduct } from '@/lib/csvUtils';
import { del } from '@vercel/blob';

// Helper function to delete a blob image
async function deleteBlobImage(imageUrl: string): Promise<boolean> {
  // Only delete if it's a Vercel Blob URL or local upload
  if (!imageUrl) return false;
  
  try {
    if (imageUrl.includes('blob.vercel-storage.com')) {
      await del(imageUrl);
      return true;
    }
  } catch (error) {
    console.error('Error deleting blob image:', error);
  }
  return false;
}

// Delete multiple images
async function deleteImages(images: string[]): Promise<void> {
  for (const img of images) {
    await deleteBlobImage(img);
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
    const products = await readProducts();
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

    // Handle specifications array if provided
    if (body.specifications !== undefined) {
      body.specifications = Array.isArray(body.specifications) ? body.specifications : [];
    }
    
    // Track old images for cleanup
    const oldImages = currentProduct.images || [];
    const newImages = body.images || oldImages;
    
    // Update the product first
    const updatedProduct = await updateProduct(id, body);
    
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
    const products = await readProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Delete the product from database
    const success = await deleteProduct(id);
    
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
