import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "waiter", password: "waiter123", role: "waiter" },
  { username: "kitchen", password: "kitchen123", role: "kitchen" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const found = USERS.find(
      (u) =>
        u.username === String(username).trim().toLowerCase() &&
        u.password === password
    );
    if (!found) return false;

    const loggedIn = { username: found.username, role: found.role };
    setUser(loggedIn);
    localStorage.setItem("user", JSON.stringify(loggedIn));
    return { success: true, user: loggedIn };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);