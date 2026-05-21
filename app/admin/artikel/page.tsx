"use client";

import AlertNotification from "@/components/ui/alert-notification";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Column, DataTable } from "@/components/ui/data-table";
import FormArtikel, { ArtikelFormData } from "@/components/ui/form-artikel";
import FormModal from "@/components/ui/form-modal";
import RevisiFormContent from "@/components/ui/form-revisi-content";
import { ArtikelModel } from "@/data/artikel-model";
import { useApproveDialog } from "@/hooks/use-approve-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useFetch } from "@/hooks/use-fetch";
import { useNotification } from "@/hooks/use-notification";
import { useRevisiDialog } from "@/hooks/use-revisi-dialog";
import { filterTableData } from "@/utils/search";
import { Info, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ArtikelAdmin() {
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
  const {
    isOpen: isApproveOpen,
    selectedItem: selectedApprove,
    approving,
    openApprove,
    closeApprove,
    setApproving,
  } = useApproveDialog<ArtikelModel>();
  const {
    isOpen: isRevisiOpen,
    selectedItem: selectedRevisi,
    submitting: isRevising,
    openRevisi,
    closeRevisi,
    setSubmitting: setIsRevising,
  } = useRevisiDialog<ArtikelModel>();

  const [revisiMessage, setRevisiMessage] = useState("");
  const ITEMS_PER_PAGES = 10;
  const router = useRouter();

  const {
    data: dataArtikel,
    isLoading,
    error,
    refetch,
  } = useFetch<ArtikelModel>("/api/artikel");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ArtikelModel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");
  const [formData, setFormData] = useState<ArtikelFormData>({
    title: "",
    category: "",
    excerpt: "",
    tags: "",
    status: "menunggu",
    sections: [{ id: 1, type: "paragraph", content: "" }],
  });

  // KONFIGURASI TABEL
  // cek itemnya milik user atau bukan
  const isAuthor = (item: ArtikelModel) =>
    item.author === user?.nama || user?.role === "admin";

  // Struktur kolom untuk komponen DataTable
  const kolomArtikel: Column<any>[] = [
    {
      header: "Judul Artikel",
      accessorKey: "title",
      cell: (item) => (
        <div className="max-w-50 truncate" title={item.title}>
          {item.title}
        </div>
      ),
    },
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
    setModalError("");
  };

  const handleOpenArticle = (slug: string) => {
    router.push(`/artikel/${slug}`);
  };

  const handleInputChange = (
    field: keyof ArtikelFormData,
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

  // Handler untuk membuka modal dan menyiapkan isi pesan jika sebelumnya sudah ada
  const handleRevisi = (item: ArtikelModel) => {
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
      const res = await fetch("/api/artikel", {
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

  const handleApprove = (item: ArtikelModel) => openApprove(item);
  const confirmApprove = async () => {
    if (!selectedApprove) return;

    try {
      setApproving(true); // Memutar loading state di tombol dialog

      const formData = new FormData();
      formData.append("id", String(selectedApprove.id));
      formData.append("status", "disetujui");
      formData.append("revisi_msg", "");

      const res = await fetch("/api/artikel", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        showNotification("success", "Artikel berhasil disetujui!");
        await refetch();
      } else {
        showNotification("error", result.message);
      }
    } catch (error) {
      showNotification("error", "Terjadi kesalahan server.");
    } finally {
      setApproving(false);
      closeApprove();
    }
  };

  const handleSubmit = async () => {
    // 1. Validasi Dasar
    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.excerpt.trim() ||
      !formData.tags.trim()
    ) {
      setModalError("Mohon lengkapi semua kolom Informasi Utama dan Metadata!");
      return;
    }

    if (formData.sections.some((sec) => !sec.content.trim())) {
      setModalError(
        "Isi konten pada semua Section Builder tidak boleh kosong!",
      );
      return;
    }

    if (!selectedFile && !editingData) {
      setModalError("Pilih gambar Thumbnail Artikel terlebih dahulu!");
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
        showNotification(
          "success",
          editingData
            ? "Artikel berhasil diperbarui"
            : "Artikel berhasil ditambahkan",
        );
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
    <>
      <title>Admin | Artikel</title>
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
                onView={(item) => handleOpenArticle(item.slug)}
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
          <FormArtikel
            formData={formData}
            onChange={handleInputChange}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            errorMessage={modalError}
            setErrorMessage={setModalError}
            addSection={addSection}
            updateSection={updateSection}
            removeSection={removeSection}
          />
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
        <ConfirmDialog
          isOpen={isDeleteOpen}
          title="Hapus Artikel"
          message={`Yakin ingin menghapus artikel"${selectedDelete?.title}"?`}
          onCancel={closeDelete}
          onConfirm={confirmDelete}
          loading={deleting}
          variant="danger"
        />
        <ConfirmDialog
          isOpen={isApproveOpen}
          title="Setujui Artikel"
          message={`Setujui dan Publikasikan "${selectedApprove?.title}"?`}
          confirmText="Setujui"
          cancelText="Batal"
          loading={approving}
          variant="success"
          onCancel={closeApprove}
          onConfirm={confirmApprove}
        />
      </div>
    </>
  );
}
