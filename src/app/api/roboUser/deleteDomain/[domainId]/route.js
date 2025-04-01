import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { findRoboUserbyUserId } from "@/server/helpers";
import connectDb from "@/server/database/connectDb";

export async function DELETE(req, { params }) {
  try {
    connectDb();
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
           console.log(req, "req.query")
    // Extract domainId from params
    const { domainId } = params;
    if (!domainId) {
      return NextResponse.json({ error: "Domain ID is required" }, { status: 400 });
    }

    // Find user
    const user = await findRoboUserbyUserId(decoded.userId, "userId");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find domain index
    const domainIndex = user.domains.findIndex((domain) => domain._id.toString() === domainId);
    if (domainIndex === -1) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // Remove domain
    user.domains.splice(domainIndex, 1);
    await user.save();

    return NextResponse.json({ message: "Domain deleted successfully", data: user.domains });

  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
