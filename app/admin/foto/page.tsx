"use client";

import { useMemo, useState } from "react";
import FormModal from "@/components/ui/form-modal";
import {
  CheckCircle,
  Edit,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  filterTableData,
  getUniqueCategories1,
} from "@/components/utils/search";
import { fotoData } from "@/data/dummies";

interface FormData {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
}

// const categories = getUniqueCategories1(fotoData);

export default function DokumentasiAdmin() {
  const currentUser = "Author 1";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    location: "",
    description: "",
    imageUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const filteredData = useMemo(() => {
    return filterTableData(fotoData, searchTerm, ["caption", "lokasi"]);
  }, [searchTerm]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);

    // preview image
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Database Foto Dokumentasi
          </h2>
          <p className="text-sm text-slate-500">
            Kelola dokumentasi kegiatan dan publikasi galeri website.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 active:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Dokumentasi
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900">
        <div className="border-b border-slate-100 bg-slate-50 p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari dokumentasi..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th className="w-2/5 px-6 py-4 font-semibold">Judul Foto</th>
                <th className="hidden md:table-cell w-1/6 px-6 py-4 font-semibold">
                  Lokasi
                </th>
                <th className="hidden md:table-cell w-1/6 px-6 py-4 font-semibold">
                  Penulis
                </th>
                <th className="w-1/6 px-6 py-4 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.caption}
                    </p>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <p className="truncate text-sm text-slate-600">
                      {item.lokasi}
                    </p>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4">
                    <p
                      className={`truncate text-sm font-semibold ${
                        item.uploader === currentUser
                          ? "text-purple-600"
                          : "text-slate-600"
                      }`}
                    >
                      {item.uploader}
                      {item.uploader === currentUser}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {item.uploader === currentUser ? (
                        <>
                          <button className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="rounded-md p-2 text-red-500 transition hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs italic text-slate-400">
                          Hanya lihat
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Foto Dokumentasi"
      >
        <div className="space-y-5">
          <div className="flex items-start rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-xs leading-relaxed text-emerald-800">
              Dokumentasi yang ditambahkan akan langsung tampil pada galeri
              publik website.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Judul Dokumentasi
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contoh: Kegiatan Pembinaan Statistik Sektoral"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* <div className="grid gap-4 md:grid-cols-2"> */}
          {/* <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div> */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Lokasi Kegiatan
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Contoh: Manokwari"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {/* </div> */}

          {/* <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Deskripsi Singkat
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tuliskan deskripsi singkat dokumentasi kegiatan..."
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div> */}

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Unggah File Infografis
            </label>

            <div
              onClick={() => document.getElementById("fileInput")?.click()}
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
                    PNG atau JPG, resolusi tinggi. Maks. 5MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
