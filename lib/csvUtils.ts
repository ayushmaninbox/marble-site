import { sql } from './db';
import { Product, ProductSpecification } from './types';

export const readProducts = async (): Promise<Product[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM products ORDER BY display_order ASC NULLS LAST, created_at DESC
    `;
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category as 'Marbles' | 'Tiles' | 'Handicraft',
      description: row.description || '',
      price: parseFloat(row.price) || 0,
      images: JSON.parse(row.images || '[]'),
      specifications: JSON.parse(row.specifications || '[]') as ProductSpecification[],
      inStock: row.in_stock,
      isFeatured: row.is_featured,
      displayOrder: row.display_order,
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const images = JSON.stringify(product.images || []);
  const specifications = JSON.stringify(product.specifications || []);
  
  await sql`
    INSERT INTO products (id, name, category, description, price, images, specifications, in_stock, is_featured, display_order, created_at)
    VALUES (${id}, ${product.name}, ${product.category}, ${product.description}, ${product.price}, ${images}, ${specifications}, ${product.inStock !== false}, ${product.isFeatured || false}, ${product.displayOrder || null}, ${createdAt})
  `;
  
  return {
    ...product,
    id,
    images: product.images || [],
    inStock: product.inStock !== false,
    createdAt,
  };
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const existing = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (existing.rows.length === 0) return null;
    
    const current = existing.rows[0];
    const newImages = updates.images !== undefined ? JSON.stringify(updates.images) : current.images;
    const newSpecs = updates.specifications !== undefined ? JSON.stringify(updates.specifications) : current.specifications;
    
    await sql`
      UPDATE products SET
        name = ${updates.name ?? current.name},
        category = ${updates.category ?? current.category},
        description = ${updates.description ?? current.description},
        price = ${updates.price ?? current.price},
        images = ${newImages},
        specifications = ${newSpecs},
        in_stock = ${updates.inStock ?? current.in_stock},
        is_featured = ${updates.isFeatured ?? current.is_featured},
        display_order = ${updates.displayOrder ?? current.display_order}
      WHERE id = ${id}
    `;
    
    const updated = await sql`SELECT * FROM products WHERE id = ${id}`;
    const row = updated.rows[0];
    
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description,
      price: parseFloat(row.price),
      images: JSON.parse(row.images || '[]'),
      specifications: JSON.parse(row.specifications || '[]'),
      inStock: row.in_stock,
      isFeatured: row.is_featured,
      displayOrder: row.display_order,
      createdAt: row.created_at?.toISOString(),
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const result = await sql`DELETE FROM products WHERE id = ${id}`;
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

export const reorderProducts = async (productId: string, newIndex: number): Promise<boolean> => {
  try {
    const products = await readProducts();
    const currentIndex = products.findIndex(p => p.id === productId);
    
    if (currentIndex === -1 || newIndex < 0 || newIndex >= products.length) {
      return false;
    }
    
    const [movedProduct] = products.splice(currentIndex, 1);
    products.splice(newIndex, 0, movedProduct);
    
    // Update display_order for all products
    for (let i = 0; i < products.length; i++) {
      await sql`UPDATE products SET display_order = ${i} WHERE id = ${products[i].id}`;
    }
    
    return true;
  } catch (error) {
    console.error('Error reordering products:', error);
    return false;
  }
};
