import { useLocalStorage } from "../hooks/useLocalStorage";
import { createContext, useContext, useState } from "react";

const TablesContext = createContext(null);

export function TablesProvider({ children }) {
  const [tables, setTables] = useLocalStorage("tables", [
    { id: 1, number: 1, seats: 2, status: "available" },
    { id: 2, number: 2, seats: 4, status: "available" },
    { id: 3, number: 3, seats: 6, status: "available" },
  ]);

  const updateTableStatus = (id, status) =>
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const addTable = (number, seats) =>
    setTables((prev) => [
      ...prev,
      { id: Date.now(), number, seats, status: "available" },
    ]);

  const deleteTable = (id) =>
    setTables((prev) => prev.filter((t) => t.id !== id));

  return (
    <TablesContext.Provider
      value={{
        tables,
        setTables,
        updateTableStatus,
        setTableStatus: updateTableStatus,
        addTable,
        deleteTable,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
}

export const useTables = () => useContext(TablesContext);