import { sql } from './db';
import { Blog, BlogComment } from './types';

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const readBlogs = async (): Promise<Blog[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM blogs ORDER BY created_at DESC
    `;
    
    const blogs: Blog[] = [];
    
    for (const row of rows) {
      // Get comments for this blog
      const commentsResult = await sql`
        SELECT id, name, email, content, created_at FROM comments WHERE blog_id = ${row.id} ORDER BY created_at ASC
      `;
      
      const comments: BlogComment[] = commentsResult.rows.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        content: c.content,
        createdAt: c.created_at?.toISOString() || new Date().toISOString(),
      }));
      
      blogs.push({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt || '',
        content: row.content || '',
        coverImage: row.cover_image || '',
        author: row.author,
        likes: row.likes || 0,
        comments,
        createdAt: row.created_at?.toISOString() || new Date().toISOString(),
        updatedAt: row.updated_at?.toISOString() || new Date().toISOString(),
      });
    }
    
    return blogs;
  } catch (error) {
    console.error('Error reading blogs:', error);
    return [];
  }
};

export const findBlogById = async (id: string): Promise<Blog | undefined> => {
  const blogs = await readBlogs();
  return blogs.find(b => b.id === id);
};

export const findBlogBySlug = async (slug: string): Promise<Blog | undefined> => {
  const blogs = await readBlogs();
  return blogs.find(b => b.slug === slug);
};

export const addBlog = async (data: Omit<Blog, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  await sql`
    INSERT INTO blogs (id, title, slug, excerpt, content, cover_image, author, likes, created_at, updated_at)
    VALUES (${id}, ${data.title}, ${data.slug}, ${data.excerpt}, ${data.content}, ${data.coverImage}, ${data.author}, 0, ${now}, ${now})
  `;
  
  return {
    id,
    ...data,
    likes: 0,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
};

export const updateBlog = async (id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>): Promise<Blog | null> => {
  try {
    const existing = await sql`SELECT * FROM blogs WHERE id = ${id}`;
    if (existing.rows.length === 0) return null;
    
    const current = existing.rows[0];
    const now = new Date().toISOString();
    
    await sql`
      UPDATE blogs SET
        title = ${updates.title ?? current.title},
        slug = ${updates.slug ?? current.slug},
        excerpt = ${updates.excerpt ?? current.excerpt},
        content = ${updates.content ?? current.content},
        cover_image = ${updates.coverImage ?? current.cover_image},
        author = ${updates.author ?? current.author},
        likes = ${updates.likes ?? current.likes},
        updated_at = ${now}
      WHERE id = ${id}
    `;
    
    return await findBlogById(id) || null;
  } catch (error) {
    console.error('Error updating blog:', error);
    return null;
  }
};

export const deleteBlog = async (id: string): Promise<boolean> => {
  try {
    const result = await sql`DELETE FROM blogs WHERE id = ${id}`;
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting blog:', error);
    return false;
  }
};

export const likeBlog = async (id: string): Promise<Blog | null> => {
  try {
    await sql`UPDATE blogs SET likes = likes + 1, updated_at = ${new Date().toISOString()} WHERE id = ${id}`;
    return await findBlogById(id) || null;
  } catch (error) {
    console.error('Error liking blog:', error);
    return null;
  }
};

// Legacy function - use commentUtils directly for new code
export const addComment = async (blogId: string, comment: Omit<BlogComment, 'id' | 'createdAt'>): Promise<Blog | null> => {
  const { addComment: addCommentUtil } = await import('./commentUtils');
  await addCommentUtil({
    blogId,
    name: comment.name,
    email: comment.email,
    content: comment.content,
    parentId: null,
  });
  return await findBlogById(blogId) || null;
};
