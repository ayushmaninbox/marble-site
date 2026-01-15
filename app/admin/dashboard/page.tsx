'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Enquiry } from '@/lib/types';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import EnquiriesTable from '@/components/admin/EnquiriesTable';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [activeTab, setActiveTab] = useState<'products' | 'enquiries'>('products');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAuthenticated) {
      router.push('/admin');
      return;
    }

    fetchProducts();
    fetchEnquiries();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      const data = await response.json();
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        setShowForm(false);
        setEditingProduct(undefined);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      const response = await fetch(`/api/enquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEnquiries();
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your products and enquiries</p>
          </div>
          <div className="flex gap-4">
            <a href="/" className="btn-secondary">
              View Site
            </a>
            <button onClick={handleLogout} className="btn-primary">
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-full p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'enquiries'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Enquiries
              {enquiries.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {enquiries.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            {/* Add Product Button */}
            {!showForm && (
              <div className="mb-8 animate-slideIn">
                <button
                  onClick={() => {
                    setEditingProduct(undefined);
                    setShowForm(true);
                  }}
                  className="btn-primary"
                >
                  + Add New Product
                </button>
              </div>
            )}

            {/* Product Form */}
            {showForm && (
              <div className="mb-8 animate-scaleIn">
                <ProductForm
                  product={editingProduct}
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(undefined);
                  }}
                />
              </div>
            )}

            {/* Products Table */}
            <div className="animate-fadeIn">
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {products.filter(p => p.category === 'Marbles').length}
                </div>
                <div className="text-gray-400">Marbles</div>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {products.filter(p => p.category === 'Tiles').length}
                </div>
                <div className="text-gray-400">Tiles</div>
              </div>
              <div className="glass rounded-xl p-6 text-center">
                <div className="text-3xl font-bold gradient-text mb-2">
                  {products.filter(p => p.category === 'Handicraft').length}
                </div>
                <div className="text-gray-400">Handicraft</div>
              </div>
            </div>
          </>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Customer Enquiries</h2>
            <EnquiriesTable
              enquiries={enquiries}
              onDelete={handleDeleteEnquiry}
            />
          </div>
        )}
      </div>
    </div>
  );
}
