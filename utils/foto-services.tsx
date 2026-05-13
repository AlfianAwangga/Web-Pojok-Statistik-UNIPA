import { auth } from "./google-auth";
import { uploadToDrive } from "./google-drive";
import { saveToSheets } from "./google-sheets";
import { google } from "googleapis";

let cacheFoto: any[] = [];
let cacheTime = 0;

const CACHE_DURATION = 30 * 1000; // 30 detik

function clearCacheFoto() {
  cacheFoto = [];
  cacheTime = 0;
}

export async function getFoto() {
  const now = Date.now();

  // Gunakan cache jika belum expired
  if (cacheFoto.length > 0 && now - cacheTime < CACHE_DURATION) {
    console.log("Menggunakan cache foto");

    return cacheFoto;
  }
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("SPREADSHEET_ID belum diatur di .env");

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "foto!A2:G",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) return [];

    cacheFoto = rows.map((row) => {
      const fileId = row[5] || "";

      return {
        id: Number(row[0]),
        caption: row[1] || "",
        lokasi: row[2] || "",
        upload_date: row[3] || "",
        uploader: row[4] || "",
        drive_image_id: fileId,
        image_url: fileId
          ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
          : "/file.svg",
      };
    });

    cacheTime = now;
    return cacheFoto;
  } catch (error) {
    console.error("Error getInfografis:", error);
    return [];
  }
}

export async function getFotoLastId(): Promise<number> {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) return 0; // Fallback aman jika env belum siap

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "foto!A2:A", // ambil kolom ID saja
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

export async function createFoto(req: Request) {
  try {
    const formData = await req.formData();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_FOTO_ID as string;

    // Menggunakan fallback 'null' untuk tipe File agar TypeScript tidak protes saat validasi
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string;
    const location = formData.get("location") as string;
    const uploader = formData.get("uploader") as string;

    // 🔥 Sangat disarankan untuk mengaktifkan kembali validasi ini
    if (!file || !caption) {
      return {
        success: false,
        message: "File gambar dan judul wajib diisi",
      };
    }

    const lastId = await getFotoLastId();
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
      range: "foto!A2:G",
      values: [
        [id, caption, location, date, uploader, fileId || "", imageUrl || ""],
      ],
    });

    if (!sheetResult.success) {
      return {
        success: false,
        message: `Gagal menyimpan data ke database: ${sheetResult.error}`,
      };
    }

    clearCacheFoto();

    return {
      success: true,
      message: "Berhasil upload infografis",
      data: {
        id,
        caption,
        location,
        date,
        uploader,
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

export async function updateFoto(req: Request) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const caption = formData.get("caption") as string;
    const location = formData.get("location") as string;
    const uploader = formData.get("uploader") as string;
    const file = formData.get("file") as File | null;

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_FOTO_ID as string;

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID belum diatur");
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Ambil seluruh data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "foto!A2:G",
    });

    const rows = response.data.values || [];

    // Cari index data berdasarkan id
    const rowIndex = rows.findIndex((row) => Number(row[0]) === id);

    if (rowIndex === -1) {
      return {
        success: false,
        message: "Data foto tidak ditemukan",
      };
    }

    const existingRow = rows[rowIndex];

    let fileId = existingRow[5] || "";

    // Upload gambar baru jika ada
    if (file && file.size > 0) {
      const uploadResult = await uploadToDrive(file, folderId);

      if (!uploadResult.success) {
        return {
          success: false,
          message: `Gagal upload gambar: ${uploadResult.error}`,
        };
      }

      fileId = uploadResult.fileId || "";
    }

    const imageUrl = fileId
      ? `https://drive.google.com/uc?export=view&id=${fileId}`
      : "/file.svg";

    // Update row di spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `foto!A${rowIndex + 2}:G${rowIndex + 2}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            id,
            caption,
            location,
            existingRow[3], // upload_date tetap
            uploader,
            fileId,
            imageUrl,
          ],
        ],
      },
    });

    clearCacheFoto();

    return {
      success: true,
      message: "Foto berhasil diperbarui",
      data: {
        id,
        caption,
        location,
        uploader,
        drive_image_id: fileId,
        image_url: imageUrl,
      },
    };
  } catch (error) {
    console.error("Error updateFoto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat update foto",
    };
  }
}
