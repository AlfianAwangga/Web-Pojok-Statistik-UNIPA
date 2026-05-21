"use client";

import { CheckCircle, UploadCloud, AlertCircle, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";

// 1. SESUAIKAN INTERFACE DENGAN PROPERTI ASLIMU
export interface FotoFormData {
  caption: string;
  location: string;
}

interface FormFotoProps {
  formData: FotoFormData;
  onChange: (field: keyof FotoFormData, value: string) => void;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
}

export default function FormFoto({
  formData,
  onChange,
  previewUrl,
  onFileChange,
  errorMessage,
  setErrorMessage,
}: FormFotoProps) {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMessage]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Format foto harus berupa JPG atau PNG!");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Ukuran foto terlalu besar! Maksimal 5MB.");
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    onFileChange(file);
  };

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div
          ref={errorRef}
          className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4 relative animate-in fade-in zoom-in-95 duration-200"
        >
          <AlertCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-800 pr-6">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="absolute right-3 top-3.5 text-red-400 hover:text-red-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Keterangan (Caption) <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={formData.caption}
          onChange={(e) => onChange("caption", e.target.value)}
          placeholder="Tuliskan keterangan foto kegiatan ini..."
          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Lokasi Kegiatan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="Contoh: Kantor BPS, Universitas Papua..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Unggah File Foto <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => document.getElementById("fileInputFoto")?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-2 text-center transition hover:bg-slate-50 h-56 flex items-center justify-center overflow-hidden"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-auto object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">
                Seret file ke sini atau klik untuk mencari
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG atau JPG. Maks 5MB
              </p>
            </div>
          )}
        </div>
        <input
          id="fileInputFoto"
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
