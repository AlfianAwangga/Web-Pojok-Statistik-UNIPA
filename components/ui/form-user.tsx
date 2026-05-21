"use client";

import { CheckCircle, AlertCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";

// 1. Definisikan Interface Form
export interface UserFormData {
  username: string;
  password?: string;
  nama: string;
  role: "admin" | "mahasiswa";
  status: "active" | "inactive";
}

interface FormUserProps {
  formData: UserFormData;
  onChange: (field: keyof UserFormData, value: string) => void;
  isEditing: boolean;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
}

export default function FormUser({
  formData,
  onChange,
  isEditing,
  errorMessage,
  setErrorMessage,
}: FormUserProps) {
  const errorRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke error jika muncul
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMessage]);

  return (
    <div className="space-y-5">
      {/* TAMPILAN ERROR MODAL */}
      {errorMessage && (
        <div
          ref={errorRef}
          className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4 relative animate-in fade-in zoom-in-95 duration-200"
        >
          <AlertCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-medium text-red-800 pr-6">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="absolute right-3 top-3.5 text-red-400 hover:text-red-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Info Box hanya muncul saat tambah user baru */}
      {!isEditing && (
        <div className="flex items-start rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-xs leading-relaxed text-emerald-800">
            User yang ditambahkan akan langsung dapat login ke dashboard sistem.
          </p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => onChange("nama", e.target.value)}
          placeholder="Masukkan nama lengkap"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="Masukkan username"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">
          Password {!isEditing && <span className="text-red-500">*</span>}
        </label>
        <input
          type="password"
          value={formData.password || ""}
          onChange={(e) => onChange("password", e.target.value)}
          placeholder={
            isEditing ? "Kosongkan jika tidak diubah" : "Masukkan password"
          }
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
        />
        {isEditing && (
          <p className="mt-1 text-xs text-slate-500">
            * Kosongkan field ini jika tidak ingin mengubah password.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Role User <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              onChange("role", e.target.value as "admin" | "mahasiswa")
            }
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
          >
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">
            Status Akun <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              onChange("status", e.target.value as "active" | "inactive")
            }
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-slate-700"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
