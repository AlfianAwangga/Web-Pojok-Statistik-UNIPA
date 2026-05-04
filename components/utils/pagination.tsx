"use client";

export function getPaginatedData<T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number,
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return data.slice(startIndex, startIndex + itemsPerPage);
}

export function getTotalPages(
  totalItems: number,
  itemsPerPage: number,
): number {
  return Math.ceil(totalItems / itemsPerPage);
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };
  const generatePagination = () => {
    // 1. Jika total halaman 5 atau kurang, tampilkan semua (1, 2, 3, 4, 5)
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 2. Jika posisi di awal (halaman 1, 2, atau 3)
    // Menampilkan 1 sampai 4 agar jika Anda di halaman 3, angka 4 tetap terlihat
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    // 3. Jika posisi di akhir (misal total 10, posisi di 8, 9, atau 10)
    // Menampilkan 4 angka terakhir agar jika Anda di halaman 8, angka 7 tetap terlihat
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // 4. Jika posisi di tengah-tengah (misal halaman 5 dari 10)
    // Menampilkan tepat satu angka di kiri dan kanan halaman aktif
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = generatePagination();
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Tampilan Mobile */}
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Selanjutnya
        </button>
      </div>

      {/* Tampilan Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Halaman <span className="font-medium">{currentPage}</span> dari{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              &laquo;
            </button>

            {pages.map((page, index) => {
              // Jika item adalah string titik-titik, render sebagai span biasa
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                  >
                    ...
                  </span>
                );
              }

              // Jika item adalah angka, render sebagai tombol
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    currentPage === page
                      ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              &raquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
