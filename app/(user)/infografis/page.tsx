"use client";

import PreviewDialog from "@/components/ui/preview-dialog";
import ScrollAnimation from "@/components/ui/scroll-anim";
import { imageDownloader } from "@/utils/download";
import { getPaginatedData, getTotalPages } from "@/utils/pagination";
import { filterData, getUniqueCategories } from "@/utils/search";
import { InfografisModel } from "@/data/infografis-model";
import { useFetch } from "@/hooks/use-fetch";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Search,
  User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 6;

export default function InfografisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InfografisModel | null>(
    null,
  );

  // Ambil data dari API Route
  const {
    data: dataInfografis,
    isLoading,
    error,
  } = useFetch<InfografisModel>("/api/infografis");

  const approvedData = dataInfografis.filter(
    (item) => item.status === "disetujui",
  );

  const categories = getUniqueCategories(approvedData);

  const filteredData = filterData(approvedData, searchQuery, selectedCategory);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = getTotalPages(filteredData.length, ITEMS_PER_PAGE);
  const currentItems = getPaginatedData(
    filteredData,
    currentPage,
    ITEMS_PER_PAGE,
  );

  // Tampilkan efek loading saat data sedang diambil
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  // Tampilkan efek jika error
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Hero */}
      <div className="bg-white border-b-2 border-gray-100 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-gray-900 text-4xl md:text-5xl font-extrabold mb-4">
            Koleksi <span className="text-purple-800">Infografis</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Jelajahi kumpulan visualisasi data statistik yang dirancang untuk
            memudahkan pemahaman informasi ekonomi dan sosial Papua Barat.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* PANEL PENCARIAN & FILTER */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-10 border border-gray-300 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Input Pencarian */}
          <div className="relative w-full md:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-colors bg-gray-50 text-gray-900"
              placeholder="Cari judul infografis (contoh: Inflasi, Pertanian)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown Kategori */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-colors bg-gray-50 text-gray-900 appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
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
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="mt-6 text-purple-600 font-semibold hover:underline"
            >
              Hapus Pencarian
            </button>
          </div>
        ) : (
          <>
            {/* GRID DAFTAR INFOGRAFIS */}
            <ScrollAnimation>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full"
                  >
                    {/* Thumbnail Gambar */}
                    <div className="relative h-60 overflow-hidden bg-gray-200">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-yellow-300 backdrop-blur text-gray-900 text-xs px-3 py-1 rounded-full shadow-sm">
                        {item.category}
                      </div>
                    </div>

                    {/* Konten Teks */}
                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-800 transition-colors">
                        {item.title}
                      </h3>

                      <div className="space-y-2 mt-auto mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="w-4 h-4 mr-2 text-yellow-500" />
                          {item.author}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
                          {item.date}
                        </div>
                      </div>

                      {/* Tombol Aksi */}
                      <div className="flex gap-2 mt-auto border-t border-gray-100 pt-4">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="flex-1 cursor-pointer bg-white text-gray-800 font-semibold py-2 rounded-lg border border-gray-800 flex items-center justify-center hover:bg-gray-100 transition"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Lihat
                        </button>
                        <button
                          onClick={() =>
                            imageDownloader(item.image_url, item.title)
                          }
                          className="flex-1 cursor-pointer bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg flex items-center justify-center hover:bg-yellow-400 transition shadow-sm"
                        >
                          <Download className="w-4 h-4 mr-1" /> Unduh
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>

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
      <PreviewDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
