import { useLocalStorage } from "../hooks/useLocalStorage";
import { createContext, useContext, useState } from "react";

const PaymentsContext = createContext(null);

export function PaymentsProvider({ children }) {
  const [payments, setPayments] = useLocalStorage("payments", []);

  const recordPayment = (data) => {
    const payment = {
      id: Date.now(),
      number: payments.length + 1,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setPayments((prev) => [...prev, payment]);
    return payment;
  };

  return (
    <PaymentsContext.Provider
      value={{ payments, recordPayment, addPayment: recordPayment }}
    >
      {children}
    </PaymentsContext.Provider>
  );
}

export const usePayments = () => useContext(PaymentsContext);