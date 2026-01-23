import { NextRequest, NextResponse } from 'next/server';
import { readBlogs, addBlog, generateSlug } from '@/lib/blogUtils';

// GET: List all blogs
export async function GET() {
  try {
    const blogs = await readBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST: Create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, author } = body;

    // Validate required fields
    if (!title || !excerpt || !content || !author) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and author are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);

    const newBlog = await addBlog({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || '',
      author,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
