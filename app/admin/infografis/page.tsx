"use client";

import FormModal from "@/components/ui/form-modal";
import {
  filterTableData,
  getUniqueCategories1,
} from "@/components/utils/search";
import { infografisData } from "@/data/dummies";
import {
  CheckCircle,
  Edit,
  Plus,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";

interface FormData {
  title: string;
  category: string;
  description: string;
}

const categories = getUniqueCategories1(infografisData);

export default function InfografisAdmin() {
  const currentUser = "Author 1";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: categories[0],
    description: "",
  });

  const filteredData = useMemo(() => {
    return filterTableData(infografisData, searchTerm, [
      "title",
      "category",
      "author",
    ]);
  }, [searchTerm]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Database Infografis
          </h2>
          <p className="text-sm text-slate-500">
            Kelola karyamu dan pantau publikasi rekan-rekan magang lainnya.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Unggah Karya Baru
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari karya..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                {/* Lebar sama rata */}
                <th className="w-1/5 px-6 py-4 font-semibold">Karya</th>

                <th className="hidden md:table-cell w-1/5 px-6 py-4 font-semibold">
                  Kategori
                </th>

                <th className="w-1/5 px-6 py-4 font-semibold">Penulis</th>

                <th className="hidden md:table-cell w-1/5 px-6 py-4 font-semibold">
                  Tanggal
                </th>

                <th className="w-1/5 px-6 py-4 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  {/* KARYA */}
                  <td className="w-1/5 px-6 py-4">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.title}
                    </p>
                  </td>

                  {/* KATEGORI */}
                  <td className="hidden md:table-cell w-1/5 px-6 py-4">
                    <p className="truncate text-sm text-slate-600">
                      {item.category}
                    </p>
                  </td>

                  {/* PENULIS */}
                  <td className="w-1/5 px-6 py-4">
                    <p
                      className={`truncate text-sm font-semibold ${
                        item.author === currentUser
                          ? "text-purple-600"
                          : "text-slate-600"
                      }`}
                    >
                      {item.author}
                      {item.author === currentUser}
                    </p>
                  </td>

                  {/* TANGGAL */}
                  <td className="hidden md:table-cell w-1/5 px-6 py-4">
                    <p className="truncate text-sm text-slate-600">
                      {item.date}
                    </p>
                  </td>

                  {/* AKSI */}
                  <td className="w-1/5 px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {item.author === currentUser ? (
                        <>
                          <button
                            title="Edit Karya"
                            className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            title="Hapus"
                            className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="truncate px-2 text-xs italic text-slate-400">
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

      {/* Form Tambah Infografis */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Unggah Karya Infografis"
      >
        <div className="space-y-5">
          <div className="flex items-start rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-xs leading-relaxed text-emerald-800">
              Infografis yang kamu unggah di sini akan{" "}
              <strong>langsung terpublikasi</strong>
              &nbsp;ke halaman utama website publik Pojok Statistik.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Judul Karya Infografis
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Contoh: Infografis Kemiskinan Ekstrem"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Kategori Utama
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Deskripsi Infografis
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Ceritakan interpretasi dari infografis yang kamu buat..."
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Unggah File Infografis
            </label>

            <div className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:bg-slate-50">
              <UploadCloud className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">
                Seret file ke sini atau klik untuk mencari
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG atau JPG, resolusi tinggi. Maks. 5MB
              </p>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
