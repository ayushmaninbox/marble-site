export interface Product {
  id: string;
  name: string;
  category: 'Marbles' | 'Tiles' | 'Handicraft';
  description: string;
  price: number;
  image: string;
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
