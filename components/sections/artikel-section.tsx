import { BookOpen, ArrowRight } from "lucide-react";
import ScrollAnimation from "../ui/scroll-anim";
import { artikelData } from "@/data/dummies";

export default function ArtikelSection() {
  return (
    <section id="artikel" className="py-20 bg-gray-50">
      <ScrollAnimation>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-purple-900 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 mr-3 text-yellow-500" /> Artikel &
              Kajian
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Tulisan populer, analisis data ringan, dan catatan perjalanan
              magang yang ditulis langsung oleh para mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artikelData.map((artikel) => (
              <div
                key={artikel.id}
                className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-600 hover:-translate-y-1 transition-transform duration-300"
              >
                <p className="text-xs font-semibold text-yellow-600 mb-3">
                  {artikel.date}
                </p>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {artikel.title}
                </h4>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                  {artikel.excerpt}
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                  <span className="text-xs text-gray-500 font-medium">
                    Oleh: {artikel.author}
                  </span>
                  <a
                    href="#"
                    className="bg-purple-600 text-white p-2 rounded-lg hover:text-yellow-300 hover:bg-purple-700 text-sm font-bold flex items-center"
                  >
                    Baca <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
}
