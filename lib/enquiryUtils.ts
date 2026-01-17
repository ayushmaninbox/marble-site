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
    const headers = 'id,firstName,lastName,email,phone,productCategory,productName,quantity,message,createdAt,status\n';
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
      status: (row.status === 'solved' ? 'solved' : 'pending') as 'pending' | 'solved',
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
      columns: ['id', 'firstName', 'lastName', 'email', 'phone', 'productCategory', 'productName', 'quantity', 'message', 'createdAt', 'status'],
    });
    fs.writeFileSync(CSV_FILE_PATH, csv, 'utf-8');
  } catch (error) {
    console.error('Error writing enquiries CSV:', error);
    throw error;
  }
};

export const addEnquiry = (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry => {
  const enquiries = readEnquiries();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
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

export const updateEnquiryStatus = (id: string, status: 'pending' | 'solved'): boolean => {
  const enquiries = readEnquiries();
  const enquiryIndex = enquiries.findIndex(e => e.id === id);

  if (enquiryIndex === -1) return false;

  enquiries[enquiryIndex].status = status;
  writeEnquiries(enquiries);
  return true;
};

export const updateEnquiriesStatus = (ids: string[], status: 'pending' | 'solved'): number => {
  const enquiries = readEnquiries();
  let updatedCount = 0;

  enquiries.forEach(enquiry => {
    if (ids.includes(enquiry.id)) {
      enquiry.status = status;
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    writeEnquiries(enquiries);
  }
  return updatedCount;
};

export const deleteEnquiries = (ids: string[]): number => {
  const enquiries = readEnquiries();
  const initialLength = enquiries.length;

  const filteredEnquiries = enquiries.filter(e => !ids.includes(e.id));

  if (filteredEnquiries.length === initialLength) return 0;

  writeEnquiries(filteredEnquiries);
  return initialLength - filteredEnquiries.length;
};
