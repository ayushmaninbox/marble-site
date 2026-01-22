import fs from 'fs';
import path from 'path';

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

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

const ensureCommentsFile = () => {
    const dir = path.dirname(COMMENTS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(COMMENTS_FILE)) {
        fs.writeFileSync(COMMENTS_FILE, '[]', 'utf-8');
    }
};

export const readAllComments = (): Comment[] => {
    ensureCommentsFile();
    try {
        const data = fs.readFileSync(COMMENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading comments:', error);
        return [];
    }
};

export const getCommentsByBlogId = (blogId: string): Comment[] => {
    const comments = readAllComments();
    return comments.filter(c => c.blogId === blogId);
};

export const addComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Comment => {
    const comments = readAllComments();
    const newComment: Comment = {
        ...comment,
        id: crypto.randomUUID(),
        likes: 0,
        createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    return newComment;
};

export const likeComment = (commentId: string): Comment | null => {
    const comments = readAllComments();
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return null;
    
    comments[index].likes += 1;
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    return comments[index];
};

export const deleteComment = (commentId: string): boolean => {
    let comments = readAllComments();
    const initialLength = comments.length;
    
    // Recursive deletion of replies? Or just delete the specific one?
    // Let's delete the specific one and any children.
    const idsToDelete = new Set<string>();
    const findChildren = (parentId: string) => {
        comments.forEach(c => {
            if (c.parentId === parentId) {
                idsToDelete.add(c.id);
                findChildren(c.id);
            }
        });
    };
    
    idsToDelete.add(commentId);
    findChildren(commentId);
    
    comments = comments.filter(c => !idsToDelete.has(c.id));
    
    if (comments.length === initialLength) return false;
    
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    return true;
};
