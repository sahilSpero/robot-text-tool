import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key"; // Use environment variables

export function authenticateToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return user data
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
    return null;
  }
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject("Invalid or expired token");
      } else {
        resolve(decoded);
      }
    });
  });
}

export async function getUserFromRequest(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token); // Your function to verify JWT
    return decoded; // Assuming decoded contains user info like { userId: "123" }
  } catch (err) {
    return null;
  }
}
