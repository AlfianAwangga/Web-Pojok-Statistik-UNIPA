"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData, getUniqueCategories1 } from "@/utils/search";
import { artikelData } from "@/data/dummies";
import { ArtikelModel } from "@/data/artikel-model";
import {
  CheckCircle,
  FileText,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useAuth } from "@/hooks/use-auth";
import { useNotification } from "@/hooks/use-notification";
import AlertNotification from "@/components/ui/alert-notification";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";

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
  status: "menunggu" | "disetujui" | "revisi";
  sections: ArticleSection[];
}

export default function ArtikelAdmin() {
  // KONFIGURASI
  const { user } = useAuth();
  const { showAlert, alertType, alertMessage, showNotification } =
    useNotification();
  const {
    isOpen: isDeleteOpen,
    selectedItem: selectedDelete,
    deleting,
    openDelete,
    closeDelete,
    setDeleting,
  } = useDeleteDialog<ArtikelModel>();
  const ITEMS_PER_PAGES = 10; // Konfigurasi jumlah data per halaman pagination

  // Ambil data dari API Route
  const {
    data: dataArtikel,
    isLoading,
    error,
    refetch,
  } = useFetch<ArtikelModel>("/api/artikel");

  // STATES
  // States untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Upload File/Gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Mengambil daftar kategori unik dari data dummy untuk dropdown form
  // const categories = getUniqueCategories1(dataArtikel);

  // State untuk form artikel
  const [editingData, setEditingData] = useState<ArtikelModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    excerpt: "",
    tags: "",
    status: "menunggu",
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
  const isAuthor = (item: ArtikelModel) =>
    item.author === user?.nama || user?.role === "admin";

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
    return filterTableData(dataArtikel, searchTerm, [
      "title",
      "category",
      "author",
    ]);
  }, [dataArtikel, searchTerm]);

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

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      excerpt: "",
      tags: "",
      status: "menunggu",
      sections: [
        {
          id: 1,
          type: "paragraph",
          content: "",
        },
      ],
    });

    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingData(null);
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

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  // Handler Button
  const handleEdit = (item: ArtikelModel) => {
    setEditingData(item);

    setFormData({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      status: item.status,
      sections:
        item.sections?.length > 0
          ? item.sections.map((section) => ({
              id: section.id,
              type: section.type,
              content: section.content,
            }))
          : [
              {
                id: 1,
                type: "paragraph",
                content: "",
              },
            ],
    });

    setPreviewUrl(item.thumbnail || null);
    setSelectedFile(null);

    setIsModalOpen(true);
  };
  const handleDelete = (item: ArtikelModel) => openDelete(item);
  const confirmDelete = async () => {
    if (!selectedDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/artikel?id=${selectedDelete.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        showNotification("success", "Data berhasil dihapus");

        await refetch();
      } else {
        showNotification("error", result.message);
      }
    } catch (error) {
      console.error(error);

      showNotification("error", "Terjadi kesalahan");
    } finally {
      setDeleting(false);

      closeDelete();
    }
  };

  const handleSubmit = async () => {
    // 1. Validasi Dasar
    if (!formData.title.trim()) {
      alert("Judul artikel wajib diisi!");
      return;
    }

    try {
      // 2. Siapkan FormData (Standar untuk kirim file & teks)
      const body = new FormData();

      // Data teks dari state
      if (selectedFile) {
        body.append("file", selectedFile);
      }
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("excerpt", formData.excerpt);
      body.append("author", user!.nama); // Diambil dari variable currentUser di atas
      body.append("tags", formData.tags);
      body.append("status", formData.status);

      // Kirim Array Sections sebagai string JSON
      // Backend akan men-deserialize (JSON.parse) data ini
      body.append("sections", JSON.stringify(formData.sections));

      /* Jika nanti Anda menambahkan input file thumbnail:
         const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
         if (fileInput?.files?.[0]) {
            body.append("thumbnail", fileInput.files[0]);
         }
      */

      // 3. Eksekusi Request ke API Route Next.js
      setIsSubmitting(true);
      const method = editingData ? "PUT" : "POST";
      if (editingData) {
        body.append("id", editingData.id.toString());
      }
      const response = await fetch("/api/artikel", {
        method,
        body,
      });

      const result = await response.json();

      if (result.success) {
        showNotification("success", "Data berhasil ditambahkan");
        setIsModalOpen(false);
        resetForm();
        await refetch();
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilkan efek loading saat data sedang diambil
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
      </div>
    );
  }

  // Tampilkan efek jika error
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

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
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
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

        <AlertNotification
          show={showAlert}
          message={alertMessage}
          type={alertType}
        />

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
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title={
          editingData ? "Edit Artikel Statistik" : "Tambah Artikel Statistik"
        }
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
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="Contoh: Kemiskinan, Pendidikan, ..."
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
              />
              {/* <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select> */}
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

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Unggah Thumbnail
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

              {/* Sembunyikan Input saat gambar dipilih */}
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

            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-700">
                  Jadikan Sebagai Draft
                </p>
                <p className="text-sm text-slate-500">
                  Kamu bisa mengeditnya lagi nanti
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange("status", !formData.status)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  formData.status
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Star className="inline h-4 w-4 mr-1" />
                {formData.status ? "Aktif" : "Nonaktif"}
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
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Hapus Infografis"
        message={`Yakin ingin menghapus "${selectedDelete?.title}"?`}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
