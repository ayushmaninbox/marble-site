import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Our Collection',
  description: 'Explore our curated selection of premium marbles, granites, and handcrafted stones. Each piece is selected for its unique character and timeless beauty.',
  keywords: ['marble collection', 'granite varieties', 'tiles catalog', 'stone handicrafts'],
  openGraph: {
    title: "Our Collection | Shree Radhe Marble & Granite",
    description: "Browse Agartala's finest selection of marbles and granites.",
    images: ["/Assets/logo_new.png"],
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
