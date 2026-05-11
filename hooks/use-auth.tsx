// hooks/use-auth.ts

"use client";

import { useEffect, useState } from "react";

// INTERFACE
export interface AuthUser {
  id: number;
  username: string;
  nama: string;
  role: "admin" | "mahasiswa";
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

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return {
    user,
    loading,
    logout,
  };
}
