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
      range: "infografis!A2:J",
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
        status: (row[8] as any) || "menunggu",
        revisi_msg: row[9] || "",
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
    if (!spreadsheetId) return 0;
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "infografis!A2:A",
    });

    const rows = res.data.values;

    if (!rows || rows.length === 0) return 0;

    const lastRow = rows[rows.length - 1];
    const lastId = Number(lastRow[0]);

    return isNaN(lastId) ? 0 : lastId;
  } catch (error) {
    console.error("Error getLastId:", error);
    return 0;
  }
}

export async function createInfografis(req: Request) {
  try {
    const formData = await req.formData();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_INFOGRAFIS_ID as string;

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;

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

    const uploadResult = await uploadToDrive(file, folderId);
    if (!uploadResult.success) {
      return {
        success: false,
        message: `Gagal upload gambar: ${uploadResult.error}`,
      };
    }

    const fileId = uploadResult.fileId;
    const imageUrl = uploadResult.imageUrl;

    const sheetResult = await saveToSheets({
      range: "infografis!A2:J",
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
          "menunggu",
          "",
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
        status: "menunggu",
        revisi_msg: "",
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
    const role = formData.get("role") as string;

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
      range: "infografis!A2:J",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return { success: false, message: "Database masih kosong" };
    }

    const rowIndex = rows.findIndex((row) => String(row[0]) === String(id));

    if (rowIndex === -1) {
      return { success: false, message: "Data tidak ditemukan" };
    }

    const oldRow = rows[rowIndex];
    let fileId = oldRow[6] || "";
    let imageUrl = oldRow[7] || "";

    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_INFOGRAFIS_ID as string;
      const uploadResult = await uploadToDrive(file, folderId);

      if (!uploadResult.success) {
        return { success: false, message: "Gagal upload gambar baru" };
      }
      fileId = uploadResult.fileId || "";
      imageUrl = uploadResult.imageUrl || "";
    }

    const title =
      formData.get("title") !== null ? formData.get("title") : oldRow[1] || "";
    const category =
      formData.get("category") !== null
        ? formData.get("category")
        : oldRow[2] || "";
    const description =
      formData.get("description") !== null
        ? formData.get("description")
        : oldRow[5] || "";

    const currentStatus = oldRow[8] || "menunggu";
    let newStatus = "menunggu";
    let newRevisiMsg = "";

    if (role === "admin") {
      newStatus = currentStatus;
      newRevisiMsg = oldRow[9] || "";
    }

    const updatedRow = [
      oldRow[0],
      title,
      category,
      oldRow[3] || "",
      oldRow[4] || "",
      description,
      fileId,
      imageUrl,
      newStatus,
      newRevisiMsg,
    ];

    const targetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `infografis!A${targetRow}:J${targetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow],
      },
    });

    clearInfografisCache();

    return { success: true, message: "Data berhasil diperbarui" };
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

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "infografis!A2:J",
    });

    const rows = response.data.values || [];

    const rowIndex = rows.findIndex((row) => Number(row[0]) === id);

    if (rowIndex === -1) {
      return {
        success: false,
        message: "Data tidak ditemukan",
      };
    }

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

export async function reviewInfografis(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const status = formData.get("status") as string; // "disetujui" atau "revisi"
    const revisiMsg = (formData.get("revisi_msg") as string) || "";

    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error("SPREADSHEET_ID belum diatur");

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "infografis!A2:A",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) throw new Error("Data tidak ditemukan");

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) throw new Error("Infografis tidak ditemukan");

    const targetRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `infografis!I${targetRow}:J${targetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status, revisiMsg]],
      },
    });

    clearInfografisCache();

    return {
      success: true,
      message: `Status berhasil diubah menjadi ${status}`,
    };
  } catch (error) {
    console.error("Error reviewInfografis:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memberikan review",
    };
  }
}
