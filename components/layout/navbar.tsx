"use client";

import { useState } from "react";
import { BarChart3, X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  const menuItems = [
    {
      name: "Beranda",
      href: "/",
    },
    {
      name: "Infografis",
      href: "/infografis",
    },
    {
      name: "Artikel",
      href: "/artikel",
    },
    {
      name: "Galeri",
      href: "/galeri",
    },
  ];

  return (
    <nav className="bg-white text-gray-700 sticky top-0 z-50 border-2 border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex items-center space-x-3">
            <div className="bg-purple-900 text-white p-1.5 rounded-lg font-bold text-xl">
              <BarChart3 className="w-6 h-6 inline-block mr-1" />
            </div>
            <div>
              <h1 className="font-bold text-purple-900 text-lg leading-tight">
                Pojok Statistik
              </h1>
              <p className="text-xs text-purple-500">BPS Papua Barat x UNIPA</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-8 py-3 rounded-lg transition-all
              ${
                isActive
                  ? "text-yellow-400"
                  : "hover:bg-gray-50 hover:text-yellow-400"
              }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-purple-900 hover:text-yellow-400"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-8 py-3 rounded-lg border-b-2 border-gray-100 transition-all
              ${
                isActive
                  ? "text-yellow-400"
                  : "hover:bg-purple-50 hover:text-yellow-400"
              }`}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
