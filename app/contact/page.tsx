'use client';

import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productCategory: 'Marbles' as ProductCategory,
    productName: '',
    quantity: '1',
    message: '',
  });

  useEffect(() => {
    // Fetch products for the dropdown
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by selected category
  const filteredProducts = products.filter(p => p.category === formData.productCategory);

  // Reset product name when category changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, productName: '' }));
  }, [formData.productCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          productCategory: 'Marbles',
          productName: '',
          quantity: '1',
          message: '',
        });
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        alert('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-5xl font-bold gradient-text mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            Interested in our products? Fill out the form below and we'll get back to you soon.
          </p>
        </div>

        {success ? (
          <div className="glass rounded-2xl p-8 text-center animate-scaleIn">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Thank You!</h2>
            <p className="text-gray-300 text-lg">
              Your enquiry has been submitted successfully. We'll contact you shortly.
            </p>
            <p className="text-gray-400 text-sm mt-4">Redirecting to homepage...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 animate-scaleIn">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value as ProductCategory })}
                  required
                >
                  <option value="Marbles">Marbles</option>
                  <option value="Tiles">Tiles</option>
                  <option value="Handicraft">Handicraft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                >
                  <option value="">Select a product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} - ₹{product.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
                placeholder="Enter quantity"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder="Any additional information or questions..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Back to Home Link */}
        {!success && (
          <div className="text-center mt-6">
            <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              ← Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
