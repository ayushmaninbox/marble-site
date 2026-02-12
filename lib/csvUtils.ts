import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Product, ProductSpecification } from './types';

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'products.csv');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize CSV file with headers if it doesn't exist
const initializeCsvFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(CSV_FILE_PATH)) {
    const headers = 'id,name,category,description,price,images,video,specifications,inStock,isFeatured,displayOrder,createdAt\n';
    fs.writeFileSync(CSV_FILE_PATH, headers, 'utf-8');
  }
};

// Parse images from CSV (handles JSON array or legacy single image)
const parseImages = (imagesValue: string | undefined, legacyImage?: string): string[] => {
  if (imagesValue) {
    try {
      const parsed = JSON.parse(imagesValue);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If not valid JSON, treat as single image
      if (imagesValue.trim()) return [imagesValue.trim()];
    }
  }
  // Fallback to legacy image field
  if (legacyImage && legacyImage.trim()) {
    return [legacyImage.trim()];
  }
  return [];
};

// Parse specifications from CSV (handles JSON array)
const parseSpecifications = (specsValue: string | undefined): ProductSpecification[] => {
  if (specsValue) {
    try {
      const parsed = JSON.parse(specsValue);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If not valid JSON, return empty array
    }
  }
  return [];
};

interface RawProductRow {
  id: string;
  name: string;
  category: 'Marbles' | 'Tiles' | 'Handicraft' | 'Granite';
  description: string;
  price: string;
  images?: string;
  video?: string;
  image?: string; // Legacy field
  specifications?: string;
  inStock?: string; // 'true' or 'false' - defaults to 'true' for backwards compatibility
  isFeatured?: string; // 'true' or 'false'
  displayOrder?: string; // Display order for frontend
  createdAt: string;
}

export const readProducts = (): Product[] => {
  initializeCsvFile();

  try {
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const parsed = Papa.parse<RawProductRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    return parsed.data.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      price: parseFloat(row.price) || 0,
      images: parseImages(row.images, row.image),
      video: row.video,
      specifications: parseSpecifications(row.specifications),
      inStock: row.inStock !== 'false', // Default to true for backwards compatibility
      isFeatured: row.isFeatured === 'true',
      displayOrder: row.displayOrder ? parseInt(row.displayOrder) : undefined,
      createdAt: row.createdAt,
    }));
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
};

export const writeProducts = (products: Product[]): void => {
  ensureDataDirectory();

  try {
    // Convert products to CSV format with images and specifications as JSON strings
    const csvData = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      images: JSON.stringify(p.images || []),
      video: p.video || '',
      specifications: JSON.stringify(p.specifications || []),
      inStock: p.inStock !== false ? 'true' : 'false',
      isFeatured: p.isFeatured ? 'true' : 'false',
      displayOrder: p.displayOrder !== undefined ? p.displayOrder.toString() : '',
      createdAt: p.createdAt,
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      columns: ['id', 'name', 'category', 'description', 'price', 'images', 'video', 'specifications', 'inStock', 'isFeatured', 'displayOrder', 'createdAt'],
      quotes: true,
    });
    fs.writeFileSync(CSV_FILE_PATH, csv, 'utf-8');
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = readProducts();
  const newProduct: Product = {
    ...product,
    images: product.images || [],
    inStock: product.inStock !== false,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  writeProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  writeProducts(products);
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = readProducts();
  const filteredProducts = products.filter(p => p.id !== id);

  if (filteredProducts.length === products.length) return false;

  writeProducts(filteredProducts);
  return true;
};

export const reorderProducts = (productId: string, newIndex: number): boolean => {
  const products = readProducts();
  const currentIndex = products.findIndex(p => p.id === productId);

  if (currentIndex === -1 || newIndex < 0 || newIndex >= products.length) {
    return false;
  }

  // Remove product from current position
  const [movedProduct] = products.splice(currentIndex, 1);
  
  // Insert at new position
  products.splice(newIndex, 0, movedProduct);

  // Update displayOrder for all products
  products.forEach((product, index) => {
    product.displayOrder = index;
  });

  writeProducts(products);
  return true;
};

