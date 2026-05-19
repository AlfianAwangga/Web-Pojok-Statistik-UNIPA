"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData, getUniqueCategories1 } from "@/utils/search";
import { InfografisModel } from "@/data/infografis-model";
import { useFetch } from "@/hooks/use-fetch";
import { CheckCircle, Plus, Search, UploadCloud, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import AlertNotification from "@/components/ui/alert-notification";
import { useNotification } from "@/hooks/use-notification";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useApproveDialog } from "@/hooks/use-approve-dialog";
import { useRevisiDialog } from "@/hooks/use-revisi-dialog";
import RevisiFormContent from "@/components/ui/form-revisi-content";
import PreviewDialog from "@/components/ui/preview-dialog";

// INTERFACES
interface FormData {
  title: string;
  category: string;
  description: string;
}

export default function InfografisAdmin() {
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
  } = useDeleteDialog<InfografisModel>();
  const {
    isOpen: isApproveOpen,
    selectedItem: selectedApprove,
    approving,
    openApprove,
    closeApprove,
    setApproving,
  } = useApproveDialog<InfografisModel>();
  const {
    isOpen: isRevisiOpen,
    selectedItem: selectedRevisi,
    submitting: isRevising,
    openRevisi,
    closeRevisi,
    setSubmitting: setIsRevising,
  } = useRevisiDialog<InfografisModel>();
  const [revisiMessage, setRevisiMessage] = useState("");
  const ITEMS_PER_PAGES = 10; // Konfigurasi jumlah data per halaman pagination

  // Ambil data dari API Route
  const {
    data: dataInfografis,
    isLoading,
    error,
    refetch,
  } = useFetch<InfografisModel>("/api/infografis");

  // STATES
  // States untuk UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InfografisModel | null>(
    null,
  );

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
  const [editingData, setEditingData] = useState<InfografisModel | null>(null);

  // KONFIGURASI TABEL
  // cek itemnya milik user atau bukan
  const isAuthor = (item: InfografisModel) =>
    item.author === user?.nama || user?.role === "admin";

  // Struktur kolom untuk komponen DataTable
  const kolomInfografis: Column<any>[] = [
    {
      header: "Judul Infografis",
      accessorKey: "title",
      cell: (item) => (
        <div className="max-w-50 truncate" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      header: "Uploader",
      accessorKey: "author",
      hiddenOnMobile: true,
      cell: (item) => (
        <span
          className={
            isAuthor(item) ? "text-purple-600 font-semibold" : "text-gray-600"
          }
        >
          {item.author} {isAuthor(item)}
        </span>
      ),
    },
    { header: "Tanggal", accessorKey: "date", hiddenOnMobile: true },
    {
      header: "Status",
      accessorKey: "status",
      hiddenOnMobile: true,
      cell: (item) => {
        if (item.status === "revisi") {
          return (
            <div className="group relative flex items-center gap-1.5 cursor-help w-max">
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Revisi
              </span>
              <Info className="h-4 w-4 text-yellow-600 animate-pulse" />
              <div className="absolute bottom-full left-1/2 z-[99] mb-2 hidden w-64 -translate-x-1/2 flex-col rounded-lg bg-slate-800 p-3 text-left text-xs text-white shadow-xl transition-all group-hover:flex">
                <span className="mb-1 font-semibold text-yellow-400">
                  Catatan Revisi:
                </span>
                <span className="leading-relaxed whitespace-pre-wrap">
                  {item.revisi_msg || "Tidak ada catatan."}
                </span>

                {/* Segitiga kecil panah bawah */}
                <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-slate-800"></div>
              </div>
            </div>
          );
        }
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.status === "menunggu"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      },
    },
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
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
    });

    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingData(null);
  };

  const handleEdit = (item: InfografisModel) => {
    setEditingData(item);

    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
    });

    setPreviewUrl(item.image_url);

    setIsModalOpen(true);
  };

  const handleDelete = (item: InfografisModel) => openDelete(item);
  const confirmDelete = async () => {
    if (!selectedDelete) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/infografis?id=${selectedDelete.id}`, {
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

  // Handler untuk membuka modal dan menyiapkan isi pesan jika sebelumnya sudah ada
  const handleRevisi = (item: InfografisModel) => {
    setRevisiMessage(item.revisi_msg || "");
    openRevisi(item);
  };

  // Handler saat admin menekan tombol submit pada modal revisi
  const submitRevisi = async () => {
    if (!selectedRevisi || !revisiMessage.trim()) return;

    try {
      setIsRevising(true);

      const formData = new FormData();
      formData.append("id", String(selectedRevisi.id));
      formData.append("status", "revisi");
      formData.append("revisi_msg", revisiMessage);

      // Pastikan endpoint API ini sesuai dengan struktur Anda (PATCH ke review handler)
      const res = await fetch("/api/infografis", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        showNotification("success", "Catatan revisi berhasil dikirim!");
        await refetch(); // Segarkan tabel
      } else {
        showNotification("error", result.message);
      }
    } catch (error) {
      showNotification("error", "Terjadi kesalahan server.");
    } finally {
      setIsRevising(false);
      closeRevisi();
    }
  };

  const handleApprove = (item: InfografisModel) => openApprove(item);
  const confirmApprove = async () => {
    if (!selectedApprove) return;

    try {
      setApproving(true); // Memutar loading state di tombol dialog

      const formData = new FormData();
      formData.append("id", String(selectedApprove.id));
      formData.append("status", "disetujui");
      formData.append("revisi_msg", "");

      const res = await fetch("/api/infografis", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        showNotification("success", "Infografis berhasil disetujui!");
        await refetch();
      } else {
        showNotification("error", result.message);
      }
    } catch (error) {
      showNotification("error", "Terjadi kesalahan server.");
    } finally {
      setApproving(false); // Matikan loading
      closeApprove(); // Tutup dialog
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
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
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
    formDataUpload.append("title", formData.title);
    formDataUpload.append("category", formData.category);
    formDataUpload.append("author", user!.nama);
    formDataUpload.append("description", formData.description);

    try {
      setUploading(true);
      const method = editingData ? "PUT" : "POST";
      if (editingData) {
        formDataUpload.append("id", editingData.id.toString());
      }
      const res = await fetch("/api/infografis", {
        method,
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
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
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

        <AlertNotification
          show={showAlert}
          message={alertMessage}
          type={alertType}
        />

        {/* KOMPONEN TABEL */}
        <div className="overflow-x-auto">
          <DataTable
            columns={kolomInfografis}
            data={filteredData}
            onView={(item) => setSelectedItem(item)}
            onEdit={user?.role !== "admin" ? handleEdit : undefined}
            onRevisi={user?.role === "admin" ? handleRevisi : undefined}
            onApprove={user?.role === "admin" ? handleApprove : undefined}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
            canAction={isAuthor}
            withPagination={true}
            itemsPerPage={ITEMS_PER_PAGES}
          />
        </div>
      </div>
      {/* FORM TAMBAH INFOGRAFIS */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        isSubmitting={uploading}
        title={
          editingData ? "Edit Karya Infografis" : "Unggah Karya Infografis"
        }
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
      <FormModal
        isOpen={isRevisiOpen}
        onClose={closeRevisi}
        onSubmit={submitRevisi}
        isSubmitting={isRevising}
        title="Berikan Catatan Revisi"
      >
        <RevisiFormContent
          title={selectedRevisi?.title}
          revisiMessage={revisiMessage}
          setRevisiMessage={setRevisiMessage}
        />
      </FormModal>
      <PreviewDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Hapus Infografis"
        message={`Yakin ingin menghapus "${selectedDelete?.title}"?`}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />
      <ConfirmDialog
        isOpen={isApproveOpen}
        title="Setujui Infografis"
        message={`Setujui dan Publikasikan "${selectedApprove?.title}"?`}
        confirmText="Setujui"
        cancelText="Batal"
        loading={approving}
        variant="success"
        onCancel={closeApprove}
        onConfirm={confirmApprove}
      />
    </div>
  );
}
