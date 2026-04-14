"use client";

import { useState } from "react";
import { BarChart3, X, Menu } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-purple-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex items-center space-x-3">
            <div className="bg-white text-purple-900 p-1.5 rounded-lg font-bold text-xl">
              <BarChart3 className="w-6 h-6 inline-block mr-1" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                Pojok Statistik
              </h1>
              <p className="text-xs text-purple-200">BPS Papua Barat x UNIPA</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="hover:text-yellow-400 transition-colors">
              Beranda
            </a>
            <a
              href="/infografis"
              className="hover:text-yellow-400 transition-colors"
            >
              Infografis
            </a>
            <a
              href="#artikel"
              className="hover:text-yellow-400 transition-colors"
            >
              Artikel
            </a>
            <a
              href="#galeri"
              className="hover:text-yellow-400 transition-colors"
            >
              Galeri
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-400"
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
        <div className="md:hidden bg-purple-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#beranda"
            className="block px-3 py-2 rounded-md hover:bg-purple-700 hover:text-yellow-400"
          >
            Beranda
          </a>
          <a
            href="#infografis"
            className="block px-3 py-2 rounded-md hover:bg-purple-700 hover:text-yellow-400"
          >
            Infografis
          </a>
          <a
            href="#artikel"
            className="block px-3 py-2 rounded-md hover:bg-purple-700 hover:text-yellow-400"
          >
            Artikel
          </a>
          <a
            href="#galeri"
            className="block px-3 py-2 rounded-md hover:bg-purple-700 hover:text-yellow-400"
          >
            Galeri
          </a>
        </div>
      )}
    </nav>
  );
}
