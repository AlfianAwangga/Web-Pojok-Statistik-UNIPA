// app/api/infografis/route.ts
import { NextResponse } from "next/server";
import { getInfografis } from "@/components/utils/google-sheets";

// Method GET untuk dipanggil dari Client
export async function GET() {
  try {
    // Fungsi ini aman berjalan di sini karena ini adalah Server Route
    const data = await getInfografis();

    // Kembalikan data dalam format JSON ke browser
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data infografis" },
      { status: 500 },
    );
  }
}
