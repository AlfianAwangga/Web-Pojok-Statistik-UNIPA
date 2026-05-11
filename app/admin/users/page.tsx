"use client";

import { Column, DataTable } from "@/components/ui/data-table";
import FormModal from "@/components/ui/form-modal";
import { filterTableData } from "@/utils/search";
import { useFetch } from "@/hooks/use-fetch";
import { CheckCircle, Plus, Search, Shield, User } from "lucide-react";
import { useMemo, useState } from "react";
import { UserModel } from "@/data/user-model";
import { useAuth } from "@/hooks/use-auth";

interface FormData {
  username: string;
  password: string;
  nama: string;
  role: "admin" | "mahasiswa";
  status: "active" | "inactive";
}

export default function UserAdmin() {
  // KONFIGURASI
  const { user } = useAuth();
  const ITEMS_PER_PAGES = 10;

  // FETCH DATA
  const {
    data: dataUsers,
    isLoading,
    error,
  } = useFetch<UserModel>("/api/users");

  // STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // FORM DATA
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    nama: "",
    role: "mahasiswa",
    status: "active",
  });

  // TABLE COLUMN
  const isAuthor = (item: UserModel) => user?.role === "admin";

  const kolomUsers: Column<UserModel>[] = [
    {
      header: "Nama",
      accessorKey: "nama",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.role === "admin"
              ? "bg-yellow-100 text-slate-700"
              : "bg-purple-100 text-purple-700"
          }`}
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
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.status === "active"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  // FILTER DATA
  const filteredData = useMemo(() => {
    return filterTableData(dataUsers, searchTerm, ["nama", "username", "role"]);
  }, [dataUsers, searchTerm]);

  // INPUT HANDLER
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ACTIONS
  const handleEdit = (item: UserModel) => {
    console.log("Edit User:", item.id);
  };

  const handleDelete = (item: UserModel) => {
    console.log("Delete User:", item.id);
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formDataUpload = new FormData();
      formDataUpload.append("username", formData.username);
      formDataUpload.append("password", formData.password);
      formDataUpload.append("nama", formData.nama);
      formDataUpload.append("role", formData.role);
      formDataUpload.append("status", formData.status);

      const response = await fetch("/api/users", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        alert("User berhasil ditambahkan");
        setIsModalOpen(false);

        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-800"></div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Database User</h2>

          <p className="text-sm text-slate-500">
            Kelola akun admin dan mahasiswa.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-lg bg-purple-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-900">
        {/* SEARCH */}
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

        {/* DATATABLE */}
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

      {/* MODAL */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Tambah User"
      >
        <div className="space-y-5">
          {/* ALERT */}
          <div className="flex items-start rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

            <p className="text-xs leading-relaxed text-emerald-800">
              User yang ditambahkan akan langsung dapat login ke dashboard
              sistem.
            </p>
          </div>

          {/* NAMA */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Nama Lengkap
            </label>

            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>

          {/* USERNAME */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Username
            </label>

            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Masukkan username"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Role User
            </label>

            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            >
              <option value="mahasiswa">Mahasiswa</option>

              <option value="admin">Admin</option>
            </select>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Status Akun
            </label>

            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            >
              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
