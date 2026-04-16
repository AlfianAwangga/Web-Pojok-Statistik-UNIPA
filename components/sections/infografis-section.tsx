"use client";

import { ImageIcon, Users, ChevronRight } from "lucide-react";
import ScrollAnimation from "../ui/scroll-anim";
import { infografisData, InfografisModel } from "@/data/dummies";
import PreviewDialog from "../ui/preview-dialog";
import { useState } from "react";

export default function InfografisSection() {
  const infografisTerbaru = infografisData.slice(0, 3);
  const [selectedItem, setSelectedItem] = useState<InfografisModel | null>(
    null,
  );
  return (
    <section id="infografis" className="py-20 bg-gray-50">
      <ScrollAnimation>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-purple-900 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 mr-3 text-yellow-500" /> Karya
              Infografis
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Visualisasi data menarik yang merangkum kondisi sosial dan ekonomi
              Papua Barat, disajikan secara kreatif oleh mahasiswa magang.
            </p>
          </div>

          {/* Grid Infografis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {infografisTerbaru.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                      }}
                      className="bg-yellow-500 text-purple-900 text-sm font-bold py-2 px-4 rounded w-full"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Users className="w-4 h-4 mr-1" /> Oleh:{" "}
                    <span className="font-semibold text-purple-700 ml-1">
                      {item.author}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="text-purple-700 font-semibold hover:text-purple-900 flex items-center mx-auto">
              Lihat Semua Infografis <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
        <PreviewDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </ScrollAnimation>
    </section>
  );
}
