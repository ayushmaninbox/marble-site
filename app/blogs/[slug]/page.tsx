import { Metadata } from 'next';
import { readBlogs } from '@/lib/blogUtils';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';
import { Blog } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogs = readBlogs();
  const blog = blogs.find((b: Blog) => b.slug === slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blogs = readBlogs();
  const blog = blogs.find((b: Blog) => b.slug === slug);
  
  if (!blog) {
    notFound();
  }
  
  return <BlogPostClient />;
}
