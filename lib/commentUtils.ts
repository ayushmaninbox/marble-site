import { sql } from './db';

export interface Comment {
  id: string;
  blogId: string;
  parentId: string | null;
  name: string;
  email: string;
  content: string;
  likes: number;
  createdAt: string;
}

export const readAllComments = async (): Promise<Comment[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM comments ORDER BY created_at ASC
    `;
    
    return rows.map(row => ({
      id: row.id,
      blogId: row.blog_id,
      parentId: row.parent_id,
      name: row.name,
      email: row.email,
      content: row.content,
      likes: row.likes || 0,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error reading comments:', error);
    return [];
  }
};

export const getCommentsByBlogId = async (blogId: string): Promise<Comment[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM comments WHERE blog_id = ${blogId} ORDER BY created_at ASC
    `;
    
    return rows.map(row => ({
      id: row.id,
      blogId: row.blog_id,
      parentId: row.parent_id,
      name: row.name,
      email: row.email,
      content: row.content,
      likes: row.likes || 0,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error getting comments by blog ID:', error);
    return [];
  }
};

export const addComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Comment> => {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  await sql`
    INSERT INTO comments (id, blog_id, parent_id, name, email, content, likes, created_at)
    VALUES (${id}, ${comment.blogId}, ${comment.parentId}, ${comment.name}, ${comment.email}, ${comment.content}, 0, ${createdAt})
  `;
  
  return {
    ...comment,
    id,
    likes: 0,
    createdAt,
  };
};

export const likeComment = async (commentId: string): Promise<Comment | null> => {
  try {
    const { rows } = await sql`
      UPDATE comments SET likes = likes + 1 WHERE id = ${commentId} RETURNING *
    `;
    
    if (rows.length === 0) return null;
    
    const row = rows[0];
    return {
      id: row.id,
      blogId: row.blog_id,
      parentId: row.parent_id,
      name: row.name,
      email: row.email,
      content: row.content,
      likes: row.likes,
      createdAt: row.created_at?.toISOString(),
    };
  } catch (error) {
    console.error('Error liking comment:', error);
    return null;
  }
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    // Get all descendant comment IDs (replies to replies, etc.)
    const idsToDelete = new Set<string>();
    idsToDelete.add(commentId);
    
    const allComments = await readAllComments();
    
    const findChildren = (parentId: string) => {
      allComments.forEach(c => {
        if (c.parentId === parentId) {
          idsToDelete.add(c.id);
          findChildren(c.id);
        }
      });
    };
    
    findChildren(commentId);
    
    // Delete all found comments
    let deleted = 0;
    for (const id of idsToDelete) {
      const result = await sql`DELETE FROM comments WHERE id = ${id}`;
      deleted += result.rowCount ?? 0;
    }
    
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
};
