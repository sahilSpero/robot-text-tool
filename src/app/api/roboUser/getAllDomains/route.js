import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findRoboUserbyUserId } from "@/server/helpers";

export async function GET(req) {
  try {
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 403 });
    }

    // Fetch user and domains
    const user = await findRoboUserbyUserId(decoded.userId, "domains");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return first 5 domains
    const Domains = user.domains;
    return NextResponse.json({ data: Domains });

  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
