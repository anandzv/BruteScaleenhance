import jwt from "jsonwebtoken";
import { db, usersTable } from "../db.js";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "brutescale-dev-secret-change-in-prod";

export async function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);

    // Always verify role from DB — never trust JWT payload alone.
    // This means promoting/demoting an account takes effect immediately
    // without requiring the user to log out and back in.
    const [user] = await db
      .select({ id: usersTable.id, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, payload.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    req.adminPayload = { ...payload, isAdmin: true };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
