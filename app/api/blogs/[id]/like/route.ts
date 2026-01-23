import { NextRequest, NextResponse } from 'next/server';
import { findBlogById, likeBlog } from '@/lib/blogUtils';

// POST: Like a blog post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await findBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updatedBlog = await likeBlog(id);

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Failed to like blog' },
        { status: 500 }
      );
    }

    return NextResponse.json({ likes: updatedBlog.likes });
  } catch (error) {
    console.error('Error liking blog:', error);
    return NextResponse.json(
      { error: 'Failed to like blog' },
      { status: 500 }
    );
  }
}
