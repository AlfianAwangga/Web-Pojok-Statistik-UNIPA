"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData, getUniqueCategories1 } from "@/utils/search";
import { InfografisModel } from "@/data/infografis-model";
import { useFetch } from "@/hooks/use-fetch";
import { Plus, Search, Info } from "lucide-react";
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

// 1. IMPORT KOMPONEN BARU
import FormInfografis, {
  InfografisFormData,
} from "@/components/ui/form-infografis";

export default function InfografisAdmin() {
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
  const ITEMS_PER_PAGES = 10;

  const {
    data: dataInfografis,
    isLoading,
    error,
    refetch,
  } = useFetch<InfografisModel>("/api/infografis");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<InfografisModel | null>(
    null,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modalError, setModalError] = useState("");

  // 2. STATE FORM DATA MENGGUNAKAN INTERFACE DARI KOMPONEN BARU
  const [formData, setFormData] = useState<InfografisFormData>({
    title: "",
    category: "",
    description: "",
  });
  const [editingData, setEditingData] = useState<InfografisModel | null>(null);

  const isAuthor = (item: InfografisModel) =>
    item.author === user?.nama || user?.role === "admin";

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
          {item.author}
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
                <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-slate-800"></div>
              </div>
            </div>
          );
        }
        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "menunggu" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      },
    },
  ];

  const filteredData = useMemo(() => {
    return filterTableData(dataInfografis, searchTerm, [
      "title",
      "category",
      "author",
    ]);
  }, [dataInfografis, searchTerm]);

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "" });
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

  const handleRevisi = (item: InfografisModel) => {
    setRevisiMessage(item.revisi_msg || "");
    openRevisi(item);
  };
  const submitRevisi = async () => {
    if (!selectedRevisi || !revisiMessage.trim()) return;

    try {
      setIsRevising(true);

      const formData = new FormData();
      formData.append("id", String(selectedRevisi.id));
      formData.append("status", "revisi");
      formData.append("revisi_msg", revisiMessage);

      const res = await fetch("/api/infografis", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        showNotification("success", "Catatan revisi berhasil dikirim!");
        await refetch();
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
      setApproving(true);

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

  const handleInputChange = (
    field: keyof InfografisFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    // 3. VALIDASI FORM KOSONG
    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.description.trim()
    ) {
      setModalError("Mohon lengkapi semua kolom form!");
      return;
    }

    if (!selectedFile && !editingData) {
      setModalError("Pilih file infografis terlebih dahulu!");
      return;
    }

    const formDataUpload = new FormData();
    if (selectedFile) formDataUpload.append("file", selectedFile);
    formDataUpload.append("title", formData.title);
    formDataUpload.append("category", formData.category);
    formDataUpload.append("author", user!.nama);
    formDataUpload.append("description", formData.description);

    try {
      setUploading(true);
      const method = editingData ? "PUT" : "POST";
      if (editingData) formDataUpload.append("id", editingData.id.toString());

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
      showNotification("error", "Terjadi kesalahan sistem");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-800"></div>
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <title>Admin | Infografis</title>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* HEADER */}
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
            <Plus className="mr-2 h-4 w-4" /> Unggah Karya Baru
          </button>
        </div>

        {/* TABEL */}
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
          <FormInfografis
            formData={formData}
            onChange={handleInputChange}
            previewUrl={previewUrl}
            onFileChange={handleFileChange}
            errorMessage={modalError}
            setErrorMessage={setModalError}
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
    </>
  );
}
