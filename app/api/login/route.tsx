import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/utils/auth-services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { username, password } = body;

    const result = await loginUser(username, password);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 401,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
