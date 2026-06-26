import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "brutescale-dev-secret-change-in-prod";

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    if (!payload.isAdmin) {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }
    req.adminPayload = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
