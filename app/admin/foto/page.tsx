"use client";

import AlertNotification from "@/components/ui/alert-notification";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import PreviewImage from "@/components/ui/preview-image";
import { FotoModel } from "@/data/foto-model";
import { UserModel } from "@/data/user-model";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useFetch } from "@/hooks/use-fetch";
import { useNotification } from "@/hooks/use-notification";
import { filterTableData } from "@/utils/search";
import { CheckCircle, Plus, Search, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// INTERFACES
interface FormData {
  caption: string;
  location: string;
}

export default function DokumentasiAdmin() {
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
  } = useDeleteDialog<FotoModel>();
  const ITEMS_PER_PAGES = 10; // Konfigurasi jumlah data per halaman pagination

  // Ambil data dari API Route
  const {
    data: dataFoto,
    isLoading,
    error,
    refetch,
  } = useFetch<FotoModel>("/api/foto");

  // STATES
  // States untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<FotoModel | null>(null);

  // State untuk form artikel
  const [editingData, setEditingData] = useState<FotoModel | null>(null);
  const [formData, setFormData] = useState<FormData>({
    caption: "",
    location: "",
  });

  // State untuk Upload File/Gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // KONFIGURASI TABEL
  // cek itemnya milik user atau bukan
  const isAuthor = (item: FotoModel) =>
    item.uploader === user?.nama || user?.role === "admin";

  // Struktur kolom untuk komponen DataTable
  const kolomFoto: Column<any>[] = [
    {
      header: "Nama Foto",
      accessorKey: "caption",
      cell: (item) => (
        <div className="max-w-50 truncate" title={item.caption}>
          {item.caption}
        </div>
      ),
    },
    { header: "Lokasi", accessorKey: "lokasi", hiddenOnMobile: true },
    {
      header: "Uploader",
      accessorKey: "uploader",
      hiddenOnMobile: true,
      cell: (item) => (
        <span
          className={
            isAuthor(item)
              ? "text-purple-600 font-semibold" // Warna ungu dan tebal jika milik sendiri
              : "text-gray-600" // Warna abu-abu standar jika milik orang lain
          }
        >
          {item.uploader} {isAuthor(item)}
        </span>
      ),
    },
    { header: "Tanggal", accessorKey: "upload_date", hiddenOnMobile: true },
  ];

  // Data tabel yang sudah difilter
  const filteredData = useMemo(() => {
    return filterTableData(dataFoto, searchTerm, ["caption", "lokasi"]);
  }, [dataFoto, searchTerm]);

  // EVENT HANDLERS
  const resetForm = () => {
    setFormData({
      caption: "",
      location: "",
    });

    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingData(null);
  };

  const handleSubmit = async () => {
    // validasi file hanya saat create
    if (!selectedFile && !editingData) {
      showNotification("error", "Pilih file dulu!");

      return;
    }

    const formDataUpload = new FormData();
    // append file hanya jika ada
    if (selectedFile) {
      formDataUpload.append("file", selectedFile);
    }
    formDataUpload.append("uploader", user!?.nama);
    formDataUpload.append("caption", formData.caption);
    formDataUpload.append("location", formData.location);
    try {
      setUploading(true);
      const method = editingData ? "PUT" : "POST";
      if (editingData) {
        formDataUpload.append("id", editingData.id.toString());
      }
      const res = await fetch("/api/foto", {
        method: method,
        body: formDataUpload,
      });
      const result = await res.json();
      if (result.success) {
        showNotification(
          "success",
          editingData
            ? "Data berhasil diperbarui"
            : "Data berhasil ditambahkan",
        );
        setIsModalOpen(false);
        resetForm();
        await refetch();
      } else {
        showNotification("error", result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
      showNotification("error", "Terjadi kesalahan");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: FotoModel) => {
    setEditingData(item);
    console.log(item);

    setFormData({
      caption: item.caption,
      location: item.lokasi,
    });

    setPreviewUrl(item.image_url);

    setIsModalOpen(true);
  };
  const handleDelete = (item: FotoModel) => openDelete(item);
  const confirmDelete = async () => {
    if (!selectedDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/foto?id=${selectedDelete.id}`, {
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
    <>
      <title>Admin | Foto</title>
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
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
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
          <AlertNotification
            show={showAlert}
            message={alertMessage}
            type={alertType}
          />

          <div className="overflow-x-auto">
            {/* KOLOM TABEL */}
            <DataTable
              columns={kolomFoto}
              data={filteredData}
              onView={(item) => setSelectedItem(item)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canAction={isAuthor}
              withPagination={true}
              itemsPerPage={ITEMS_PER_PAGES}
            />
          </div>
        </div>

        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleSubmit}
          isSubmitting={uploading}
          title={
            editingData ? "Edit Foto Dokumentasi" : "Tambah Data Dokumentasi"
          }
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
                value={formData.caption}
                onChange={(e) => handleInputChange("caption", e.target.value)}
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
                Unggah Dokumentasi
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
                      console.log("Gagal load image");
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
        <PreviewImage
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
        <ConfirmDialog
          isOpen={isDeleteOpen}
          title="Hapus Foto"
          message={`Yakin ingin menghapus "${selectedDelete?.caption}"?`}
          onCancel={closeDelete}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      </div>
    </>
  );
}
