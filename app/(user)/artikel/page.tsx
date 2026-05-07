"use client";

import ScrollAnimation from "@/components/ui/scroll-anim";
import { getPaginatedData, getTotalPages } from "@/utils/pagination";
import { filterData, getUniqueCategories } from "@/utils/search";
import { artikelData } from "@/data/dummies";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  ChevronUp,
  Clock,
  Filter,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { ArtikelModel } from "@/data/artikel-model";
import Image from "next/image";

const ITEMS_PER_PAGE = 4;

export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Ambil data dari API Route
  const {
    data: dataArtikel,
    isLoading,
    error,
  } = useFetch<ArtikelModel>("/api/artikel");

  const categories = getUniqueCategories(dataArtikel);
  const filteredData = filterData(dataArtikel, searchQuery, selectedCategory);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = getTotalPages(filteredData.length, ITEMS_PER_PAGE);
  const currentItems = getPaginatedData(
    filteredData,
    currentPage,
    ITEMS_PER_PAGE,
  );

  const router = useRouter();

  const handleOpenArticle = (slug: string) => {
    router.push(`/artikel/${slug}`);
  };

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* HEADER PAGE */}
      <div className=" bg-white text-white py-16 px-4 border-b-2 border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          {/* <BookOpen className="w-12 h-12 mx-auto text-yellow-400 mb-6" /> */}
          <h1 className="text-4xl text-gray-900 md:text-5xl font-extrabold mb-4">
            Artikel & <span className="text-purple-800">Kajian Statistik</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Kumpulan tulisan analitis, ringkasan eksekutif, dan catatan lapangan
            yang mendokumentasikan wawasan data Papua Barat.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 relative z-10 flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR KIRI */}
        <div className="w-full lg:w-1/4">
          {/* WRAPPER AGAR MENYATU */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:border-gray-100">
            {/* TOGGLE BUTTON MOBILE */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex w-full items-center justify-between px-5 py-4 font-bold text-gray-900 transition-colors hover:bg-gray-50 lg:hidden"
            >
              <span className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" /> Filter
                Artikel
              </span>
              {isFilterOpen ? (
                <ChevronUp className="h-5 w-5 text-purple-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-purple-600" />
              )}
            </button>
            {/* FILTER CONTENT */}
            <div
              className={`px-5 pb-5 ${isFilterOpen ? "block border-t border-gray-100" : "hidden"}  lg:block lg:border-t-0 lg:px-6 lg:pb-6`}
            >
              {/* DESKTOP TITLE */}
              <h3 className="hidden lg:flex text-lg font-bold text-gray-900 mb-4 items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-600" /> Filter
                Artikel
              </h3>
              <div className="relative mb-6 pt-4 lg:pt-0">
                <Search className="absolute left-3 top-7 lg:top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari judul artikel..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                  Pilih Kategori
                </h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-sm font-semibold py-2.5 px-4 rounded-xl border text-left transition-all ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "bg-purple-900 text-white border-purple-900 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"}`}
                    >
                      {cat}
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm font-bold text-red-500 mt-2 hover:bg-red-50 py-2.5 px-4 rounded-xl transition-colors text-center border border-transparent"
                    >
                      Reset Pencarian
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* KONTEN KANAN: GRID ARTIKEL */}
        <div className="w-full lg:w-3/4">
          <ScrollAnimation>
            {filteredData.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-500">
                  Kajian tidak ditemukan
                </h3>
                <p className="text-gray-400 mt-2">
                  Coba gunakan kata kunci atau kategori lain.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mb-12">
                {currentItems.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-300 text-grey-900 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">
                        {article.category}
                      </div>
                    </div>

                    {/* Ringkasan Konten */}
                    <div className="p-6 md:p-8 md:w-3/5 flex flex-col">
                      <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-purple-600" />{" "}
                          {article.publishDate}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-yellow-500" />{" "}
                          {article.readTime}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenArticle(article.slug)}
                        className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug cursor-pointer group-hover:text-purple-700 transition-colors line-clamp-2"
                      >
                        {article.title}
                      </h3>

                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow text-sm md:text-base">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-50">
                        <span className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="w-4 h-4 mr-2" /> {article.author}
                        </span>
                        {/* Tombol Pemicu Buka Artikel */}
                        <button
                          onClick={() => handleOpenArticle(article.slug)}
                          className="text-purple-600 font-bold text-sm flex items-center cursor-pointer hover:text-purple-900 active:text-purple-900 group-hover:translate-x-1 transition-transform"
                        >
                          Baca Selengkapnya{" "}
                          <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}
