'use client';

import { Enquiry } from '@/lib/types';

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  onDelete: (id: string) => void;
}

export default function EnquiriesTable({ enquiries, onDelete }: EnquiriesTableProps) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  No enquiries yet. Customers can submit enquiries via the Contact Us page.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {enquiry.firstName} {enquiry.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-gray-300">{enquiry.email}</div>
                    <div className="text-gray-400 text-xs">{enquiry.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium">{enquiry.productName}</div>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                      {enquiry.productCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-400">
                    {enquiry.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                    {enquiry.message || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(enquiry.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this enquiry?')) {
                          onDelete(enquiry.id);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
