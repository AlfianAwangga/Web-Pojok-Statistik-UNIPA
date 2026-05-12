"use client";

import "@/app/globals.css";
import ScrollToTop from "@/components/ui/scroll-to-top";
import NavbarAdmin from "@/components/layout/navbar-admin";
import TopBarAdmin from "@/components/layout/topbar-admin";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    // Jika sudah selesai loading dan user tidak ada
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-purple-700"></div>
      </div>
    );
  }

  // Mencegah halaman tampil sebelum redirect
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <NavbarAdmin />

      <div className="flex-1 flex flex-col">
        <TopBarAdmin />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      <ScrollToTop />
    </div>
  );
}
