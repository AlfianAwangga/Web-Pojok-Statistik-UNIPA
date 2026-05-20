import { NextResponse } from "next/server";
import { createUser, getUsers, updateUser } from "@/utils/auth-services";

export async function GET() {
  try {
    const data = await getUsers();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data infografis" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const result = await createUser(req);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

export async function PUT(req: Request) {
  const result = await updateUser(req);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
