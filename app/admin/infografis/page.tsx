"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData, getUniqueCategories1 } from "@/utils/search";
import { InfografisModel } from "@/data/infografis-model";
import { useFetch } from "@/hooks/use-fetch";
import { CheckCircle, Plus, Search, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";

// INTERFACES
interface FormData {
  title: string;
  category: string;
  description: string;
}

export default function InfografisAdmin() {
  // KONFIGURASI
  const currentUser = "Alfian Diva Awangga"; // Simulasi user yang sedang login
  const ITEMS_PER_PAGES = 10; // Konfigurasi jumlah data per halaman pagination

  // Ambil data dari API Route
  const {
    data: dataInfografis,
    isLoading,
    error,
  } = useFetch<InfografisModel>("/api/infografis");

  // STATES
  // States untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Upload File/Gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = getUniqueCategories1(dataInfografis);

  // State untuk Data Form
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
  });

  // KONFIGURASI TABEL
  // cek itemnya milik user atau bukan
  const isAuthor = (item: InfografisModel) => item.author === currentUser;

  // Struktur kolom untuk komponen DataTable
  const kolomInfografis: Column<any>[] = [
    { header: "Judul Infografis", accessorKey: "title" },
    { header: "Kategori", accessorKey: "category", hiddenOnMobile: true },
    {
      header: "Uploader",
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
    { header: "Tanggal", accessorKey: "date", hiddenOnMobile: true },
  ];

  // Data tabel yang sudah difilter
  const filteredData = useMemo(() => {
    return filterTableData(dataInfografis, searchTerm, [
      "title",
      "category",
      "author",
    ]);
  }, [dataInfografis, searchTerm]);

  // EVENT HANDLERS
  const handleEdit = (item: InfografisModel) =>
    console.log("Edit Infografis:", item.id);
  const handleDelete = (item: InfografisModel) =>
    console.log("Hapus Infografis:", item.id);
  const handleInputChange = (field: keyof FormData, value: string) => {
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

  const handleSubmit = async () => {
    if (!selectedFile) return alert("Pilih file dulu!");
    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFile);
    formDataUpload.append("title", formData.title);
    formDataUpload.append("category", formData.category);
    formDataUpload.append("description", formData.description);
    try {
      setUploading(true);
      const res = await fetch("/api/infografis", {
        method: "POST",
        body: formDataUpload,
      });
      const result = await res.json();
      if (result.success) {
        alert("Berhasil upload!");
        setIsModalOpen(false);
        window.location.reload();
      } else {
        alert("Gagal upload");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
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
      {/* HEADER DAN BUTTON TAMBAH */}
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

      {/* BAGIAN TABEL & PENCARIAN */}
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

        {/* KOMPONEN TABEL */}
        <div className="overflow-x-auto">
          <DataTable
            columns={kolomInfografis}
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canAction={isAuthor}
            withPagination={true}
            itemsPerPage={ITEMS_PER_PAGES}
          />
        </div>
      </div>
      {/* FORM TAMBAH INFOGRAFIS */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
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
            {/* <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select> */}
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="Contoh: Kemiskinan, Pendidikan, ..."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
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
        </div>
      </FormModal>
    </div>
  );
}
