import { auth } from "./google-auth";
import { uploadToDrive } from "./google-drive";
import { saveToSheets } from "./google-sheets";
import { google } from "googleapis";

export async function getInfografis() {
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

    return rows.map((row) => {
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
          ? `https://drive.google.com/uc?export=view&id=${fileId}`
          : "/file.svg",
      };
    });
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

    // 🔥 Sangat disarankan untuk mengaktifkan kembali validasi ini
    if (!file || !title) {
      return {
        success: false,
        message: "File gambar dan judul wajib diisi",
      };
    }

    const lastId = await getInfografisLastId();
    const id = lastId + 1;

    const author = "Admin";
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
          author,
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
