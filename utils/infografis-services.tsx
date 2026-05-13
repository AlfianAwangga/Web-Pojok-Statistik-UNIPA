import { google } from "googleapis";
import { auth } from "./google-auth";
import { uploadToDrive } from "./google-drive";
import { saveToSheets } from "./google-sheets";

let cacheInfografis: any[] = [];
let cacheTime = 0;

const CACHE_DURATION = 30 * 1000; // 30 detik

function clearInfografisCache() {
  cacheInfografis = [];
  cacheTime = 0;
}

export async function getInfografis() {
  const now = Date.now();

  // Gunakan cache jika belum expired
  if (cacheInfografis.length > 0 && now - cacheTime < CACHE_DURATION) {
    console.log("Menggunakan cache infografis");

    return cacheInfografis;
  }
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("SPREADSHEET_ID belum diatur di .env");

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "infografis!A2:H",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) return [];

    cacheInfografis = rows.map((row) => {
      const fileId = row[6] || "";

      return {
        id: Number(row[0]),
        title: row[1] || "",
        category: row[2] || "",
        author: row[3] || "",
        date: row[4] || "",
        description: row[5] || "",
        drive_image_id: fileId,
        image_url: fileId
          ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
          : "/file.svg",
      };
    });

    cacheTime = now;
    return cacheInfografis;
  } catch (error) {
    console.error("Error getInfografis:", error);
    return [];
  }
}

export async function getInfografisLastId(): Promise<number> {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) return 0; // Fallback aman jika env belum siap

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "infografis!A2:A", // ambil kolom ID saja
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) return 0;

    const lastRow = rows[rows.length - 1];
    const lastId = Number(lastRow[0]);

    return isNaN(lastId) ? 0 : lastId;
  } catch (error) {
    console.error("Error getLastId:", error);
    return 0; // Mengembalikan 0 jika gagal agar proses create tidak ikut rusak
  }
}

export async function createInfografis(req: Request) {
  try {
    const formData = await req.formData();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_INFOGRAFIS_ID as string;

    // Menggunakan fallback 'null' untuk tipe File agar TypeScript tidak protes saat validasi
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;

    // 🔥 Sangat disarankan untuk mengaktifkan kembali validasi ini
    if (!file || !title) {
      return {
        success: false,
        message: "File gambar dan judul wajib diisi",
      };
    }

    const lastId = await getInfografisLastId();
    const id = lastId + 1;

    const date = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // 1. Upload ke Drive (Cek status success-nya!)
    const uploadResult = await uploadToDrive(file, folderId);
    if (!uploadResult.success) {
      return {
        success: false,
        message: `Gagal upload gambar: ${uploadResult.error}`,
      };
    }

    // Ambil data dari uploadResult karena kita tahu prosesnya sukses
    const fileId = uploadResult.fileId;
    const imageUrl = uploadResult.imageUrl;

    // 2. Simpan ke Sheets (Cek status success-nya juga!)
    const sheetResult = await saveToSheets({
      range: "infografis!A2:H",
      values: [
        [
          id,
          title,
          category,
          author!,
          date,
          description,
          fileId || "",
          imageUrl || "",
        ],
      ],
    });

    if (!sheetResult.success) {
      return {
        success: false,
        message: `Gagal menyimpan data ke database: ${sheetResult.error}`,
      };
    }

    clearInfografisCache();

    return {
      success: true,
      message: "Berhasil upload infografis",
      data: {
        id,
        title,
        category,
        author,
        date,
        description,
        drive_image_id: fileId,
        image_url: imageUrl,
      },
    };
  } catch (error) {
    console.error("Error createInfografis (Catch block):", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan internal server saat upload",
    };
  }
}

export async function updateInfografis(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    const spreadsheetId = process.env.SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID belum diatur");
    }

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    // Ambil seluruh data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "infografis!A2:H",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        success: false,
        message: "Data tidak ditemukan",
      };
    }

    // Cari index berdasarkan ID
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      return {
        success: false,
        message: "Data tidak ditemukan",
      };
    }

    // Simpan data lama
    const oldRow = rows[rowIndex];

    // File lama
    let fileId = oldRow[6];
    let imageUrl = oldRow[7];

    // Jika user upload gambar baru
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_INFOGRAFIS_ID as string;

      const uploadResult = await uploadToDrive(file, folderId);

      if (!uploadResult.success) {
        return {
          success: false,
          message: "Gagal upload gambar baru",
        };
      }

      fileId = uploadResult.fileId || "";
      imageUrl = uploadResult.imageUrl || "";
    }

    // Update row
    const updatedRow = [
      oldRow[0], // id tetap
      title,
      category,
      oldRow[3], // author tetap
      oldRow[4], // tanggal tetap
      description,
      fileId,
      imageUrl,
    ];

    // +2 karena sheet dimulai dari row ke-2
    const targetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `infografis!A${targetRow}:H${targetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow],
      },
    });

    clearInfografisCache();

    return {
      success: true,
      message: "Data berhasil diperbarui",
    };
  } catch (error) {
    console.error("Error updateInfografis:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal update data",
    };
  }
}

export async function deleteInfografis(id: number) {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const infografisSheetId = Number(process.env.INFOGRAFIS_SHEET_ID);

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID belum diatur");
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Ambil semua data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "infografis!A2:H",
    });

    const rows = response.data.values || [];

    // Cari index row berdasarkan id
    const rowIndex = rows.findIndex((row) => Number(row[0]) === id);

    if (rowIndex === -1) {
      return {
        success: false,
        message: "Data tidak ditemukan",
      };
    }

    // Hapus row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: infografisSheetId, // sheet infografis
                dimension: "ROWS",
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      },
    });

    clearInfografisCache();

    return {
      success: true,
      message: "Infografis berhasil dihapus",
    };
  } catch (error) {
    console.error("Error deleteInfografis:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus data",
    };
  }
}
