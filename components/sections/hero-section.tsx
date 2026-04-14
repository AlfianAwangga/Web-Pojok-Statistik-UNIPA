import { ArrowRight, BarChart3, Users } from "lucide-react";
import ScrollAnimation from "../ui/scroll-anim";

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="bg-white text-white py-20 lg:py-32 overflow-hidden"
    >
      {/* Dekorasi Background */}
      {/* <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-20 blur-3xl"></div> */}
      <ScrollAnimation>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 md:pr-10">
            <span className="inline-block py-1 px-3 rounded-full bg-yellow-300 text-purple-900 font-semibold text-xs tracking-wider mb-6">
              PROGRAM MAGANG BERDAMPAK
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-purple-900 font-extrabold tracking-tight mb-6 leading-tight">
              Eksplorasi Data <br />
              <span className="text-yellow-400">Membangun Papua</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl leading-relaxed">
              Wadah publikasi karya, infografis, dan analisis statistik hasil
              kolaborasi mahasiswa magang Universitas Papua di Badan Pusat
              Statistik Provinsi Papua Barat.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <a
                href="#infografis"
                className="bg-purple-900 hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center"
              >
                Lihat Karya Mahasiswa <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#tentang"
                className="bg-transparent border-2 border-purple-900 hover:bg-purple-100 hover:text-purple-900 text-purple-900 font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
              >
                Tentang Program
              </a>
            </div>
          </div>

          {/* Ilustrasi Hero (Placeholder) */}
          <div className="hidden md:block md:w-2/5 mt-10 md:mt-0">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-purple-400" />
                </div>
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                  <Users className="w-12 h-12 text-yellow-400" />
                </div>
                <div className="bg-gray-100 h-24 col-span-2 rounded-lg flex items-center justify-center px-4">
                  <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 w-3/4 h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </section>
  );
}
