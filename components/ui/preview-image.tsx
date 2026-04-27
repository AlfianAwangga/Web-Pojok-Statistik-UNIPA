"use client";
import { FotoModel } from "@/data/dummies";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

interface prevImageProps {
  item: FotoModel | null;
  onClose: () => void;
}

export default function previewImage({ item, onClose }: prevImageProps) {
  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          {/* Background Hitam Pekat (Klik untuk menutup) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            onClick={onClose}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-5xl z-10 flex flex-col items-center"
          >
            <img
              src={item.url}
              alt={item.caption}
              className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl mb-6"
            />

            <div className="text-center text-white bg-black/50 p-4 rounded-xl backdrop-blur-md border border-white/10 w-full max-w-2xl">
              <p className="text-xl font-bold mb-2">{item.caption}</p>
              <div className="flex justify-center items-center gap-6 text-sm text-gray-300">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-yellow-400" />{" "}
                  {item.lokasi}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-yellow-400" />{" "}
                  {item.tanggal}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
