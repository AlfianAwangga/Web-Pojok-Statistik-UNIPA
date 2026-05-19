"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "success"; // TAMBAHAN: Prop untuk mengatur warna/ikon
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Konfirmasi Hapus",
  message = "Apakah kamu yakin ingin menghapus data ini?",
  confirmText = "Hapus",
  cancelText = "Batal",
  loading = false,
  variant = "danger", // Default tetap danger agar tidak merusak fitur Hapus yang sudah ada
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  // Tentukan styling berdasarkan variant
  const isSuccess = variant === "success";

  const iconBg = isSuccess ? "bg-emerald-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-emerald-600" : "text-red-600";
  const buttonBg = isSuccess
    ? "bg-emerald-600 hover:bg-emerald-700"
    : "bg-red-600 hover:bg-red-700";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-3 ${iconBg}`}>
              {isSuccess ? (
                <CheckCircle className={`h-6 w-6 ${iconColor}`} />
              ) : (
                <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-800">{title}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${buttonBg}`}
            >
              {loading ? "Memproses..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
