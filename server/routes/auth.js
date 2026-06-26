import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "../db.js";
import { eq, or } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ override: true });

const router = Router();
const JWT_SECRET  = process.env.JWT_SECRET  || "brutescale-dev-secret-change-in-prod";
const SALT_ROUNDS = 12;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields are required." });
    if (username.trim().length < 3)
      return res.status(400).json({ error: "Username must be at least 3 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email address." });
    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match." });

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(or(eq(usersTable.email, email.toLowerCase()), eq(usersTable.username, username.trim())))
      .limit(1);

    if (existing.length > 0)
      return res.status(409).json({ error: "Username or email already in use." });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await db
      .insert(usersTable)
      .values({ username: username.trim(), email: email.toLowerCase(), passwordHash, role: "user" })
      .returning({ id: usersTable.id, username: usersTable.username, email: usersTable.email, role: usersTable.role });

    const isAdmin = user.role === "admin";
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
    return res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin } });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ error: "Username/email and password are required." });

    const isEmail = identifier.includes("@");
    const [user] = await db
      .select()
      .from(usersTable)
      .where(isEmail ? eq(usersTable.email, identifier.toLowerCase()) : eq(usersTable.username, identifier.trim()))
      .limit(1);

    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const isAdmin = user.role === "admin";
    const token = jwt.sign({ id: user.id, username: user.username, isAdmin }, JWT_SECRET, { expiresIn: "30d" });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized." });

    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    const [user] = await db
      .select({ id: usersTable.id, username: usersTable.username, email: usersTable.email, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.id, payload.id))
      .limit(1);

    if (!user) return res.status(401).json({ error: "User not found." });
    const isAdmin = user.role === "admin";
    return res.json({ user: { id: user.id, username: user.username, email: user.email, isAdmin } });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
});

export default router;
