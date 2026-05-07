import { NextResponse } from "next/server";
import { createInfografis, getInfografis } from "@/utils/infografis-services";

export async function GET() {
  try {
    const data = await getInfografis();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data infografis" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const result = await createInfografis(req);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
