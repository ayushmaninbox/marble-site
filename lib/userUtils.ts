import { sql } from './db';
import bcrypt from 'bcryptjs';
import { AdminUser, AdminRole } from './types';

export const readUsers = async (): Promise<AdminUser[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM users ORDER BY created_at DESC
    `;
    
    return rows.map(row => ({
      id: row.id,
      name: row.name || '',
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as AdminRole,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
      lastLogin: row.last_login?.toISOString(),
    }));
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

export const findUserByEmail = async (email: string): Promise<AdminUser | undefined> => {
  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE LOWER(email) = ${email.toLowerCase()}
    `;
    
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name || '',
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as AdminRole,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
      lastLogin: row.last_login?.toISOString(),
    };
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
};

export const findUserById = async (id: string): Promise<AdminUser | undefined> => {
  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    return {
      id: row.id,
      name: row.name || '',
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role as AdminRole,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
      lastLogin: row.last_login?.toISOString(),
    };
  } catch (error) {
    console.error('Error finding user by id:', error);
    return undefined;
  }
};

export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const createUser = async (name: string, email: string, password: string, role: AdminRole): Promise<AdminUser> => {
  // Check if email already exists
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('A user with this email already exists');
  }
  
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();
  
  await sql`
    INSERT INTO users (id, name, email, password_hash, role, created_at)
    VALUES (${id}, ${name}, ${email.toLowerCase()}, ${passwordHash}, ${role}, ${createdAt})
  `;
  
  return {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    createdAt,
  };
};

export const updateUser = async (id: string, updates: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): Promise<AdminUser | null> => {
  try {
    const existing = await findUserById(id);
    if (!existing) return null;
    
    await sql`
      UPDATE users SET
        name = ${updates.name ?? existing.name},
        email = ${updates.email ?? existing.email},
        password_hash = ${updates.passwordHash ?? existing.passwordHash},
        role = ${updates.role ?? existing.role},
        last_login = ${updates.lastLogin ?? existing.lastLogin ?? null}
      WHERE id = ${id}
    `;
    
    return await findUserById(id) || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const updateLastLogin = async (id: string): Promise<void> => {
  await sql`UPDATE users SET last_login = ${new Date().toISOString()} WHERE id = ${id}`;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id}`;
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

export const changePassword = async (id: string, newPassword: string): Promise<boolean> => {
  const passwordHash = await hashPassword(newPassword);
  const result = await updateUser(id, { passwordHash });
  return result !== null;
};

// Initialize default admin if none exists
export const initializeDefaultAdmin = async (): Promise<void> => {
  try {
    const users = await readUsers();
    if (users.length === 0) {
      const passwordHash = await hashPassword('password');
      await sql`
        INSERT INTO users (id, name, email, password_hash, role, created_at)
        VALUES (${crypto.randomUUID()}, 'Super Admin', 'admin@shreeradhemarble.com', ${passwordHash}, 'super_admin', ${new Date().toISOString()})
      `;
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error initializing default admin:', error);
  }
};
