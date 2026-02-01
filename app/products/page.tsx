import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Our Collection',
  description: 'Explore our curated selection of premium marbles, granites, and handcrafted stones. Each piece is selected for its unique character and timeless beauty.',
  keywords: ['marble collection', 'granite varieties', 'tiles catalog', 'stone handicrafts'],
};

export default function ProductsPage() {
  return <ProductsClient />;
}
