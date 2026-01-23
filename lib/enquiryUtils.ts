import { sql } from './db';
import { Enquiry } from './types';

export const readEnquiries = async (): Promise<Enquiry[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM enquiries ORDER BY created_at DESC
    `;
    
    return rows.map(row => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      productCategory: row.product_category as 'Marbles' | 'Tiles' | 'Handicraft',
      productName: row.product_name,
      quantity: row.quantity,
      message: row.message || '',
      status: row.status as 'pending' | 'solved',
      createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error reading enquiries:', error);
    return [];
  }
};

export const addEnquiry = async (enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  
  await sql`
    INSERT INTO enquiries (id, first_name, last_name, email, phone, product_category, product_name, quantity, message, status, created_at)
    VALUES (${id}, ${enquiry.firstName}, ${enquiry.lastName}, ${enquiry.email}, ${enquiry.phone}, ${enquiry.productCategory}, ${enquiry.productName}, ${enquiry.quantity}, ${enquiry.message || ''}, 'pending', ${createdAt})
  `;
  
  return {
    ...enquiry,
    id,
    status: 'pending',
    createdAt,
  };
};

export const deleteEnquiry = async (id: string): Promise<boolean> => {
  try {
    const result = await sql`DELETE FROM enquiries WHERE id = ${id}`;
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return false;
  }
};

export const updateEnquiryStatus = async (id: string, status: 'pending' | 'solved'): Promise<boolean> => {
  try {
    const result = await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error updating enquiry status:', error);
    return false;
  }
};

export const updateEnquiriesStatus = async (ids: string[], status: 'pending' | 'solved'): Promise<number> => {
  try {
    let count = 0;
    for (const id of ids) {
      const result = await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
      count += result.rowCount ?? 0;
    }
    return count;
  } catch (error) {
    console.error('Error updating enquiries status:', error);
    return 0;
  }
};

export const deleteEnquiries = async (ids: string[]): Promise<number> => {
  try {
    let count = 0;
    for (const id of ids) {
      const result = await sql`DELETE FROM enquiries WHERE id = ${id}`;
      count += result.rowCount ?? 0;
    }
    return count;
  } catch (error) {
    console.error('Error deleting enquiries:', error);
    return 0;
  }
};
