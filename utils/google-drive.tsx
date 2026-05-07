import { google } from "googleapis";
import { auth } from "@/utils/google-auth";
import { Readable } from "stream";

export async function uploadToDrive(file: File, folderId: string) {
  try {
    // 1. Validasi Environment Variable di awal
    if (!folderId) {
      throw new Error("folderId belum diatur di dalam file .env");
    }

    // Inisialisasi Drive
    const drive = google.drive({ version: "v3", auth });

    // 2. Konversi File ke Stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    // 3. Proses Upload ke Drive
    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        parents: [folderId],
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
      supportsAllDrives: true,
      fields: "id", // Optimasi: Meminta Google hanya mengembalikan ID saja agar respons lebih cepat
    });

    const fileId = res.data.id;
    if (!fileId) {
      throw new Error(
        "Gagal mendapatkan ID file dari Google Drive setelah upload",
      );
    }

    // 4. Ubah file menjadi Publik
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
      supportsAllDrives: true, // Disarankan ditambahkan juga di sini untuk menghindari error di akun tertentu
    });

    return {
      success: true,
      fileId: fileId,
      imageUrl: `https://drive.google.com/uc?export=view&id=${fileId}`,
    };
  } catch (error) {
    console.error("Error pada uploadToDrive:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengunggah file ke Google Drive",
    };
  }
}
