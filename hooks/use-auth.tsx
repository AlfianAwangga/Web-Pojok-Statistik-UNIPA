"use client";

import { useEffect, useState } from "react";

// INTERFACE
export interface AuthUser {
  id: number;
  username: string;
  nama: string;
  role: "admin" | "mahasiswa";
  status: "active" | "inactive";
}

// HOOK
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Auth Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // FUNGSI BARU: Untuk memperbarui data session tanpa harus login ulang
  const updateUserSession = (updatedData: Partial<AuthUser>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser); // Update UI seketika
      localStorage.setItem("user", JSON.stringify(newUser)); // Update penyimpanan browser
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return {
    user,
    loading,
    logout,
    updateUserSession,
  };
}
