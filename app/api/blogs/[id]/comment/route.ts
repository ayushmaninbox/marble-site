import { NextRequest, NextResponse } from 'next/server';
import { findBlogById, addComment } from '@/lib/blogUtils';

// POST: Add comment to a blog post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, content } = body;

    // Validate required fields
    if (!name || !email || !content) {
      return NextResponse.json(
        { error: 'Name, email, and content are required' },
        { status: 400 }
      );
    }

    const blog = findBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updatedBlog = addComment(id, { name, email, content });

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Failed to add comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      comments: updatedBlog.comments,
      commentCount: updatedBlog.comments.length 
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
