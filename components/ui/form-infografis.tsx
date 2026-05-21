"use client";

import { AlertCircle, CheckCircle, UploadCloud, X } from "lucide-react";
import { ChangeEvent } from "react";

// Tipe data untuk form
export interface InfografisFormData {
  title: string;
  category: string;
  description: string;
}

interface FormInfografisProps {
  formData: InfografisFormData;
  onChange: (field: keyof InfografisFormData, value: string) => void;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
}

export default function FormInfografis({
  formData,
  onChange,
  previewUrl,
  onFileChange,
  errorMessage,
  setErrorMessage,
}: FormInfografisProps) {
  // Handler untuk validasi file langsung saat dipilih
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validasi Tipe File
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Format file harus berupa JPG atau PNG!");
      e.target.value = ""; // Reset input
      return;
    }

    // 2. Validasi Ukuran File (Maksimal 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrorMessage("Ukuran thumbnail terlalu besar! Maksimal 5MB.");
      e.target.value = ""; // Reset input
      return;
    }

    setErrorMessage("");
    onFileChange(file);
  };

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4 relative animate-in fade-in zoom-in-95 duration-200">
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
          Judul Karya Infografis <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Contoh: Infografis Kemiskinan Ekstrem"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Kategori Utama <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => onChange("category", e.target.value)}
          placeholder="Contoh: Kemiskinan, Pendidikan, ..."
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Deskripsi Infografis <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Ceritakan interpretasi dari infografis yang kamu buat..."
          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Unggah File Infografis <span className="text-red-500">*</span>
        </label>
        <div
          onClick={() => document.getElementById("fileInput")?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-2 text-center transition hover:bg-slate-50 h-56 flex items-center justify-center overflow-hidden"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              onError={(e) => {
                e.currentTarget.src = "/file.svg";
              }}
              className="h-full w-auto object-cover rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">
                Seret file ke sini atau klik untuk mencari
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG atau JPG. Maksimal 5MB
              </p>
            </div>
          )}
        </div>

        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
