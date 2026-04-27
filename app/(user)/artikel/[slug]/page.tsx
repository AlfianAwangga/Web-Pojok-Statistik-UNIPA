"use client";

import { use, useState } from "react";
import { artikelData } from "@/data/dummies";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  ChevronRight,
} from "lucide-react";
import ShareDialog from "@/components/ui/share-dialog";

export default function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const article = artikelData.find((a) => a.slug === slug);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const articleUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/artikel/${slug}`;

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/artikel")}
            className="flex items-center text-gray-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Katalog
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Artikel Magang Berdampak</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-purple-600 font-medium truncate w-32">
              {article.category}
            </span>
          </div>
        </div>
      </nav>

      {/* HEADER ARTIKEL */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          {article.category}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-8">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-200 py-4 mb-8">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="font-semibold text-gray-800 mr-1">Penulis:</span>
            {article.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
            {article.date}
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            {article.readTime}
          </div>
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex-1 sm:flex-none bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" /> Bagikan
          </button>
        </div>
      </div>

      {/* ISI KONTEN */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="prose prose-lg prose-blue text-gray-700 leading-relaxed text-justify">
          {article.content.split("\n").map((paragraph, index) => {
            if (paragraph.trim() === "") return null;

            if (paragraph.trim().length < 50 && !paragraph.includes(".")) {
              return (
                <h3
                  key={index}
                  className="text-2xl font-bold text-gray-900 mt-10 mb-4"
                >
                  {paragraph}
                </h3>
              );
            }

            return (
              <p key={index} className="mb-6">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={articleUrl}
        title={""}
      />
    </div>
  );
}
