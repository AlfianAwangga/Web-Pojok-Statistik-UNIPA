"use client";

import { use, useState } from "react";
import { artikelData } from "@/data/dummies";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  ChevronRight,
} from "lucide-react";
import ShareDialog from "@/components/ui/share-dialog";
import { useFetch } from "@/hooks/use-fetch";
import { ArtikelModel } from "@/data/artikel-model";

export default function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Ambil data dari API Route
  const {
    data: dataArtikel,
    isLoading,
    error,
  } = useFetch<ArtikelModel>("/api/artikel");

  const article = dataArtikel.find((a) => a.slug === slug);

  const articleUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/artikel/${slug}`;

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

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-12 md:h-16 max-w-4xl items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center font-semibold text-gray-600 transition-colors hover:text-purple-700"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Artikel</span>
            <ChevronRight className="h-4 w-4" />
            <span className=" truncate font-medium text-purple-600">
              {article.category}
            </span>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="mx-auto max-w-4xl px-4 pt-4">
        {/* <img
          src={article.thumbnail}
          alt={article.title}
          className="mb-8 h-[320px] w-full rounded-2xl object-cover shadow-sm"
        /> */}

        {/* <span className="mb-6 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-800">
          {article.category}
        </span> */}

        <h1 className="mb-4 text-2xl font-extrabold leading-tight text-gray-900 md:text-4xl">
          {article.title}
        </h1>

        <p className="mb-4 text-md sm:text-lg leading-relaxed text-gray-600">
          {article.excerpt}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-2 border-y border-gray-200 py-1 md:py-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-yellow-500" />
            <span className="mr-1 font-semibold text-gray-800 hidden sm:inline">
              Penulis:
            </span>
            {article.author}
          </div>

          <div className="hidden sm:flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-yellow-500" />
            {article.publishDate}
          </div>

          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-yellow-500" />
            {article.readTime}
          </div>
          <button
            onClick={() => setIsShareOpen(true)}
            className="ml-auto flex items-center justify-center rounded-xl bg-purple-50 px-6 py-3 font-semibold text-purple-700 transition-colors hover:bg-purple-100 active:bg-purple-100 sm:flex-none"
          >
            <Share2 className="mr-2 h-5 w-5" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="space-y-4 leading-relaxed text-gray-700">
          {article.sections.map((section) => {
            if (section.type === "subtitle") {
              return (
                <h2
                  key={section.id}
                  className="text-lg sm:text-2xl font-bold text-gray-900"
                >
                  {section.content}
                </h2>
              );
            }

            if (section.type === "highlight") {
              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-purple-100 bg-purple-50 p-5 font-medium text-purple-800"
                >
                  {section.content}
                </div>
              );
            }

            if (section.type === "quote") {
              return (
                <blockquote
                  key={section.id}
                  className="border-l-4 border-purple-500 pl-4 italic text-gray-600"
                >
                  {section.content}
                </blockquote>
              );
            }

            return <p key={section.id}>{section.content}</p>;
          })}
        </div>
      </div>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={articleUrl}
        title={article.title}
      />
    </div>
  );
}
