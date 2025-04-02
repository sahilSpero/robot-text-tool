import connectDb from "@/server/database/connectDb";
import { fetchRoboUser } from "../../../../server/helpers/index";
import {
  sentAuthCodeByEmail,
  findRoboUserbyEmail,
  compareAuthCode,
  roboUserVerify,
  generateTokenForRoboUser,
} from "../../../../server/helpers/index";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();
    const { email, authCode } = await req.json();

    if (!email || !authCode) {
      return NextResponse.json(
        { error: "Email and auth code are required" },
        { status: 400 }
      );
    }

    const user = await findRoboUserbyEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      !user.authCodeExpiresAt ||
      new Date() > new Date(user.authCodeExpiresAt)
    ) {
      return NextResponse.json(
        { error: "Authentication code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (!user.authCodeHash) {
      return NextResponse.json(
        { error: "Invalid authentication attempt" },
        { status: 400 }
      );
    }

    const isMatch = await compareAuthCode(authCode, user.authCodeHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid authentication code" },
        { status: 400 }
      );
    }

    await roboUserVerify(user);
    const token = await generateTokenForRoboUser(user);

    const response = NextResponse.json({
      message: "Login successful",
      token,
      user,
    });

    response.cookies.set("authToken", token, {
      httpOnly: true, // Prevents JavaScript access (protects against XSS)
      path: "/", // Available on all pages
      maxAge: 7 * 24 * 60 * 60, // Expires in 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
