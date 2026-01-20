import { NextRequest, NextResponse } from 'next/server';
import { findBlogById, updateBlog, deleteBlog, generateSlug } from '@/lib/blogUtils';

// GET: Get single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = findBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT: Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const blog = findBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (body.title) {
      updates.title = body.title;
      updates.slug = generateSlug(body.title);
    }
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
    if (body.content !== undefined) updates.content = body.content;
    if (body.coverImage !== undefined) updates.coverImage = body.coverImage;
    if (body.author !== undefined) updates.author = body.author;

    const updatedBlog = updateBlog(id, updates);

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE: Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = findBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const success = deleteBlog(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete blog' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
