import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Helper function to delete an uploaded file (image or video)
export async function deleteUploadedFile(filePath: string): Promise<boolean> {
  if (!filePath || !filePath.startsWith('/uploads/products/')) {
    return false;
  }
  
  try {
    const filename = path.basename(filePath);
    const absolutePath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);
    
    if (existsSync(absolutePath)) {
      await unlink(absolutePath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return false;
}

// Delete multiple files
export async function deleteFiles(filePaths: string[]): Promise<void> {
  for (const path of filePaths) {
    await deleteUploadedFile(path);
  }
}
