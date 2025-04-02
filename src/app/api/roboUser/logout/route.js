import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("authToken")?.value;
    if (!token)
      return NextResponse.json(
        { message: "unauthorized", errorMsg: "un authorized" },
        { status: 400 }
      );
    const response = NextResponse.json(
      {
        message: "logout successfully",
        data: { status: 200 },
        redirect: "/",
      },
      { status: 200 }
    );
    response.cookies.set("authToken", "", {
      httpOnly: true,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "something went wrong", error },
      { status: 400 }
    );
  }
}