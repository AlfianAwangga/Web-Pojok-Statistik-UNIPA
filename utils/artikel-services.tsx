import { auth } from "./google-auth";
import { uploadToDrive } from "./google-drive";
import { saveToSheets } from "./google-sheets";
import { google } from "googleapis";

export async function getArtikel() {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheets = google.sheets({ version: "v4", auth });

    // 1. Ambil data dari sheet Articles
    const resArticles = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:K",
    });

    // 2. Ambil data dari sheet Sections
    const resSections = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel_section!A2:D",
    });

    const articleRows = resArticles.data.values || [];
    const sectionRows = resSections.data.values || [];

    // 3. Gabungkan Data (Join Logic)
    const formattedArticles = articleRows.map((row) => {
      const articleId = Number(row[0]);

      // Cari section yang milik artikel ini (artikel_id di kolom index 1)
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
        status: row[10] || "draft",
        sections: sections, // Hasil penggabungan
      };
    });

    return formattedArticles;
  } catch (error) {
    console.error("Error getArticles:", error);
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
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "artikel!A2:A",
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) return 0;
    return Number(rows[rows.length - 1][0]) || 0;
  } catch (error) {
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
    const author = (formData.get("author") as string) || "Admin";
    const tags = formData.get("tags") as string;
    const status = formData.get("status") as string;
    const sectionsRaw = formData.get("sections") as string; // JSON string dari frontend
    const thumbnailFile = formData.get("file") as File | null;

    if (!title) throw new Error("Judul artikel wajib diisi");

    // --- OTOMATISASI DATA (LOGIKA SERVER) ---
    const id = (await getArticleLastId()) + 1;
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
    if (thumbnailFile) {
      const upload = await uploadToDrive(thumbnailFile, folderId);
      if (upload.success) thumbnailUrl = upload.imageUrl || "";
    }

    // --- 2. SIMPAN KE SHEET "Articles" ---
    const articleSave = await saveToSheets({
      range: "artikel!A2:K",
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
          status,
        ],
      ],
    });

    if (!articleSave.success) throw new Error("Gagal simpan ke sheet Articles");

    // --- 3. SIMPAN KE SHEET "Sections" (RELASIONAL) ---
    if (sections.length > 0) {
      const sectionBatchId = Date.now();
      // Setiap section disimpan sebagai baris baru dengan artikel_id yang sama
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

    return {
      success: true,
      message: "Artikel berhasil dibuat otomatis",
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
        status,
      },
    };
  } catch (error: any) {
    console.error("Service Error:", error);
    return { success: false, message: error.message };
  }
}
