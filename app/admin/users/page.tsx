"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData } from "@/utils/search";
import { useFetch } from "@/hooks/use-fetch";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { UserModel } from "@/data/user-model";
import { useAuth } from "@/hooks/use-auth";
import { useNotification } from "@/hooks/use-notification";
import AlertNotification from "@/components/ui/alert-notification";

// 1. IMPORT KOMPONEN FORM
import FormUser, { UserFormData } from "@/components/ui/form-user";

export default function UserAdmin() {
  const { user } = useAuth();
  const { showAlert, alertType, alertMessage, showNotification } =
    useNotification();
  const ITEMS_PER_PAGES = 10;

  const {
    data: dataUsers,
    isLoading,
    error,
    refetch,
  } = useFetch<UserModel>("/api/users");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingData, setEditingData] = useState<UserModel | null>(null);

  // 2. STATE ERROR MODAL
  const [modalError, setModalError] = useState("");

  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    password: "",
    nama: "",
    role: "mahasiswa",
    status: "active",
  });

  const isAuthor = (item: UserModel) => user?.role === "admin";

  const kolomUsers: Column<UserModel>[] = [
    { header: "Nama", accessorKey: "nama" },
    { header: "Username", accessorKey: "username" },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.role === "admin" ? "bg-yellow-100 text-slate-700" : "bg-purple-100 text-purple-700"}`}
        >
          {item.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      hiddenOnMobile: true,
      cell: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return filterTableData(dataUsers, searchTerm, ["nama", "username", "role"]);
  }, [dataUsers, searchTerm]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingData(null);
    setFormData({
      username: "",
      password: "",
      nama: "",
      role: "mahasiswa",
      status: "active",
    });
    setModalError(""); // Reset error saat form ditutup
  };

  const handleEdit = (item: UserModel) => {
    setEditingData(item);
    setFormData({
      username: item.username,
      password: "",
      nama: item.nama,
      role: item.role as "admin" | "mahasiswa",
      status: item.status as "active" | "inactive",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: UserModel) => {
    // Logika hapus (sama seperti yang Anda buat di infografis)
    console.log("Delete User:", item.id);
  };

  const handleSubmit = async () => {
    setModalError(""); // Bersihkan error sebelum cek ulang

    // 3. VALIDASI FORM USER
    if (!formData.nama.trim() || !formData.username.trim()) {
      setModalError("Mohon lengkapi Nama Lengkap dan Username!");
      return;
    }

    if (!editingData && !(formData.password || "").trim()) {
      setModalError("Password wajib diisi untuk pengguna baru!");
      return;
    }

    try {
      setSubmitting(true);
      const formDataUpload = new FormData();
      if (editingData) formDataUpload.append("id", String(editingData.id));

      formDataUpload.append("username", formData.username);
      formDataUpload.append("nama", formData.nama);
      formDataUpload.append("role", formData.role);
      formDataUpload.append("status", formData.status);

      if (formData.password) {
        formDataUpload.append("password", formData.password);
      }

      const method = editingData ? "PUT" : "POST";
      const response = await fetch("/api/users", {
        method,
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        // Tampilkan success via notification luar karena modal tertutup
        showNotification(
          "success",
          editingData
            ? "User berhasil diperbarui"
            : "User berhasil ditambahkan",
        );
        setIsModalOpen(false);
        resetForm();
        if (refetch) refetch();
      } else {
        setModalError(result.message || "Gagal menyimpan data user");
      }
    } catch (error) {
      console.error(error);
      setModalError("Terjadi kesalahan sistem.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-800"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <title>Admin | Pengguna</title>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Database User</h2>
            <p className="text-sm text-slate-500">
              Kelola akun admin dan mahasiswa.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah User
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
                placeholder="Cari user..."
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
              columns={kolomUsers}
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canAction={isAuthor}
              withPagination={true}
              itemsPerPage={ITEMS_PER_PAGES}
            />
          </div>
        </div>

        {/* 4. MODAL FORM MEMANGGIL KOMPONEN FORM USER */}
        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleSubmit}
          title={editingData ? "Edit User" : "Tambah User"}
          isSubmitting={submitting}
        >
          <FormUser
            formData={formData}
            onChange={handleInputChange}
            isEditing={!!editingData}
            errorMessage={modalError}
            setErrorMessage={setModalError}
          />
        </FormModal>
      </div>
    </>
  );
}
