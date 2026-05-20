"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  Shield,
  CheckCircle,
  User,
  KeyRound,
  Pencil,
  Check,
} from "lucide-react";
import { useState } from "react";
import FormModal from "@/components/ui/form-modal";
import { useNotification } from "@/hooks/use-notification";
import AlertNotification from "@/components/ui/alert-notification";

export default function ProfilPage() {
  const { user, updateUserSession } = useAuth();
  const { showAlert, alertType, alertMessage, showNotification } =
    useNotification();

  // States untuk Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    password: "",
  });

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-purple-800"></div>
      </div>
    );
  }

  // Fungsi untuk membuka modal dan mengisi data awal
  const handleOpenModal = () => {
    setFormData({
      nama: user.nama,
      username: user.username,
      password: "", // Password dikosongkan untuk alasan keamanan
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const updateData = new FormData();
      updateData.append("id", String(user.id));
      updateData.append("nama", formData.nama);
      updateData.append("username", formData.username);
      updateData.append("role", user.role); // Tetap kirim role lama
      updateData.append("status", user.status);

      // Hanya kirim password jika diisi (tidak kosong)
      if (formData.password.trim() !== "") {
        updateData.append("password", formData.password);
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        body: updateData,
      });

      const result = await response.json();

      if (result.success) {
        showNotification(
          "success",
          "Profil berhasil diperbarui! Silakan login ulang jika diperlukan.",
        );
        updateUserSession({
          nama: formData.nama,
          username: formData.username,
        });
        setIsModalOpen(false);
      } else {
        showNotification("error", result.message);
      }
    } catch (error) {
      console.error(error);
      showNotification("success", "Terjadi kesalahan saat memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const initial = user.nama ? user.nama.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER HALAMAN */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Profil Saya</h2>
        <p className="text-sm text-slate-500">Informasi detail akun Anda.</p>
      </div>

      {/* KARTU PROFIL UTAMA */}
      <div className="max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-purple-800 to-indigo-600"></div>

        <div className="relative px-6 pb-8">
          <div className="absolute -top-12 left-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-4xl font-extrabold text-purple-800 shadow-md">
            {initial}
          </div>

          {/* IDENTITAS DAN TOMBOL EDIT DI DALAM FRAME */}
          <div className="ml-28 pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">{user.nama}</h3>
              <p className="font-medium text-slate-500 flex items-center mt-1">
                <User className="w-4 h-4 mr-1.5" /> @{user.username}
              </p>
            </div>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-purple-700 transition"
            >
              <Pencil className="w-4 h-4" /> Edit Profil
            </button>
          </div>

          <hr className="my-6 border-slate-100" />

          <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
            Informasi Sistem
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Role
                </p>
                <p className="font-bold text-slate-800 capitalize mt-0.5">
                  {user.role}
                </p>
              </div>
            </div>
            {/* Box Status Dinamis */}
            <div
              className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                user.status === "active"
                  ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-200"
                  : "border-red-100 bg-red-50/50 hover:border-red-200"
              }`}
            >
              <div
                className={`rounded-full p-3 ${
                  user.status === "active"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Status Akun
                </p>
                <p
                  className={`font-bold mt-0.5 capitalize ${
                    user.status === "active"
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {user.status === "active" ? "Aktif" : "Nonaktif"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT PROFIL */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Edit Profil"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleInputChange("nama", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password Baru
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Kosongkan jika tidak ingin ganti password"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              * Gunakan minimal 8 karakter dengan kombinasi angka.
            </p>
          </div>
        </div>
      </FormModal>
      <AlertNotification
        show={showAlert}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
