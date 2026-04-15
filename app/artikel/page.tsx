"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { artikelData, ArtikelModel } from "@/data/dummies";
import {
  Search,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  BarChart3,
  ChevronRight as ChevronRightIcon,
  Filter,
} from "lucide-react";
import { filterData, getUniqueCategories } from "@/components/utils/search";
import { getPaginatedData, getTotalPages } from "@/components/utils/pagination";
import ScrollAnimation from "@/components/ui/scroll-anim";

const ITEMS_PER_PAGE = 4;

export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);

  const selectedArticle = artikelData.find(
    (article) => article.id === activeArticleId,
  );

  const categories = getUniqueCategories(artikelData);
  const filteredData = filterData(artikelData, searchQuery, selectedCategory);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = getTotalPages(filteredData.length, ITEMS_PER_PAGE);
  const currentItems = getPaginatedData(
    filteredData,
    currentPage,
    ITEMS_PER_PAGE,
  );

  const handleOpenArticle = (id: number) => {
    setActiveArticleId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
        {/* NAVBAR SIMPEL (Agar konsisten) */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => setActiveArticleId(null)}
              className="flex items-center text-gray-600 hover:text-purple-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Katalog
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Artikel Magang Berdampak</span>{" "}
              <ChevronRightIcon className="w-4 h-4" />{" "}
              <span className="text-purple-600 font-medium truncate w-32">
                {selectedArticle.category}
              </span>
            </div>
          </div>
        </nav>

        {/* HEADER ARTIKEL */}
        <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            {selectedArticle.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            {selectedArticle.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-200 py-4 mb-8">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-yellow-500" />{" "}
              <span className="font-semibold text-gray-800 mr-1">Penulis:</span>{" "}
              {selectedArticle.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-500" />{" "}
              {selectedArticle.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-500" />{" "}
              {selectedArticle.readTime}
            </div>
            <button className="flex-1 sm:flex-none bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5 mr-2" /> Bagikan
            </button>
          </div>
        </div>

        {/* GAMBAR UTAMA */}
        {/* <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="relative h-64 md:h-125 w-full rounded-2xl overflow-hidden shadow-lg">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}

        {/* ISI KONTEN */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="prose prose-lg prose-blue text-gray-700 leading-relaxed text-justify">
            {/* Karena data dummy berbentuk string panjang, kita pecah berdasarkan paragraf (enter) */}
            {selectedArticle.content.split("\n").map((paragraph, index) => {
              if (paragraph.trim() === "") return null; // Abaikan baris kosong

              // Trik: Jika kalimat pendek (kurang dari 50 huruf), anggap sebagai Sub-judul
              if (paragraph.trim().length < 50 && !paragraph.includes(".")) {
                return (
                  <h3
                    key={index}
                    className="text-2xl font-bold text-gray-900 mt-10 mb-4"
                  >
                    {paragraph}
                  </h3>
                );
              }

              // Jika panjang, anggap paragraf biasa
              return (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* FOOTER ARTIKEL (Aksi) */}
          {/* <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-colors">
                <Share2 className="w-5 h-5 mr-2" /> Bagikan
              </button>
              <button className="flex-1 sm:flex-none bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-colors">
                <Bookmark className="w-5 h-5 mr-2" /> Simpan
              </button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* HEADER PAGE */}
      <div className=" bg-white text-white py-16 px-4 shadow-md">
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
        {/* SIDEBAR KIRI: PANEL PENCARIAN & FILTER */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-purple-600" /> Filter Artikel
            </h3>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
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
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                          {article.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-yellow-500" />{" "}
                          {article.readTime}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenArticle(article.id)}
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
                          onClick={() => handleOpenArticle(article.id)}
                          className="text-purple-700 font-bold text-sm flex items-center cursor-pointer hover:text-purple-900 group-hover:translate-x-1 transition-transform"
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
