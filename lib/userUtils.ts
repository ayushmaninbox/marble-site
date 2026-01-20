import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import bcrypt from 'bcryptjs';
import { AdminUser, AdminRole } from './types';

const USERS_CSV_PATH = path.join(process.cwd(), 'data', 'users.csv');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize users CSV with headers and default super admin
const initializeUsersFile = async () => {
  ensureDataDirectory();
  if (!fs.existsSync(USERS_CSV_PATH)) {
    // Create default super admin with hashed password
    const passwordHash = await bcrypt.hash('password', 10);
    const defaultAdmin: AdminUser = {
      id: crypto.randomUUID(),
      name: 'Super Admin',
      email: 'admin@shreeradhemarble.com',
      passwordHash,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
    };
    
    const csv = Papa.unparse([defaultAdmin], {
      header: true,
      columns: ['id', 'name', 'email', 'passwordHash', 'role', 'createdAt', 'lastLogin'],
      quotes: true,
    });
    fs.writeFileSync(USERS_CSV_PATH, csv, 'utf-8');
  }
};

interface RawUserRow {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export const readUsers = (): AdminUser[] => {
  ensureDataDirectory();
  
  if (!fs.existsSync(USERS_CSV_PATH)) {
    return [];
  }

  try {
    const fileContent = fs.readFileSync(USERS_CSV_PATH, 'utf-8');
    const parsed = Papa.parse<RawUserRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    return parsed.data.map(row => ({
      id: row.id,
      name: row.name || '',
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role,
      createdAt: row.createdAt,
      lastLogin: row.lastLogin || undefined,
    }));
  } catch (error) {
    console.error('Error reading users CSV:', error);
    return [];
  }
};

export const writeUsers = (users: AdminUser[]): void => {
  ensureDataDirectory();

  try {
    const csv = Papa.unparse(users, {
      header: true,
      columns: ['id', 'name', 'email', 'passwordHash', 'role', 'createdAt', 'lastLogin'],
      quotes: true,
    });
    fs.writeFileSync(USERS_CSV_PATH, csv, 'utf-8');
  } catch (error) {
    console.error('Error writing users CSV:', error);
    throw error;
  }
};

export const findUserByEmail = (email: string): AdminUser | undefined => {
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): AdminUser | undefined => {
  const users = readUsers();
  return users.find(u => u.id === id);
};

export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const createUser = async (name: string, email: string, password: string, role: AdminRole): Promise<AdminUser> => {
  const users = readUsers();
  
  // Check if email already exists
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('A user with this email already exists');
  }

  const passwordHash = await hashPassword(password);
  const newUser: AdminUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): AdminUser | null => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  writeUsers(users);
  return users[index];
};

export const updateLastLogin = (id: string): void => {
  updateUser(id, { lastLogin: new Date().toISOString() });
};

export const deleteUser = (id: string): boolean => {
  const users = readUsers();
  const filteredUsers = users.filter(u => u.id !== id);

  if (filteredUsers.length === users.length) return false;

  writeUsers(filteredUsers);
  return true;
};

export const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
  const passwordHash = await hashPassword(newPassword);
  const result = updateUser(id, { passwordHash });
  return result !== null;
};

// Initialize on first import
initializeUsersFile();
