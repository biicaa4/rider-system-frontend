"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: "",
    phone: "",
    address: "",
    cake_description: "",
    delivery_fee: "",
    delivery_date: "",
    delivery_time: "",
    collection_time: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/orders", formData);
      toast.success("Order created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Recipient Name</label>
                <input type="text" name="recipient_name" required value={formData.recipient_name} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" placeholder="Enter recipient name" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" placeholder="Enter phone number" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Address</label>
                <textarea name="address" required value={formData.address} onChange={handleChange} rows={2} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all resize-none" placeholder="Enter complete delivery address" />
              </div>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Cake Description</label>
                <input type="text" name="cake_description" required value={formData.cake_description} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" placeholder="Describe the cake order" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Fee (RM)</label>
                <input type="number" name="delivery_fee" required step="0.01" value={formData.delivery_fee} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Date</label>
                <input type="date" name="delivery_date" required value={formData.delivery_date} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Delivery Time</label>
                <input type="time" name="delivery_time" required value={formData.delivery_time} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Collection Time</label>
                <input type="time" name="collection_time" required value={formData.collection_time} onChange={handleChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all" />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Additional Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all resize-none" placeholder="Any special instructions or notes (optional)" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-all duration-200 shadow-sm">
              {loading ? "Creating..." : "Create Order"}
            </button>
            <button type="button" onClick={() => router.push("/dashboard")} className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-all duration-200">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
