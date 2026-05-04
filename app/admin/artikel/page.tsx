"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import {
  filterTableData,
  getUniqueCategories1,
} from "@/components/utils/search";
import { artikelData, ArtikelModel } from "@/data/dummies";
import {
  CheckCircle,
  FileText,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

// INTERFACES
interface ArticleSection {
  id: number;
  type: "subtitle" | "paragraph" | "highlight" | "quote";
  content: string;
}

interface FormData {
  title: string;
  category: string;
  excerpt: string;
  tags: string;
  featured: boolean;
  status: "draft" | "published";
  sections: ArticleSection[];
}

// Mengambil daftar kategori unik dari data dummy untuk dropdown form
const categories = getUniqueCategories1(artikelData);

export default function ArtikelAdmin() {
  // KONFIGURASI
  const currentUser = "Author 1"; // Simulasi user yang sedang login
  const ITEMS_PER_PAGES = 10; // Konfigurasi jumlah data per halaman pagination

  // STATES
  // States untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk form artikel
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: categories[0] || "Umum",
    excerpt: "",
    tags: "",
    featured: false,
    status: "published",
    sections: [
      {
        id: 1,
        type: "paragraph",
        content: "",
      },
    ],
  });

  // KONFIGURASI TABEL
  // cek itemnya milik user atau bukan
  const isAuthor = (item: ArtikelModel) => item.author === currentUser;

  // Struktur kolom untuk komponen DataTable
  const kolomArtikel: Column<any>[] = [
    { header: "Judul Artikel", accessorKey: "title" },
    { header: "Kategori", accessorKey: "category", hiddenOnMobile: true },
    {
      header: "Penulis",
      accessorKey: "author",
      hiddenOnMobile: true,
      cell: (item) => (
        <span
          className={
            isAuthor(item)
              ? "text-purple-600 font-semibold" // Warna ungu dan tebal jika milik sendiri
              : "text-gray-600" // Warna abu-abu standar jika milik orang lain
          }
        >
          {item.author} {isAuthor(item)}
        </span>
      ),
    },
    { header: "Tanggal", accessorKey: "publishDate", hiddenOnMobile: true },
  ];

  // Data tabel yang sudah difilter
  const filteredData = useMemo(() => {
    return filterTableData(artikelData, searchTerm, [
      "title",
      "category",
      "author",
    ]);
  }, [searchTerm]);

  // Handler form section
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          type: "paragraph",
          content: "",
        },
      ],
    }));
  };

  const updateSection = (
    id: number,
    field: "type" | "content",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id
          ? {
              ...section,
              [field]: value,
            }
          : section,
      ),
    }));
  };

  const removeSection = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
    }));
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler Button
  const handleEdit = (item: ArtikelModel) =>
    console.log("Edit Infografis:", item.id);
  const handleDelete = (item: ArtikelModel) =>
    console.log("Hapus Infografis:", item.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Database Artikel
          </h2>
          <p className="text-sm text-slate-500">
            Kelola artikel statistik, draft tulisan, dan publikasi tim.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Artikel Baru
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* KOMPONEN TABEL */}
          <div className="overflow-x-auto">
            <DataTable
              columns={kolomArtikel}
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canAction={isAuthor}
              withPagination={true}
              itemsPerPage={ITEMS_PER_PAGES}
            />
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Artikel Statistik"
      >
        <div className="space-y-6">
          <div className="flex items-start rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p className="text-xs leading-relaxed text-emerald-800">
              Artikel yang dipublikasikan akan langsung tampil pada halaman
              publik Pojok Statistik.
            </p>
          </div>

          {/* Informasi Utama */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">Informasi Utama</h3>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Judul Artikel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Masukkan judul artikel"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Kategori
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
                Ringkasan Artikel
              </label>
              <textarea
                rows={4}
                value={formData.excerpt}
                onChange={(e) => handleInputChange("excerpt", e.target.value)}
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
                <Tag className="h-4 w-4" /> Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="Contoh: inflasi, ekonomi, papua"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-700">Featured Article</p>
                <p className="text-sm text-slate-500">
                  Tampilkan sebagai artikel unggulan
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleInputChange("featured", !formData.featured)
                }
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  formData.featured
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Star className="inline h-4 w-4 mr-1" />
                {formData.featured ? "Aktif" : "Nonaktif"}
              </button>
            </div>
          </div>

          {/* Builder */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800">
              Article Section Builder
            </h3>
            <p className="text-sm text-slate-500">
              Tambahkan subtitle, paragraf, highlight, quote, atau gambar untuk
              membangun isi artikel secara dinamis.
            </p>

            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Section #{index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="rounded-md p-2 text-red-500 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Tipe Section
                    </label>
                    <select
                      value={section.type}
                      onChange={(e) =>
                        updateSection(section.id, "type", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="subtitle">Subtitle</option>
                      <option value="highlight">Highlight Box</option>
                      <option value="quote">Quote</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Isi Konten
                    </label>
                    <textarea
                      rows={4}
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
                className="flex items-center rounded-lg border border-dashed border-purple-300 px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
              >
                <FileText className="mr-2 h-4 w-4" />+ Tambah Section
              </button>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
