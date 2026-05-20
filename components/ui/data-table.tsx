import React, { useState } from "react";
import { Pagination } from "../../utils/pagination";
import {
  Eye,
  CheckCircle,
  MessageSquareDashed,
  Pencil,
  Trash2,
} from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  hiddenOnMobile?: boolean;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRevisi?: (item: T) => void;
  onApprove?: (item: T) => void;
  canAction?: (item: T) => boolean;
  withPagination?: boolean;
  itemsPerPage?: number;
}

export function DataTable<T>({
  title,
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onRevisi,
  onApprove,
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

  const hasActions = onView || onEdit || onDelete || onRevisi || onApprove;

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
                  className={`px-6 py-3 font-semibold ${
                    col.hiddenOnMobile ? "hidden md:table-cell" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
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
                      className={`px-6 py-4 ${
                        col.hiddenOnMobile ? "hidden md:table-cell" : ""
                      }`}
                    >
                      {col.cell
                        ? col.cell(item)
                        : String(item[col.accessorKey as keyof T])}
                    </td>
                  ))}

                  {hasActions && (
                    <td className="px-6 py-4 flex flex-wrap justify-center gap-2 items-center">
                      {/* TOMBOL VIEW */}
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          title="Lihat Detail"
                          className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 transition"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline text-xs font-medium">
                            Lihat
                          </span>
                        </button>
                      )}
                      {!canAction || canAction(item) ? (
                        <>
                          {onApprove && (item as any).status === "menunggu" && (
                            <button
                              onClick={() => onApprove(item)}
                              title="Setujui Data"
                              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs font-medium">
                                Setujui
                              </span>
                            </button>
                          )}
                          {onRevisi && (item as any).status === "menunggu" && (
                            <button
                              onClick={() => onRevisi(item)}
                              title="Beri Catatan Revisi"
                              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-white bg-amber-500 rounded-md hover:bg-amber-600 transition"
                            >
                              <MessageSquareDashed className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs font-medium">
                                Revisi
                              </span>
                            </button>
                          )}
                          {onEdit && (item as any).status !== "disetujui" && (
                            <button
                              onClick={() => onEdit(item)}
                              title="Edit Data"
                              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs font-medium">
                                Edit
                              </span>
                            </button>
                          )}
                          {onDelete && (item as any).status !== "menunggu" && (
                            <button
                              onClick={() => onDelete(item)}
                              title="Hapus Data"
                              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline text-xs font-medium">
                                Hapus
                              </span>
                            </button>
                          )}
                        </>
                      ) : (
                        !onView && (
                          <span className="text-xs text-gray-400 italic">
                            Hanya lihat
                          </span>
                        )
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 2 : 1)}
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
