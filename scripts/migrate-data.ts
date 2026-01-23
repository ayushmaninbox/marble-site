import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { sql, initializeDatabase } from '../lib/db';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Product } from '../lib/types';

// Helper to read CSV
const readCsv = (filename: string) => {
  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
  return parsed.data;
};

async function migrateData() {
  console.log('Starting migration...');

  // 0. Initialize Database Tables
  console.log('Initializing tables...');
  await initializeDatabase();

  // 1. Migrate Products
  const products = readCsv('products.csv') as any[];
  console.log(`Found ${products.length} products to migrate`);
  
  for (const p of products) {
    try {
      // Handle legacy image field vs images array
      let images = p.images;
      if (!images && p.image) {
        images = JSON.stringify([p.image]);
      } else if (!images) {
        images = '[]';
      }
      
      // Ensure valid JSON for arrays
      try { JSON.parse(images); } catch { images = '[]'; }
      let specs = p.specifications || '[]';
      try { JSON.parse(specs); } catch { specs = '[]'; }

      await sql`
        INSERT INTO products (
          id, name, category, description, price, images, specifications, in_stock, is_featured, display_order, created_at
        ) VALUES (
          ${p.id || crypto.randomUUID()}, 
          ${p.name}, 
          ${p.category}, 
          ${p.description}, 
          ${parseFloat(p.price) || 0}, 
          ${images}, 
          ${specs}, 
          ${p.inStock !== 'false'}, 
          ${p.isFeatured === 'true'}, 
          ${parseInt(p.displayOrder) || 0}, 
          ${p.createdAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (e) {
      console.error(`Failed to migrate product ${p.name}:`, e);
    }
  }

  // 2. Migrate Blogs
  const blogs = readCsv('blogs.csv') as any[];
  console.log(`Found ${blogs.length} blogs to migrate`);
  
  for (const b of blogs) {
    try {
      await sql`
        INSERT INTO blogs (
          id, title, slug, excerpt, content, cover_image, author, likes, created_at, updated_at
        ) VALUES (
          ${b.id || crypto.randomUUID()},
          ${b.title},
          ${b.slug},
          ${b.excerpt},
          ${b.content},
          ${b.coverImage || ''},
          ${b.author},
          ${parseInt(b.likes) || 0},
          ${b.createdAt || new Date().toISOString()},
          ${b.updatedAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    } catch (e) {
      console.error(`Failed to migrate blog ${b.title}:`, e);
    }
  }

  // 3. Migrate Users (Admins)
  const users = readCsv('users.csv') as any[];
  console.log(`Found ${users.length} users to migrate`);
  
  for (const u of users) {
    try {
        await sql`
        INSERT INTO users (
            id, name, email, password_hash, role, created_at, last_login
        ) VALUES (
            ${u.id || crypto.randomUUID()},
            ${u.name},
            ${u.email},
            ${u.passwordHash},
            ${u.role},
            ${u.createdAt || new Date().toISOString()},
            ${u.lastLogin || null}
        )
        ON CONFLICT (email) DO NOTHING;
        `;
    } catch (e) {
        console.error(`Failed to migrate user ${u.email}:`, e);
    }
  }

  // 4. Migrate Enquiries
  const enquiries = readCsv('enquiries.csv') as any[];
  console.log(`Found ${enquiries.length} enquiries to migrate`);

  for (const e of enquiries) {
    try {
        await sql`
        INSERT INTO enquiries (
            id, first_name, last_name, email, phone, product_category, product_name, quantity, message, status, created_at
        ) VALUES (
            ${e.id || Date.now().toString()},
            ${e.firstName},
            ${e.lastName},
            ${e.email},
            ${e.phone},
            ${e.productCategory},
            ${e.productName},
            ${parseInt(e.quantity) || 1},
            ${e.message || ''},
            ${e.status || 'pending'},
            ${e.createdAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO NOTHING;
        `;
    } catch (err) {
        console.error(`Failed to migrate enquiry for ${e.email}:`, err);
    }
  }

  console.log('Migration complete!');
}

// Execute migration
migrateData().catch(console.error);
