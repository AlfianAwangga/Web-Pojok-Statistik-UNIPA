import { BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-purple-950 text-purple-200 py-12 border-t border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="bg-purple-800 p-1.5 rounded text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white">
              Pojok Statistik
            </span>
          </div>
          <p className="text-sm mb-4">
            Platform kolaborasi edukasi dan publikasi data antara Badan Pusat
            Statistik (BPS) Provinsi Papua Barat dan Universitas Papua.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Tautan Cepat
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Koleksi Infografis
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Artikel & Kajian
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition">
                Galeri Dokumentasi
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
            Kontak Instansi
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>BPS Papua Barat</strong>
              <br />
              Jl. Trikora Sowi IV No. 99 <br />
              Distrik Manokwari Selatan - Manokwari - Papua Barat - 98315
            </li>
            <li className="mt-2">
              <strong>Universitas Papua</strong>
              <br />
              Jl. Gunung Salju, Amban <br />
              Distrik Manokwari Barat - Manokwari - Papua Barat - 98314
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-purple-900/50 text-sm text-center text-purple-400">
        <p>&copy; {new Date().getFullYear()} Pojok Statistik BPS x UNIPA</p>
      </div>
    </footer>
  );
}
