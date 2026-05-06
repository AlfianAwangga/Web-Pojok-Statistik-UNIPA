"use client";

// import { InfografisModel } from "@/data/dummies";
import { imageDownloader } from "@/components/utils/download";
import { InfografisModel } from "@/data/infografis-model";
import { AnimatePresence, motion } from "framer-motion";
import { X, Download, User, Calendar, MapPin, Info } from "lucide-react";
import Image from "next/image";

interface PreviewDialogProps {
  item: InfografisModel | null;
  onClose: () => void;
}

export default function PreviewDialog({ item, onClose }: PreviewDialogProps) {
  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Kotak Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-10/12 h-11/12 md:h-auto md:max-h-[90vh] md:max-w-7xl bg-white md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10"
          >
            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* KIRI: Gambar */}
            <div className="w-full md:w-[60%] bg-gray-100 flex items-center justify-center p-4 md:p-6">
              <Image
                src={item.image_url}
                alt={item.title}
                width={1000}
                height={1000}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain drop-shadow-xl"
              />
            </div>

            {/* KANAN: Detail */}
            <div className="w-full h-[35vh] md:h-auto md:w-[40%] bg-white flex flex-col border-l border-gray-100">
              {/* Header Info */}
              <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-gray-400 text-sm font-mono">
                    {item.id}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-950 leading-tight">
                  {item.title}
                </h2>
              </div>

              {/* Metadata & Deskripsi */}
              <div className="p-6 md:p-8 overflow-y-auto grow">
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 space-y-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <User className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="w-32 font-semibold">Disusun oleh:</span>
                    {item.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="w-32 font-semibold">Diunggah pada:</span>
                    {item.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                    <span className="w-32 font-semibold">Cakupan Data:</span>
                    {item.category}
                  </div>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-yellow-500" /> Narasi Data
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Footer Tombol Unduh */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <button
                  onClick={() =>
                    imageDownloader(item.drive_image_id, item.title)
                  }
                  className="w-full bg-purple-900 hover:bg-purple-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5 mr-2 text-yellow-400" />
                  Unduh Infografis HD
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
