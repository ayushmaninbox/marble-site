import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Blog, BlogComment } from './types';

const BLOGS_CSV_PATH = path.join(process.cwd(), 'data', 'blogs.csv');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

interface RawBlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  likes: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

const parseComments = (commentsStr: string): BlogComment[] => {
  if (!commentsStr) return [];
  try {
    return JSON.parse(commentsStr);
  } catch {
    return [];
  }
};

export const readBlogs = (): Blog[] => {
  ensureDataDirectory();
  
  if (!fs.existsSync(BLOGS_CSV_PATH)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(BLOGS_CSV_PATH, 'utf-8');
    const parsed = Papa.parse<RawBlogRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    return parsed.data.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      coverImage: row.coverImage,
      author: row.author,
      likes: parseInt(row.likes) || 0,
      comments: parseComments(row.comments),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  } catch (error) {
    console.error('Error reading blogs CSV:', error);
    return [];
  }
};

export const writeBlogs = (blogs: Blog[]): void => {
  ensureDataDirectory();

  try {
    const csvData = blogs.map(b => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: b.coverImage,
      author: b.author,
      likes: b.likes,
      comments: JSON.stringify(b.comments || []),
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      columns: ['id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 'author', 'likes', 'comments', 'createdAt', 'updatedAt'],
      quotes: true,
    });
    fs.writeFileSync(BLOGS_CSV_PATH, csv, 'utf-8');
  } catch (error) {
    console.error('Error writing blogs CSV:', error);
    throw error;
  }
};

export const findBlogById = (id: string): Blog | undefined => {
  const blogs = readBlogs();
  return blogs.find(b => b.id === id);
};

export const findBlogBySlug = (slug: string): Blog | undefined => {
  const blogs = readBlogs();
  return blogs.find(b => b.slug === slug);
};

export const addBlog = (data: Omit<Blog, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Blog => {
  const blogs = readBlogs();
  
  const newBlog: Blog = {
    id: crypto.randomUUID(),
    ...data,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  blogs.push(newBlog);
  writeBlogs(blogs);
  return newBlog;
};

export const updateBlog = (id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>): Blog | null => {
  const blogs = readBlogs();
  const index = blogs.findIndex(b => b.id === id);

  if (index === -1) return null;

  blogs[index] = { 
    ...blogs[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  writeBlogs(blogs);
  return blogs[index];
};

export const deleteBlog = (id: string): boolean => {
  const blogs = readBlogs();
  const filteredBlogs = blogs.filter(b => b.id !== id);

  if (filteredBlogs.length === blogs.length) return false;

  writeBlogs(filteredBlogs);
  return true;
};

export const likeBlog = (id: string): Blog | null => {
  const blogs = readBlogs();
  const index = blogs.findIndex(b => b.id === id);

  if (index === -1) return null;

  blogs[index].likes += 1;
  blogs[index].updatedAt = new Date().toISOString();
  writeBlogs(blogs);
  return blogs[index];
};

export const addComment = (blogId: string, comment: Omit<BlogComment, 'id' | 'createdAt'>): Blog | null => {
  const blogs = readBlogs();
  const index = blogs.findIndex(b => b.id === blogId);

  if (index === -1) return null;

  const newComment: BlogComment = {
    id: crypto.randomUUID(),
    ...comment,
    createdAt: new Date().toISOString(),
  };

  blogs[index].comments.push(newComment);
  blogs[index].updatedAt = new Date().toISOString();
  writeBlogs(blogs);
  return blogs[index];
};
