"use client";

import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useOrders } from "@/contexts/OrderContext";

export default function DashboardPage() {
  const { todayOrders, loading, fetchTodayOrders, updateOrderStatus } = useOrders();

  useEffect(() => {
    fetchTodayOrders();
  }, [fetchTodayOrders]);

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
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Today's Deliveries</h1>

        {todayOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">No deliveries for today</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-xl text-gray-900 mb-3">{order.recipient_name}</h3>
                <p className="text-gray-700 font-medium mb-1">📱 {order.phone}</p>
                <p className="text-gray-700 font-medium mb-1">📍 {order.address}</p>
                <p className="text-gray-700 font-medium mb-1">🎂 {order.cake_description}</p>
                <p className="text-gray-700 font-medium mb-1">⏰ {order.delivery_time}</p>
                <p className="text-gray-700 font-medium mb-2">🚗 {order.collection_time}</p>
                <p className="font-bold text-lg text-gray-900 mt-3">RM {order.delivery_fee}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${order.status === "delivered" ? "bg-green-600 text-white" : "bg-amber-500 text-white"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>

                  {order.status !== "delivered" && (
                    <button onClick={() => markAsDelivered(order.id)} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
