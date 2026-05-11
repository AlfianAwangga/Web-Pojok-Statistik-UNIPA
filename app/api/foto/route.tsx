import { NextResponse } from "next/server";
import { createFoto, getFoto } from "@/utils/foto-services";

export async function GET() {
  try {
    const data = await getFoto();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data foto" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const result = await createFoto(req);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
