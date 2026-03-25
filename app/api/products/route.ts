import { NextRequest, NextResponse } from 'next/server';
import { deleteProducts, readProducts, addProduct, reorderProducts } from '@/lib/csvUtils';
import { Product } from '@/lib/types';
import { deleteFiles } from '@/lib/fileUtils';

// Simple in-memory cache
let cachedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

function getCachedProducts() {
  const now = Date.now();
  if (cachedProducts && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedProducts;
  }
  cachedProducts = readProducts();
  lastFetchTime = now;
  return cachedProducts;
}

function invalidateCache() {
  cachedProducts = null;
  lastFetchTime = 0;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let products = getCachedProducts();
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, price, images, video, specifications, inStock } = body;
    
    if (!name || !category || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate images array
    const imageArray = Array.isArray(images) ? images : (images ? [images] : []);
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

    // Validate specifications array if provided
    const specsArray = Array.isArray(specifications) ? specifications : [];
    
    const newProduct = addProduct({
      name,
      category,
      description,
      price: parseFloat(price),
      images: imageArray,
      video: video || undefined,
      specifications: specsArray,
      inStock: inStock !== false,
    });

    invalidateCache();
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, newIndex } = body;

    if (!productId || newIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing productId or newIndex' },
        { status: 400 }
      );
    }

    const success = reorderProducts(productId, newIndex);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to reorder products' },
        { status: 400 }
      );
    }

    invalidateCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering products:', error);
    return NextResponse.json(
      { error: 'Failed to reorder products' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids' },
        { status: 400 }
      );
    }

    const deletedProducts = deleteProducts(ids);
    
    // Cleanup files for all deleted products
    const allFilesToDelete: string[] = [];
    deletedProducts.forEach(p => {
      if (p.images) allFilesToDelete.push(...p.images);
      if (p.video) allFilesToDelete.push(p.video);
    });
    
    if (allFilesToDelete.length > 0) {
      await deleteFiles(allFilesToDelete);
    }

    invalidateCache();

    return NextResponse.json({ 
      message: `${deletedProducts.length} products deleted successfully`,
      deletedCount: deletedProducts.length
    });
  } catch (error) {
    console.error('Error in bulk delete products:', error);
    return NextResponse.json(
      { error: 'Failed to delete products' },
      { status: 500 }
    );
  }
}
