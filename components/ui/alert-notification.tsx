"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface AlertNotificationProps {
  type?: "success" | "error";
  message: string;
  show: boolean;
}

export default function AlertNotification({
  type = "success",
  message,
  show,
}: AlertNotificationProps) {
  if (!show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-white transition-all duration-300 ${
        type === "success" ? "bg-emerald-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}

      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
