"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      api.get("/users/profile").then((res) => setAdmin(res.data)).catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/users/login", { email, password });
    setAdmin(data.user);
    setToken(data.token);
    localStorage.setItem("adminToken", data.token);
    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
};
