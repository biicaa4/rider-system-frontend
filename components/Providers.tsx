"use client";

import { OrderProvider } from "@/contexts/OrderContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>;
}
