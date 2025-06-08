"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Order {
  id: number;
  recipient_name: string;
  phone: string;
  address: string;
  cake_description: string;
  delivery_fee: string;
  delivery_date: string;
  delivery_time: string;
  collection_time: string;
  status: string;
}

interface OrderContextType {
  orders: Order[];
  todayOrders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchTodayOrders: () => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTodayOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders/today");
      setTodayOrders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch today orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (id: number, status: string) => {
      try {
        console.log(`Updating order ${id} to status: ${status}`);
        const response = await api.patch(`/orders/${id}/status`, { status });
        console.log("Update response:", response.data);

        // Check for success response
        if (response.data.success) {
          toast.success(response.data.message || "Order updated successfully!");
          
          // Refetch to get the updated data from backend
          await Promise.all([fetchOrders(), fetchTodayOrders()]);
        } else {
          throw new Error(response.data.message || "Failed to update order");
        }
      } catch (error: any) {
        console.error("Failed to update order:", error);
        console.error("Error details:", error.response?.data);
        console.error("Full error:", error);
        
        // Check if it's a network error or server error
        if (error.response) {
          // Server responded with error
          toast.error(error.response.data?.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
          // Request made but no response
          toast.error("No response from server. Check if backend is running.");
        } else {
          // Something else happened
          toast.error(error.message || "Failed to update order");
        }
      }
    },
    [fetchOrders, fetchTodayOrders]
  );

  const createOrder = useCallback(
    async (orderData: any) => {
      try {
        const response = await api.post("/orders", orderData);
        toast.success("Order created successfully!");
        // Refetch both lists to get the new order
        await Promise.all([fetchOrders(), fetchTodayOrders()]);
        return response.data;
      } catch (error) {
        toast.error("Failed to create order");
        throw error;
      }
    },
    [fetchOrders, fetchTodayOrders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        todayOrders,
        loading,
        fetchOrders,
        fetchTodayOrders,
        updateOrderStatus,
        createOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
};
