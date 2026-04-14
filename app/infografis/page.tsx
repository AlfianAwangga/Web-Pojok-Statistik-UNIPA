"use client";

import React, { useState, useEffect } from "react";
import { infografisData } from "@/data/dummies";
import {
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
} from "lucide-react";

const ITEMS_PER_PAGE = 6; // Menentukan batas infografis per halaman

export default function InfografisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. LOGIKA PENCARIAN (Filter)
  // Menyaring data berdasarkan kata kunci pencarian (judul)
  const filteredData = infografisData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Jika pengguna mengetik pencarian baru, kembalikan ke halaman 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 2. LOGIKA PAGINATION (Pembagian Halaman)
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Bagian Header (Hero) Halaman Infografis */}
      <div className="bg-purple-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Katalog <span className="text-yellow-400">Infografis</span>
          </h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-lg">
            Jelajahi kumpulan visualisasi data statistik yang dirancang untuk
            memudahkan pemahaman informasi ekonomi dan sosial Papua Barat.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* PANEL PENCARIAN & FILTER */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-10 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-gray-50 text-gray-900"
              placeholder="Cari judul infografis (contoh: Inflasi, Pertanian)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/3 flex gap-2">
            <button className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-100 transition">
              <Filter className="w-5 h-5 mr-2" /> Kategori
            </button>
          </div>
        </div>

        {/* PESAN JIKA DATA TIDAK DITEMUKAN */}
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">
              Infografis tidak ditemukan
            </h3>
            <p className="text-gray-500 mt-2">
              Coba gunakan kata kunci lain untuk pencarian Anda.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 text-purple-600 font-semibold hover:underline"
            >
              Hapus Pencarian
            </button>
          </div>
        ) : (
          <>
            {/* GRID DAFTAR INFOGRAFIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full"
                >
                  {/* Thumbnail Gambar */}
                  <div className="relative h-60 overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </div>
                  </div>

                  {/* Konten Teks */}
                  <div className="p-6 flex flex-col grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </h3>

                    <div className="space-y-2 mt-auto mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2 text-yellow-500" />
                        Oleh: {item.author}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                        Diunggah: {item.date}
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-2 mt-auto border-t border-gray-100 pt-4">
                      <button className="flex-1 bg-purple-50 text-purple-700 font-semibold py-2 rounded-lg flex items-center justify-center hover:bg-purple-100 transition">
                        <Eye className="w-4 h-4 mr-1" /> Lihat
                      </button>
                      <button className="flex-1 bg-yellow-500 text-purple-900 font-bold py-2 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition shadow-sm">
                        <Download className="w-4 h-4 mr-1" /> Unduh
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* KOMPONEN PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg flex items-center ${currentPage === 1 ? "text-gray-400 cursor-not-allowed bg-gray-100" : "text-purple-900 bg-white hover:bg-purple-50 shadow-sm border border-gray-200"}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Looping nomor halaman */}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === i + 1 ? "bg-purple-900 text-white shadow-md" : "bg-white text-gray-600 hover:bg-purple-50 border border-gray-200 shadow-sm"}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg flex items-center ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed bg-gray-100" : "text-purple-900 bg-white hover:bg-purple-50 shadow-sm border border-gray-200"}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
