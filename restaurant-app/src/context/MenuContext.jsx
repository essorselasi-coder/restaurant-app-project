import { useLocalStorage } from "../hooks/useLocalStorage";
import { createContext, useContext, useState } from "react";
import { menuItems as initialItems } from "../data/menuItems";

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
 const [menuItems, setMenuItems] = useLocalStorage("menuItems", initialItems);

  const addMenuItem = (item) =>
    setMenuItems((prev) => [...prev, { id: Date.now(), ...item }]);

  const removeMenuItem = (id) =>
    setMenuItems((prev) => prev.filter((i) => i.id !== id));

  const updateItem = (id, changes) =>
  setMenuItems((prev) =>
    prev.map((i) => (i.id === id ? { ...i, ...changes } : i))
  );

const toggleAvailable = (id) =>
  setMenuItems((prev) =>
    prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
  );

  return (
    <MenuContext.Provider
     
    value={{
  items: menuItems,
  addItem: addMenuItem,
  updateItem,
  deleteItem: removeMenuItem,
  toggleAvailable,
}}
    >
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);