import { Metadata } from 'next';
import BlogsClient from './BlogsClient';

export const metadata: Metadata = {
  title: 'Insights & Inspiration',
  description: 'Explore expert tips, trends, and guides to help you create stunning spaces with premium marble and tiles.',
  keywords: ['marble trends', 'tile design guides', 'stone care tips', 'interior design inspiration'],
};

export default function BlogsPage() {
  return <BlogsClient />;
}
