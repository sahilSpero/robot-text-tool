import { NextResponse } from "next/server";
import { findRoboUserbyEmail, updateVerifyCode, sentAuthCodeByEmail } from "@/server/helpers/index";
import connectDb from "@/server/database/connectDb";

export async function POST(req) {
  try {
    await connectDb();
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await findRoboUserbyEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const authCode = await updateVerifyCode(user);
    await sentAuthCodeByEmail(email, authCode, "resend");

    return NextResponse.json({ message: "New verification code sent to your email" });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
