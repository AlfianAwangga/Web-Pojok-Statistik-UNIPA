"use client";

interface RevisiFormContentProps {
  title?: string;
  revisiMessage: string;
  setRevisiMessage: (value: string) => void;
}

export default function RevisiFormContent({
  title,
  revisiMessage,
  setRevisiMessage,
}: RevisiFormContentProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
        <p className="text-sm text-amber-800">
          Kirimkan catatan perbaikan untuk: <br />
          <span className="font-bold">"{title}"</span>
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Catatan Revisi <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={revisiMessage}
          onChange={(e) => setRevisiMessage(e.target.value)}
          placeholder="Contoh: Tolong perbaiki warna pada grafik batang..."
          className="w-full resize-none rounded-lg text-slate-500 border border-slate-200 p-3 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>
    </div>
  );
}
