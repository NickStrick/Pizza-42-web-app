"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ORDER_HISTORY_CLAIM, type OrderHistoryEntry } from "@/lib/claims";

type OrderHistoryContextValue = {
  orderHistory: OrderHistoryEntry[];
  addOrder: (order: OrderHistoryEntry) => void;
};

const OrderHistoryContext = createContext<OrderHistoryContextValue | null>(null);

export function OrderHistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>([]);

  // Reseed from the ID token claim whenever it changes (e.g. on login/logout),
  // so a fresh login's claim is still the source of truth.
  useEffect(() => {
    setOrderHistory(user?.[ORDER_HISTORY_CLAIM] ?? []);
  }, [user]);

  const addOrder = (order: OrderHistoryEntry) => {
    setOrderHistory((prev) => [order, ...prev]);
  };

  return (
    <OrderHistoryContext.Provider value={{ orderHistory, addOrder }}>
      {children}
    </OrderHistoryContext.Provider>
  );
}

export function useOrderHistory() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error("useOrderHistory must be used within an OrderHistoryProvider");
  return ctx;
}
