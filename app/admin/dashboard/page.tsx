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
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-slate-50 via-blue-200 to-sky-300 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">Manage your products and enquiries</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-100 shadow-sm transition hover:border-blue-500 hover:bg-slate-900/80"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex gap-2 rounded-full border border-slate-700 bg-slate-900/80 p-1 shadow-sm shadow-slate-900/60">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'enquiries'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              Enquiries
              {enquiries.length > 0 && (
                <span className="ml-2 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
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
              <div className="mb-8">
                <button
                  onClick={() => {
                    setEditingProduct(undefined);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2 text-xs font-medium text-white shadow-sm transition hover:brightness-110 hover:shadow-md"
                >
                  + Add New Product
                </button>
              </div>
            )}

            {/* Product Form */}
            {showForm && (
              <div className="mb-8">
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
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-900/80">
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-3xl font-semibold text-transparent">
                  {products.filter(p => p.category === 'Marbles').length}
                </div>
                <div className="mt-1 text-xs text-slate-400">Marbles</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-3xl font-semibold text-transparent">
                  {products.filter(p => p.category === 'Tiles').length}
                </div>
                <div className="mt-1 text-xs text-slate-400">Tiles</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-center">
                <div className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-3xl font-semibold text-transparent">
                  {products.filter(p => p.category === 'Handicraft').length}
                </div>
                <div className="mt-1 text-xs text-slate-400">Handicraft</div>
              </div>
            </div>
          </>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div>
            <h2 className="mb-4 bg-gradient-to-r from-slate-50 via-blue-200 to-sky-300 bg-clip-text text-2xl font-semibold text-transparent">
              Customer Enquiries
            </h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-900/80">
              <EnquiriesTable
                enquiries={enquiries}
                onDelete={handleDeleteEnquiry}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
