"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, X, Copy, Check } from "lucide-react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, url }: ShareDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Latar Belakang Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Kotak Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 z-10"
          >
            {/* Tombol X (Tutup) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 hover:text-gray-800 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ikon Dekorasi */}
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-5">
              <Share2 className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Bagikan Artikel Ini
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Salin tautan di bawah ini untuk membagikan artikel kepada rekan,
              dosen, atau keluarga Anda.
            </p>

            {/* Kolom Tautan & Tombol Salin */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 overflow-hidden">
              <div className="flex-1 px-3 overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={url}
                  className="w-full bg-transparent text-sm text-gray-600 focus:outline-none cursor-text select-all"
                />
              </div>

              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  isCopied
                    ? "bg-yellow-500 text-gray-900 shadow-md shadow-yellow-500/20 transform scale-105"
                    : "bg-purple-900 hover:bg-purple-800 text-white shadow-sm"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" /> Disalin
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" /> Salin
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
