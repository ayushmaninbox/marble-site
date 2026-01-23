import { Metadata } from 'next';
import Link from 'next/link';
import { readProducts } from '@/lib/csvUtils';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const products = await readProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const ogImage = product.images && product.images.length > 0 ? product.images[0] : (product.image || '');

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: ogImage ? [ogImage] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const products = await readProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <Link href="/" className="text-red-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }
  
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
