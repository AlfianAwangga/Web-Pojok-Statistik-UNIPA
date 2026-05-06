import { google } from "googleapis";
import { auth } from "@/utils/google-auth";

export async function saveToSheets(params: {
  range: string;
  values: (string | number | boolean | null)[][]; // Diperluas sedikit untuk jaga-jaga ada tipe data boolean/null
}) {
  try {
    // 1. Validasi Environment Variable
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID belum diatur di dalam file .env");
    }

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: params.range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: params.values,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error pada saveToSheets:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui saat menyimpan ke Sheets",
    };
  }
}
