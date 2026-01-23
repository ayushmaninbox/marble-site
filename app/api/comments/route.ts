import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByBlogId, addComment, readAllComments, likeComment, deleteComment } from '@/lib/commentUtils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      const comments = await readAllComments();
      // Sort by Newest
      comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json(comments);
    }

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const comments = await getCommentsByBlogId(blogId);
    // Sort by Newest
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogId, name, email, content, parentId } = body;

    if (!blogId || !name || !email || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const comment = await addComment({
      blogId,
      name, 
      email,
      content,
      parentId: parentId || null
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type } = body;

    if (type === 'like') {
      const updated = await likeComment(id);
      if (updated) return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const success = await deleteComment(id);
    if (success) return NextResponse.json({ success: true });
    
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
