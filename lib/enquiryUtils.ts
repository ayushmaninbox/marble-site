import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Enquiry } from './types';

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'enquiries.csv');

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
    const headers = 'id,firstName,lastName,email,phone,productCategory,productName,quantity,message,createdAt\n';
    fs.writeFileSync(CSV_FILE_PATH, headers, 'utf-8');
  }
};

export const readEnquiries = (): Enquiry[] => {
  initializeCsvFile();
  
  try {
    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const parsed = Papa.parse<Enquiry>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    return parsed.data.map(row => ({
      ...row,
      quantity: parseInt(row.quantity as unknown as string) || 0,
    }));
  } catch (error) {
    console.error('Error reading enquiries CSV:', error);
    return [];
  }
};

export const writeEnquiries = (enquiries: Enquiry[]): void => {
  ensureDataDirectory();
  
  try {
    const csv = Papa.unparse(enquiries, {
      header: true,
      columns: ['id', 'firstName', 'lastName', 'email', 'phone', 'productCategory', 'productName', 'quantity', 'message', 'createdAt'],
    });
    fs.writeFileSync(CSV_FILE_PATH, csv, 'utf-8');
  } catch (error) {
    console.error('Error writing enquiries CSV:', error);
    throw error;
  }
};

export const addEnquiry = (enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Enquiry => {
  const enquiries = readEnquiries();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  enquiries.push(newEnquiry);
  writeEnquiries(enquiries);
  return newEnquiry;
};

export const deleteEnquiry = (id: string): boolean => {
  const enquiries = readEnquiries();
  const filteredEnquiries = enquiries.filter(e => e.id !== id);
  
  if (filteredEnquiries.length === enquiries.length) return false;
  
  writeEnquiries(filteredEnquiries);
  return true;
};
