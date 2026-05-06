// components/utils/google-sheets.ts
import { google } from "googleapis";
import { InfografisModel } from "@/data/infografis-model";

// Inisialisasi Auth
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
});

const sheets = google.sheets({ version: "v4", auth });

// Fungsi Fetch Data Infografis
export async function getInfografis(): Promise<InfografisModel[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "infografis!A2:H", // Sesuaikan dengan nama Sheet dan Range Anda
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    // Mapping baris Google Sheets ke Interface TypeScript
    return rows.map((row) => {
      const driveImageId = row[6] || "";

      return {
        id: row[0],
        title: row[1],
        category: row[2],
        author: row[3],
        date: row[4],
        description: row[5],
        drive_image_id: driveImageId,
        // Trik Google Drive: Ubah ID menjadi URL yang bisa di-render di tag <img>
        image_url: driveImageId
          ? `https://drive.google.com/uc?export=view&id=${driveImageId}`
          : "/file.svg", // Fallback image jika kosong
      };
    });
  } catch (error) {
    console.error("Error fetching data dari Google Sheets:", error);
    return [];
  }
}
