import { NextRequest, NextResponse } from 'next/server';
import { readProducts, addProduct } from '@/lib/csvUtils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    
    let products = readProducts();
    
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
    const { name, category, description, price, images } = body;
    
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
    
    const newProduct = addProduct({
      name,
      category,
      description,
      price: parseFloat(price),
      images: imageArray,
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
