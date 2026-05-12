"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  PieChart,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  BarChart,
  BarChart3,
  Users2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function NavbarAdmin() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // mobile auto kecil
      } else {
        setIsCollapsed(false); // desktop normal
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Infografis",
      href: "/admin/infografis",
      icon: PieChart,
    },
    {
      name: "Artikel",
      href: "/admin/artikel",
      icon: FileText,
    },
    {
      name: "Galeri",
      href: "/admin/foto",
      icon: ImageIcon,
    },
  ];

  return (
    <aside
      className={`
        ${isCollapsed ? "w-12 sm:w-16" : "w-44 sm:w-64"}
        bg-purple-900 flex flex-col h-screen sticky top-0
        transition-all duration-300
      `}
    >
      {/* Brand Area */}
      <div
        className={`
    h-12 md:h-16 border-b border-purple-800 bg-purple-950
    flex items-center
    ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}
  `}
      >
        {/* Logo + Title */}
        {!isCollapsed && (
          <div className="flex items-center overflow-hidden">
            <div className="bg-white p-1.5 rounded shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-900" />
            </div>

            <div className="ml-3">
              <h1 className="font-bold text-white tracking-wide text-sm leading-tight">
                Backend
              </h1>
              <p className="hidden sm:text-[10px] text-slate-400">
                Pojok Statistik BPS x UNIPA
              </p>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-purple-800 text-white transition shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-6 px-1 sm:px-3 space-y-2">
        {!isCollapsed && (
          <p className="px-3 text-xs font-bold text-yellow-200 uppercase tracking-wider mb-3">
            KONTEN WEB
          </p>
        )}

        <div className="flex flex-col text-sm font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center
                  ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"}
                  rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-yellow-400 text-gray-700 shadow-md"
                      : "hover:bg-purple-800 text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {user!?.role === "admin" && (
          <>
            {!isCollapsed && (
              <p className="mt-8 mb-3 px-3 text-xs font-bold uppercase tracking-wider text-yellow-200">
                Kelola User
              </p>
            )}

            <Link
              href="/admin/users"
              className={`w-full flex items-center rounded-lg text-sm font-medium ${
                pathname === "/admin/users"
                  ? "bg-yellow-400 text-gray-700 shadow-md"
                  : "hover:bg-purple-800 text-white"
              } ${
                isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
              } `}
            >
              <Users2 className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Pengguna</span>}
            </Link>
          </>
        )}

        {!isCollapsed && (
          <p className="px-3 text-xs font-bold text-yellow-200 uppercase tracking-wider mb-3 mt-8">
            Profilku
          </p>
        )}

        <button
          className={`
            w-full flex items-center rounded-lg text-sm font-medium
            hover:bg-purple-800 text-white transition-all
            ${isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3 gap-3"}
          `}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Akun</span>}
        </button>
      </div>
      <div className="p-6 border-t border-purple-800 pt-4">
        {user ? (
          <button
            onClick={logout}
            className={`
        w-full flex items-center rounded-lg text-sm font-medium
        transition-all
        ${isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3 gap-3"}
        text-red-200
        hover:bg-red-500/20
        hover:text-red-100
      `}
          >
            <LogOut className="w-5 h-5 shrink-0" />

            {!isCollapsed && <span>Logout</span>}
          </button>
        ) : (
          <div className="hidden"></div>
        )}
      </div>
    </aside>
  );
}
