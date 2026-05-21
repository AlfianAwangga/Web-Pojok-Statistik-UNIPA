"use client";

import {
  CheckCircle,
  FileText,
  Tag,
  Trash2,
  UploadCloud,
  AlertCircle,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";

export interface ArticleSection {
  id: number;
  type: "subtitle" | "paragraph" | "highlight" | "quote";
  content: string;
}

export interface ArtikelFormData {
  title: string;
  category: string;
  excerpt: string;
  tags: string;
  status: string;
  sections: ArticleSection[];
}

interface FormArtikelProps {
  formData: ArtikelFormData;
  onChange: (field: keyof ArtikelFormData, value: string | boolean) => void;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  addSection: () => void;
  updateSection: (id: number, field: "type" | "content", value: string) => void;
  removeSection: (id: number) => void;
}

export default function FormArtikel({
  formData,
  onChange,
  previewUrl,
  onFileChange,
  errorMessage,
  setErrorMessage,
  addSection,
  updateSection,
  removeSection,
}: FormArtikelProps) {
  // 2. BUAT REF UNTUK MENANDAI ELEMEN ERROR KITA
  const errorRef = useRef<HTMLDivElement>(null);

  // 3. TAMBAHKAN EFEK OTOMATIS SCROLL SAAT ADA ERROR
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      // Akan scroll dengan mulus ke posisi pesan error berada
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMessage]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Format file harus berupa JPG atau PNG!");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Ukuran thumbnail terlalu besar! Maksimal 5MB.");
      e.target.value = "";
      return;
    }

    setErrorMessage("");
    onFileChange(file);
  };

  return (
    <div className="space-y-6">
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
      {/* Informasi Utama */}
      <div className="space-y-4 rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800">Informasi Utama</h3>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Judul Artikel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Masukkan judul artikel"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Kategori <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="Contoh: Kemiskinan, Pendidikan, ..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Ringkasan Artikel <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.excerpt}
            onChange={(e) => onChange("excerpt", e.target.value)}
            placeholder="Ringkasan singkat artikel"
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-4 rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800">Metadata Artikel</h3>
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Tag className="h-4 w-4" /> Tags{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => onChange("tags", e.target.value)}
            placeholder="Contoh: inflasi, ekonomi, papua"
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Unggah Thumbnail <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => document.getElementById("fileInputArtikel")?.click()}
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
                  PNG atau JPG. Maks. 5MB
                </p>
              </div>
            )}
          </div>
          <input
            id="fileInputArtikel"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Builder */}
      <div className="space-y-4 rounded-xl border border-slate-200 p-5">
        <h3 className="font-bold text-slate-800">
          Article Section Builder <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-slate-500">
          Tambahkan section untuk membangun isi artikel secara dinamis.
        </p>

        <div className="space-y-4">
          {formData.sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-xl border border-slate-200 p-4 space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">
                  Section #{index + 1}
                </p>
                {formData.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <select
                  value={section.type}
                  onChange={(e) =>
                    updateSection(section.id, "type", e.target.value)
                  }
                  className="w-full mb-2 rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="subtitle">Subtitle</option>
                  <option value="highlight">Highlight Box</option>
                  <option value="quote">Quote</option>
                </select>
                <textarea
                  rows={3}
                  value={section.content}
                  onChange={(e) =>
                    updateSection(section.id, "content", e.target.value)
                  }
                  placeholder="Tulis isi section di sini..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="flex w-full justify-center items-center rounded-lg border border-dashed border-purple-300 px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
          >
            <FileText className="mr-2 h-4 w-4" />+ Tambah Section
          </button>
        </div>
      </div>
    </div>
  );
}
