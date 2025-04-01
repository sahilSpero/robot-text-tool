import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findRoboUserbyUserId, generateTokenForRoboUser } from "@/server/helpers";

export async function GET(req) {
  try {
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Access denied. No token provided." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    // Fetch user data
    const user = await findRoboUserbyUserId(decoded.userId, "authCodeHash");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a new token for the user
    const newToken = await generateTokenForRoboUser(user);

    return NextResponse.json({ user, token: newToken });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
