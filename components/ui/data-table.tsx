import React, { useState } from "react";
import { Pagination } from "../utils/pagination";

// Mendefinisikan struktur kolom tabel
export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  hiddenOnMobile?: boolean;
  cell?: (item: T) => React.ReactNode; // Opsional: untuk custom render (misal: gambar, badge, atau format tanggal)
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  canAction?: (item: T) => boolean;
  withPagination?: boolean;
  itemsPerPage?: number;
}

export function DataTable<T>({
  title,
  columns,
  data,
  onEdit,
  onDelete,
  canAction,
  withPagination = false,
  itemsPerPage = 5,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = withPagination ? Math.ceil(data.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayData = withPagination
    ? data.slice(startIndex, startIndex + itemsPerPage)
    : data;
  return (
    <div className="w-full overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 font-semibold text-center w-12">No</th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 font-semibold ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}`}
                >
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 font-semibold text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData.length > 0 ? (
              displayData.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-center">{rowIndex + 1}</td>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${col.hiddenOnMobile ? "hidden md:table-cell" : ""}`}
                    >
                      {/* Jika ada custom cell render, gunakan itu. Jika tidak, tampilkan value mentah */}
                      {col.cell
                        ? col.cell(item)
                        : String(item[col.accessorKey as keyof T])}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 flex justify-center gap-2 items-center">
                      {/* Logika pengecekan: Jika ada fungsi canAction dan hasilnya FALSE */}
                      {canAction && !canAction(item) ? (
                        <span className="text-xs text-gray-400 italic">
                          Hanya lihat
                        </span>
                      ) : (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="px-3 py-1.5 text-xs text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            >
                              Hapus
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 2 : 1)}
                  className="px-6 py-8 text-center text-gray-500 italic"
                >
                  Tidak ada data yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {withPagination && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
