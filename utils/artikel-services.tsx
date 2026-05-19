import { auth } from "./google-auth";
import { uploadToDrive } from "./google-drive";
import { saveToSheets } from "./google-sheets";
import { google } from "googleapis";

let cacheArtikel: any[] = [];
let cacheArtikelTime = 0;

const CACHE_DURATION = 30 * 1000; // 30 detik

function clearArtikelCache() {
  cacheArtikel = [];
  cacheArtikelTime = 0;
}

export async function getArtikel() {
  try {
    const now = Date.now();

    // Gunakan cache jika belum expired
    if (cacheArtikel.length > 0 && now - cacheArtikelTime < CACHE_DURATION) {
      console.log("Menggunakan cache artikel");
      return cacheArtikel;
    }

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheets = google.sheets({ version: "v4", auth });

    // Ambil data artikel (Diperlebar ke kolom L untuk revisi_msg)
    const resArticles = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:L",
    });

    // Ambil data section
    const resSections = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel_section!A2:D",
    });

    const articleRows = resArticles.data.values || [];
    const sectionRows = resSections.data.values || [];

    const formattedArticles = articleRows.map((row) => {
      const articleId = Number(row[0]);

      const sections = sectionRows
        .filter((sRow) => Number(sRow[1]) === articleId)
        .map((sRow) => ({
          id: Number(sRow[0]),
          type: sRow[2],
          content: sRow[3],
        }));

      return {
        id: articleId,
        title: row[1] || "",
        slug: row[2] || "",
        category: row[3] || "",
        excerpt: row[4] || "",
        thumbnail: row[5] || "",
        author: row[6] || "",
        publishDate: row[7] || "",
        readTime: row[8] || "",
        tags: row[9] ? row[9].split(",").map((t: string) => t.trim()) : [],
        status: row[10] || "menunggu",
        revisi_msg: row[11] || "", // Menerima data dari kolom L
        sections,
      };
    });

    // Simpan ke cache
    cacheArtikel = formattedArticles;
    cacheArtikelTime = now;

    return formattedArticles;
  } catch (error) {
    console.error("Error getArtikel:", error);
    return [];
  }
}

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes < 1 ? 1 : minutes} min`;
};

export async function getArticleLastId(): Promise<number> {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) return 0;

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:A",
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) return 0;

    const lastRow = rows[rows.length - 1];
    const lastId = Number(lastRow[0]);

    return isNaN(lastId) ? 0 : lastId;
  } catch (error) {
    console.error("Error getArticleLastId:", error);
    return 0;
  }
}

export async function createArtikel(req: Request) {
  try {
    const formData = await req.formData();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ARTIKEL_ID as string;

    // Data dari UI
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const author = formData.get("author") as string;
    const tags = formData.get("tags") as string;
    const sectionsRaw = formData.get("sections") as string; // JSON string dari frontend
    const thumbnailFile = formData.get("file") as File | null;

    if (!title) throw new Error("Judul artikel wajib diisi");

    // --- OTOMATISASI DATA (LOGIKA SERVER) ---
    const lastId = await getArticleLastId();
    const id = lastId + 1;
    const slug = generateSlug(title);
    const publishDate = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Hitung total konten untuk estimasi waktu baca
    const sections = JSON.parse(sectionsRaw || "[]");
    const totalTextContent =
      excerpt + " " + sections.map((s: any) => s.content).join(" ");
    const readTime = calculateReadTime(totalTextContent);

    // --- 1. UPLOAD THUMBNAIL KE DRIVE ---
    let thumbnailUrl = "";
    if (thumbnailFile && thumbnailFile.size > 0) {
      const upload = await uploadToDrive(thumbnailFile, folderId);
      if (upload.success) thumbnailUrl = upload.imageUrl || "";
    }

    // --- 2. SIMPAN KE SHEET "Articles" ---
    const articleSave = await saveToSheets({
      range: "artikel!A2:L",
      values: [
        [
          id,
          title,
          slug,
          category,
          excerpt,
          thumbnailUrl,
          author,
          publishDate,
          readTime,
          tags,
          "menunggu",
          "",
        ],
      ],
    });

    if (!articleSave.success)
      throw new Error(`Gagal simpan ke database: ${articleSave.error}`);

    // --- 3. SIMPAN KE SHEET "Sections" (RELASIONAL) ---
    if (sections.length > 0) {
      const sectionBatchId = Date.now();
      const sectionValues = sections.map((s: any, index: number) => [
        sectionBatchId + index, // unique section id
        id, // artikel_id (Foreign Key)
        s.type,
        s.content,
      ]);

      await saveToSheets({
        range: "artikel_section!A2:D",
        values: sectionValues,
      });
    }

    clearArtikelCache();

    return {
      success: true,
      message: "Artikel berhasil diunggah",
      data: {
        id,
        title,
        slug,
        category,
        excerpt,
        thumbnail: thumbnailUrl,
        author,
        publishDate,
        readTime,
        tags,
        status: "menunggu",
        revisi_msg: "",
      },
    };
  } catch (error: any) {
    console.error("Error createArtikel:", error);
    return { success: false, message: error.message || "Gagal upload artikel" };
  }
}

export async function updateArtikel(req: Request) {
  try {
    const formData = await req.formData();
    const spreadsheetId = process.env.SPREADSHEET_ID!;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ARTIKEL_ID as string;

    const id = formData.get("id") as string;
    const role = formData.get("role") as string;

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:L",
    });

    const rows = res.data.values || [];

    // Gunakan pencarian aman String() agar tidak luput tipe data
    const rowIndex = rows.findIndex((row) => String(row[0]) === String(id));

    if (rowIndex === -1) {
      return { success: false, message: "Artikel tidak ditemukan" };
    }

    const oldRow = rows[rowIndex];
    let thumbnailUrl = oldRow[5] || "";

    // upload gambar baru jika ada
    const thumbnailFile = formData.get("file") as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      const upload = await uploadToDrive(thumbnailFile, folderId);
      if (upload.success) {
        thumbnailUrl = upload.imageUrl || "";
      } else {
        return { success: false, message: "Gagal upload thumbnail baru" };
      }
    }

    // Ambil data yang mungkin diubah, fallback ke data lama jika tidak dikirim
    const title =
      formData.get("title") !== null
        ? (formData.get("title") as string)
        : oldRow[1] || "";
    const category =
      formData.get("category") !== null
        ? (formData.get("category") as string)
        : oldRow[3] || "";
    const excerpt =
      formData.get("excerpt") !== null
        ? (formData.get("excerpt") as string)
        : oldRow[4] || "";
    const author =
      formData.get("author") !== null
        ? (formData.get("author") as string)
        : oldRow[6] || "";
    const tags =
      formData.get("tags") !== null
        ? (formData.get("tags") as string)
        : oldRow[9] || "";
    const sectionsRaw = formData.get("sections") as string;

    const sections = JSON.parse(sectionsRaw || "[]");
    const totalTextContent =
      excerpt + " " + sections.map((s: any) => s.content).join(" ");
    const readTime = calculateReadTime(totalTextContent);
    const slug = generateSlug(title);

    // Smart Status Update
    const currentStatus = oldRow[10] || "menunggu";
    let newStatus = "menunggu";
    let newRevisiMsg = "";

    if (role === "admin") {
      newStatus = currentStatus;
      newRevisiMsg = oldRow[11] || "";
    }

    const updatedRow = [
      oldRow[0], // id
      title,
      slug,
      category,
      excerpt,
      thumbnailUrl,
      author,
      oldRow[7], // publishDate tetap
      readTime,
      tags,
      newStatus,
      newRevisiMsg,
    ];

    const actualRow = rowIndex + 2;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `artikel!A${actualRow}:L${actualRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow],
      },
    });

    // --- MENGURUS SECTION BARU ---
    const resSections = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel_section!A2:D",
    });

    const sectionRows = resSections.data.values || [];
    const filteredSections = sectionRows.filter(
      (row) => String(row[1]) !== String(id),
    );

    const newSectionValues = sections.map((s: any, index: number) => [
      Date.now() + index,
      id,
      s.type,
      s.content,
    ]);

    const finalSections = [...filteredSections, ...newSectionValues];

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "artikel_section!A2:D",
    });

    if (finalSections.length > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "artikel_section!A2:D",
        valueInputOption: "RAW",
        requestBody: {
          values: finalSections,
        },
      });
    }

    clearArtikelCache();

    return { success: true, message: "Artikel berhasil diperbarui" };
  } catch (error: any) {
    console.error("Update Artikel Error:", error);
    return { success: false, message: error.message || "Gagal update data" };
  }
}

export async function deleteArtikel(id: number) {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const artikelSheetId = Number(process.env.ARTIKEL_SHEET_ID);
    const sectionSheetId = Number(process.env.ARTIKEL_SECTION_SHEET_ID);

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID belum diatur");
    }

    const sheets = google.sheets({ version: "v4", auth });

    // =========================
    // AMBIL DATA ARTIKEL
    // =========================
    const artikelRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:L",
    });

    const artikelRows = artikelRes.data.values || [];
    const artikelIndex = artikelRows.findIndex((row) => Number(row[0]) === id);

    if (artikelIndex === -1) {
      return { success: false, message: "Artikel tidak ditemukan" };
    }

    // =========================
    // AMBIL DATA SECTION
    // =========================
    const sectionRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel_section!A2:D",
    });

    const sectionRows = sectionRes.data.values || [];
    const sectionIndexes: number[] = [];

    sectionRows.forEach((row, index) => {
      if (Number(row[1]) === id) {
        sectionIndexes.push(index);
      }
    });

    // =========================
    // HAPUS SECTION DULU (dari bawah ke atas)
    // =========================
    for (const index of sectionIndexes.reverse()) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sectionSheetId,
                  dimension: "ROWS",
                  startIndex: index + 1,
                  endIndex: index + 2,
                },
              },
            },
          ],
        },
      });
    }

    // =========================
    // HAPUS ARTIKEL
    // =========================
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: artikelSheetId,
                dimension: "ROWS",
                startIndex: artikelIndex + 1,
                endIndex: artikelIndex + 2,
              },
            },
          },
        ],
      },
    });

    clearArtikelCache();

    return { success: true, message: "Artikel berhasil dihapus" };
  } catch (error) {
    console.error("Error deleteArtikel:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

// =====================================
// FUNGSI BARU UNTUK SETUJUI & REVISI
// =====================================
export async function reviewArtikel(req: Request) {
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
      range: "artikel!A2:A",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) throw new Error("Data tidak ditemukan");

    const rowIndex = rows.findIndex((row) => String(row[0]) === String(id));
    if (rowIndex === -1) throw new Error("Artikel tidak ditemukan");

    const targetRow = rowIndex + 2;

    // Artikel memiliki kolom Status di K (index 10) dan Pesan Revisi di L (index 11)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `artikel!K${targetRow}:L${targetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status, revisiMsg]],
      },
    });

    clearArtikelCache();

    return {
      success: true,
      message: `Status berhasil diubah menjadi ${status}`,
    };
  } catch (error) {
    console.error("Error reviewArtikel:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Gagal memberikan review",
    };
  }
}
