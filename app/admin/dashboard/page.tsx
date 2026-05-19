"use client";

import { ArtikelModel } from "@/data/artikel-model";
import { FotoModel } from "@/data/foto-model";
import { InfografisModel } from "@/data/infografis-model";
import { UserModel } from "@/data/user-model";
import { useAuth } from "@/hooks/use-auth";
import { useFetch } from "@/hooks/use-fetch";
import {
  getMyInfografisCount,
  getMyArtikelCount,
  getMyPhotoCount,
} from "@/utils/dashboard-services";
import {
  AlertTriangle,
  BookAIcon,
  BookOpen,
  CheckCircle,
  FileText,
  Globe,
  ImageIcon,
  ImagesIcon,
  PieChart,
  PlayCircle,
  PlaySquare,
  User,
  Users,
  Users2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const { data: dataInfografis } = useFetch<InfografisModel>("/api/infografis");
  const { data: dataArtikel } = useFetch<ArtikelModel>("/api/artikel");
  const { data: dataFoto } = useFetch<FotoModel>("/api/foto");
  const { data: dataUsers } = useFetch<UserModel>("/api/users");

  const myInfografisCount = getMyInfografisCount(dataInfografis, user?.nama);
  const myArtikelCount = getMyArtikelCount(dataArtikel, user?.nama);
  const myPhotoCount = getMyPhotoCount(dataFoto, user?.nama);
  const myVideoCount = 0;

  const totalInfografis = dataInfografis.length;
  const totalArtikel = dataArtikel.length;
  const totalPhoto = dataFoto.length;
  const totalVideo = 3;
  const totalUsers = dataUsers.length;

  // --- LOGIKA FILTER NOTIFIKASI REVISI ---
  // Cari infografis milik user yang statusnya "revisi"
  const revisiInfografis =
    dataInfografis?.filter(
      (item) => item.author === user?.nama && (item as any).status === "revisi",
    ) || [];

  // Cari artikel milik user yang statusnya "revisi"
  const revisiArtikel =
    dataArtikel?.filter(
      (item) => item.author === user?.nama && item.status === "revisi",
    ) || [];

  const hasRevisi = revisiInfografis.length > 0 || revisiArtikel.length > 0;

  const overallStatItems = [
    {
      name: "Total Infografis",
      count: totalInfografis,
      icon: PieChart,
    },
    {
      name: "Total Artikel",
      count: totalArtikel,
      icon: FileText,
    },
    {
      name: "Total Foto",
      count: totalPhoto,
      icon: ImagesIcon,
    },
    {
      name: "Total Videografis",
      count: totalVideo,
      icon: PlaySquare,
    },
    {
      name: "Kompilasi Diunggah",
      count: 0,
      icon: BookAIcon,
    },
    {
      name: "Jumlah Pengguna",
      count: totalUsers,
      icon: Users2,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-purple-800 rounded-2xl p-4 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Selamat datang, {user!?.nama}! 👋
          </h2>
          <p className="text-sm text-blue-100 max-w-2xl">
            Ini adalah ruang kerja kolaboratif. Kamu dapat mengelola karyamu
            sendiri sekaligus memantau seluruh publikasi dan aktivitas logbook
            dari rekan-rekan tim magang lainnya.
          </p>
        </div>
        <Globe className="absolute -right-4 -bottom-8 w-48 h-48 text-white opacity-10" />
      </div>

      {/* KOTAK PENGUMUMAN REVISI (Hanya Muncul Jika Ada Revisi) */}
      {hasRevisi && (
        <div className="bg-white rounded-xl shadow-sm border border-amber-300 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Tindakan Diperlukan: Catatan Revisi
          </h3>

          <div className="space-y-4">
            {/* TAMPILKAN DAFTAR INFOGRAFIS YANG DIREVISI */}
            {revisiInfografis.map((item) => (
              <div
                key={`info-${item.id}`}
                className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Infografis
                  </span>
                </div>
                <p className="text-sm font-bold text-amber-900">{item.title}</p>
                <div className="mt-2 bg-white/60 rounded p-3 border border-amber-100">
                  <p className="text-sm text-amber-800 whitespace-pre-wrap font-medium">
                    "
                    {item.revisi_msg ||
                      "Tidak ada detail pesan, silakan hubungi admin."}
                    "
                  </p>
                </div>
              </div>
            ))}

            {/* TAMPILKAN DAFTAR ARTIKEL YANG DIREVISI */}
            {revisiArtikel.map((item) => (
              <div
                key={`art-${item.id}`}
                className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Artikel
                  </span>
                </div>
                <p className="text-sm font-bold text-amber-900">{item.title}</p>
                <div className="mt-2 bg-white/60 rounded p-3 border border-amber-100">
                  <p className="text-sm text-amber-800 whitespace-pre-wrap font-medium">
                    "
                    {item.revisi_msg ||
                      "Tidak ada detail pesan, silakan hubungi admin."}
                    "
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" /> Hasil Karyamu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6">
          <div className="bg-white p-6 rounded-2xl border-l-4 border-sky-600 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">
                Infografis
              </p>
              <h4 className="text-3xl font-extrabold text-slate-800">
                {myInfografisCount}
              </h4>
            </div>
            <div className="sm:bg-sky-50 p-3 rounded-xl">
              <CheckCircle className="hidden sm:block sm:size-8 sm:text-sky-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-emerald-500 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">Artikel</p>
              <h4 className="text-3xl font-extrabold text-slate-800">
                {myArtikelCount}
              </h4>
            </div>
            <div className="sm:bg-emerald-50 p-3 rounded-xl">
              <BookOpen className="hidden sm:block sm:size-8 sm:text-emerald-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-amber-500 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">
                Foto / Dokumentasi
              </p>
              <h4 className="text-3xl font-extrabold text-slate-800">
                {myPhotoCount}
              </h4>
            </div>
            <div className="sm:bg-amber-50 p-3 rounded-xl">
              <ImageIcon className="hidden sm:block sm:size-8 sm:text-amber-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-l-4 border-violet-500 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-500 font-medium text-sm mb-1">
                Videografis
              </p>
              <h4 className="text-3xl font-extrabold text-slate-800">
                {myVideoCount}
              </h4>
            </div>
            <div className="sm:bg-violet-50 p-3 rounded-xl">
              <PlayCircle className="hidden sm:block sm:size-8 sm:text-violet-500" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" /> Statistik
            Keseluruhan Web
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {overallStatItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-slate-500 font-medium text-sm mb-1">
                      {item.name}
                    </p>
                    <h4 className="text-3xl font-extrabold text-slate-800">
                      {item.count}
                    </h4>
                  </div>
                  <div className="sm:bg-blue-50 p-3 rounded-xl">
                    <Icon className="hidden sm:block sm:size-7 sm:text-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KOTAK PENGUMUMAN */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Pengumuman Pembimbing
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-900 font-medium">
            Batas akhir pengumpulan artikel kajian individu (Tugas Akhir Magang)
            adalah tanggal 30 April 2026. Harap pastikan setiap anggota tim
            sudah mengunggah karya masing-masing ke dalam database ini.
          </p>
          <p className="text-xs text-blue-700 mt-2">
            — Bapak Yan (Kasi Statistik Sosial BPS)
          </p>
        </div>
      </div> */}
    </div>
  );
}
