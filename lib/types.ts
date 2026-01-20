export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Marbles' | 'Tiles' | 'Handicraft';
  description: string;
  price: number;
  images: string[]; // Array of up to 7 image URLs/paths
  image?: string; // Legacy field for backward compatibility
  specifications?: ProductSpecification[]; // Custom key-value specifications
  createdAt: string;
}

export type ProductCategory = 'Marbles' | 'Tiles' | 'Handicraft';

export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  productCategory: 'Marbles' | 'Tiles' | 'Handicraft';
  productName: string;
  quantity: number;
  message?: string;
  createdAt: string;
  status: 'pending' | 'solved';
}

export type AdminRole = 'super_admin' | 'admin' | 'product_manager' | 'content_writer' | 'enquiry_handler';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: string;
  lastLogin?: string;
}

export interface BlogComment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
}
