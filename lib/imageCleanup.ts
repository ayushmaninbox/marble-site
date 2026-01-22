import fs from 'fs';
import path from 'path';

export const extractImageUrls = (htmlContent: string): string[] => {
  if (!htmlContent) return [];
  const regex = /<img[^>]+src="([^">]+)"/g;
  const matches = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    if (match[1] && match[1].startsWith('/uploads/')) {
        matches.push(match[1]);
    }
  }
  return matches;
};

export const deleteImageFiles = (imageUrls: string[]) => {
  const publicDir = path.join(process.cwd(), 'public');
  
  imageUrls.forEach(url => {
    // Basic security check to prevent directory traversal
    const safeUrl = path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(publicDir, safeUrl);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted unused image: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete image ${filePath}:`, err);
      }
    }
  });
};
