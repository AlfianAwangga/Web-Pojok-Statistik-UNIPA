"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  PlayCircle,
  MapPin,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

interface FotoGaleri {
  id: string;
  url: string;
  caption: string;
  lokasi: string;
  tanggal: string;
}

// --- MOCK DATABASE ---
const DATA_FOTO = [
  {
    id: "F001",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    caption: "Diskusi Verifikasi Data Susenas",
    lokasi: "Ruang Rapat BPS",
    tanggal: "12 April 2026",
  },
  {
    id: "F002",
    url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    caption: "Presentasi Hasil Kajian Infografis",
    lokasi: "Aula Universitas Papua",
    tanggal: "05 April 2026",
  },
  {
    id: "F003",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    caption: "Survei Harga Konsumen (Inflasi)",
    lokasi: "Pasar Wosi, Manokwari",
    tanggal: "28 Mar 2026",
  },
  {
    id: "F004",
    url: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
    caption: "Rapat Evaluasi Akhir Bulan",
    lokasi: "Kantor BPS Papua Barat",
    tanggal: "20 Mar 2026",
  },
  {
    id: "F005",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
    caption: "Bimbingan Teknis Mahasiswa Magang",
    lokasi: "Laboratorium Komputer",
    tanggal: "10 Mar 2026",
  },
  {
    id: "F006",
    url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800",
    caption: "Pengumpulan Data Pertanian",
    lokasi: "Kabupaten Pegunungan Arfak",
    tanggal: "01 Mar 2026",
  },
];

const DATA_VIDEO = [
  {
    id: "V001",
    youtubeId: "dQw4w9WgXcQ", // ID unik YouTube (Contoh)
    title: "Animasi Edukasi: Apa Itu Sensus Penduduk?",
    deskripsi:
      "Video grafis pendek yang menjelaskan pentingnya partisipasi masyarakat dalam sensus 10 tahunan.",
    durasi: "02:45",
  },
  {
    id: "V002",
    youtubeId: "jNQXAC9IVRw",
    title: "Dokumenter Mini: Di Balik Layar Pengumpulan Data",
    deskripsi:
      "Mengikuti perjalanan petugas lapangan BPS menyusuri daerah pelosok Papua Barat untuk mengumpulkan data riil.",
    durasi: "15:20",
  },
  {
    id: "V003",
    youtubeId: "M7lc1UVf-VE",
    title: "Tutorial Membaca Infografis BPS",
    deskripsi:
      "Panduan singkat bagi mahasiswa dan umum cara membaca diagram dan grafik kompleks dari rilis berita resmi statistik.",
    durasi: "05:12",
  },
];

export default function HalamanGaleri() {
  // State utama untuk mengontrol Tab yang sedang aktif
  const [activeTab, setActiveTab] = useState("foto"); // Nilai bisa 'foto' atau 'video'

  // State untuk pop-up gambar penuh
  const [selectedImage, setSelectedImage] = useState<FotoGaleri | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* --- HEADER --- */}
      <div className="bg-white text-white py-16 px-4 border-b-2 border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          {/* <ImageIcon className="w-12 h-12 mx-auto text-yellow-400 mb-4" /> */}
          <h1 className="text-4xl text-gray-900 md:text-5xl font-extrabold mb-4">
            Galeri & <span className="text-purple-800">Videografis</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Dokumentasi kegiatan lapangan dan karya visual dinamis dari
            kolaborasi mahasiswa magang Universitas Papua.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* --- SISTEM NAVIGASI TAB --- */}
        <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row mb-12 border-2 border-gray-100 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab("foto")}
            className={`flex-1 flex items-center justify-center py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${
              activeTab === "foto"
                ? "bg-purple-800 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-purple-700"
            }`}
          >
            <Camera className="w-5 h-5 mr-2" /> Dokumentasi Foto
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 flex items-center justify-center py-3.5 px-6 rounded-xl font-bold transition-all duration-300 ${
              activeTab === "video"
                ? "bg-yellow-500 text-gray-900 shadow-md"
                : "text-gray-500 hover:bg-gray-50 hover:text-yellow-600"
            }`}
          >
            <PlayCircle className="w-5 h-5 mr-2" /> Karya Videografis
          </button>
        </div>

        {/* --- AREA KONTEN UTAMA DENGAN ANIMASI TRANSISI --- */}
        <AnimatePresence mode="wait">
          {/* JIKA TAB FOTO AKTIF */}
          {activeTab === "foto" && (
            <motion.div
              key="konten-foto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {DATA_FOTO.map((foto) => (
                <div
                  key={foto.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setSelectedImage(foto)}
                >
                  {/* Thumbnail dengan efek Zoom saat di-hover */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={foto.url}
                      alt={foto.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay hitam tipis muncul saat di-hover untuk fokus ke teks */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <p className="text-white font-bold mb-2 leading-snug">
                        {foto.caption}
                      </p>
                      <div className="flex items-center text-xs text-gray-300 mb-1">
                        <MapPin className="w-3 h-3 mr-1" /> {foto.lokasi}
                      </div>
                      <div className="flex items-center text-xs text-gray-300">
                        <Calendar className="w-3 h-3 mr-1" /> {foto.tanggal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* JIKA TAB VIDEO AKTIF */}
          {activeTab === "video" && (
            <motion.div
              key="konten-video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6"
            >
              {DATA_VIDEO.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* iFrame YouTube Responsive */}
                  <div className="relative w-full aspect-video bg-black">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight pr-4">
                        {video.title}
                      </h3>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                        {video.durasi}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {video.deskripsi}
                    </p>
                    <a
                      href={`https://youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Buka di YouTube <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- POP-UP GAMBAR (LIGHTBOX) --- */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            {/* Background Hitam Pekat (Klik untuk menutup) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setSelectedImage(null)}
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-5xl z-10 flex flex-col items-center"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl mb-6"
              />

              <div className="text-center text-white bg-black/50 p-4 rounded-xl backdrop-blur-md border border-white/10 w-full max-w-2xl">
                <p className="text-xl font-bold mb-2">
                  {selectedImage.caption}
                </p>
                <div className="flex justify-center items-center gap-6 text-sm text-gray-300">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-yellow-400" />{" "}
                    {selectedImage.lokasi}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-yellow-400" />{" "}
                    {selectedImage.tanggal}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
