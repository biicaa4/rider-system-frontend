"use client";

import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useOrders } from "@/contexts/OrderContext";

export default function OrdersPage() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markAsDelivered = async (id: number) => {
    await updateOrderStatus(id, "delivered");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">All Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow-lg ring-1 ring-gray-300 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Cake</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{order.recipient_name}</div>
                        <div className="text-sm text-gray-600 font-medium">{order.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(order.delivery_date).toLocaleDateString('en-MY', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">{order.delivery_time}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{order.cake_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">RM {order.delivery_fee}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === "delivered" ? (
                        <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-600 text-white font-medium">Delivered</span>
                      ) : (
                        <button onClick={() => markAsDelivered(order.id)} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors">
                          Mark as Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
