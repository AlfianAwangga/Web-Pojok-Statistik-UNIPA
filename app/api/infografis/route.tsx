import { NextResponse } from "next/server";
import {
  createInfografis,
  deleteInfografis,
  getInfografis,
  updateInfografis,
} from "@/utils/infografis-services";

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

export async function PUT(req: Request) {
  const result = await updateInfografis(req);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID tidak valid",
        },
        { status: 400 },
      );
    }

    const result = await deleteInfografis(id);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
      },
      { status: 500 },
    );
  }
}
