import { useLocalStorage } from "../hooks/useLocalStorage";
import { createContext, useContext, useState } from "react";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useLocalStorage("orders", []);

  const addOrder = (order) =>
    setOrders((prev) => [
      ...prev,
      {
        id: Date.now(),
        status: "new",
        number: prev.length + 1,
        createdAt: new Date().toISOString(),
        paid: false,
        ...order,
      },
    ]);

  const updateOrderStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const markOrdersPaid = (ids) =>
    setOrders((prev) =>
      prev.map((o) => (ids.includes(o.id) ? { ...o, paid: true } : o))
    );

  const removeOrder = (id) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        placeOrder: addOrder,
        updateOrderStatus,
        markOrdersPaid,
        removeOrder,
        deleteOrder: removeOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);