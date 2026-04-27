"use client";

import PreviewImage from "@/components/ui/preview-image";
import { FotoModel, fotoData, videoData } from "@/data/dummies";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Camera,
  ExternalLink,
  MapPin,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";

export default function HalamanGaleri() {
  // State utama untuk mengontrol Tab yang sedang aktif
  const [activeTab, setActiveTab] = useState("foto"); // Nilai bisa 'foto' atau 'video'

  // State untuk pop-up gambar penuh
  const [selectedImage, setSelectedImage] = useState<FotoModel | null>(null);

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
              {fotoData.map((foto) => (
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
              {videoData.map((video) => (
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
      <PreviewImage
        item={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
