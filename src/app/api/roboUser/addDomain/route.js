import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findRoboUserbyUserId } from "@/server/helpers";
import connectDb from "@/server/database/connectDb";

export async function POST(req) {
  try {
    connectDb();
    // Extract token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
    console.log(authHeader, "authHeader");
    const token = authHeader.split(" ")[1];
    console.log(token, "tokenssss");

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 403 }
      );
    }
    console.log(decoded, "decoded");
    // Parse request body
    const {domainName} = await req.json();
    console.log(domainName, "domainName")
    // const { domainName } = body;
    if (!domainName) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 }
      );
    }
    console.log("decoded 1");

    // Find user
    const user = await findRoboUserbyUserId(decoded.userId, "userId");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("decoded 2");
    // Check if domain already exists
    const domainExists = user.domains.some(
      (domain) => domain.name === domainName
    );
    if (domainExists) {
      return NextResponse.json(
        { error: "Domain already exists for this user" },
        { status: 400 }
      );
    }
    console.log("decoded 3");
    // Add new domain
    user.domains.push({ name: domainName, createdAt: new Date() });
    await user.save();

    return NextResponse.json({
      message: "Domain added successfully",
      data: user.domains,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
