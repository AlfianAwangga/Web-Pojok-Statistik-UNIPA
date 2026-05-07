import { NextResponse } from "next/server";
import { createArtikel, getArtikel } from "@/utils/artikel-services";

export async function GET() {
  try {
    const data = await getArtikel();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data artikel" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const result = await createArtikel(req);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error("API Route Error - POST /api/artikel:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal server saat memproses artikel.",
      },
      { status: 500 },
    );
  }
}
