import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Product } from './types';

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
    const headers = 'id,name,category,description,price,image,createdAt\n';
    fs.writeFileSync(CSV_FILE_PATH, headers, 'utf-8');
  }
};

export const readProducts = (): Product[] => {
  initializeCsvFile();

  try {
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const parsed = Papa.parse<Product>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    return parsed.data.map(row => ({
      ...row,
      price: parseFloat(row.price as unknown as string) || 0,
    }));
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
};

export const writeProducts = (products: Product[]): void => {
  ensureDataDirectory();

  try {
    const csv = Papa.unparse(products, {
      header: true,
      columns: ['id', 'name', 'category', 'description', 'price', 'image', 'createdAt'],
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
