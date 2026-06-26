import dotenv from "dotenv";

// ─── Load .env before anything else ──────────────────────────────────────────
const dotenvResult = dotenv.config({ override: true });
console.log("");
if (dotenvResult.error) {
  console.log("  [env] No .env file found — using environment variables / defaults");
} else {
  console.log("  [env] .env loaded successfully");
}

import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, adminSettingsTable, usersTable } from "./db.js";
import { eq } from "drizzle-orm";
import authRouter        from "./routes/auth.js";
import adminRouter       from "./routes/admin.js";
import reviewsRouter     from "./routes/reviews.js";
import plansRouter       from "./routes/plans.js";
import servicesRouter    from "./routes/services_config.js";
import docsRouter        from "./routes/docs_admin.js";
import mediaRouter       from "./routes/media.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT   = parseInt(process.env.PORT || "3000", 10);
const isProd = process.env.NODE_ENV === "production";

const distDir   = path.resolve(__dirname, "../dist");
const indexHtml = path.join(distDir, "index.html");
const uploadsDir = path.resolve(__dirname, "../data/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      imgSrc:      ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc:  ["'self'"],
      workerSrc:   ["'self'", "blob:"],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProd ? "combined" : "dev"));

// ─── Uploaded media ───────────────────────────────────────────────────────────
app.use("/uploads", express.static(uploadsDir, { maxAge: isProd ? "7d" : 0 }));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",            authRouter);
app.use("/api/admin",           adminRouter);
app.use("/api/reviews",         reviewsRouter);
app.use("/api/plans",           plansRouter);
app.use("/api/services-config", servicesRouter);
app.use("/api/docs",            docsRouter);
app.use("/api/media",           mediaRouter);

app.get("/api/healthz", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/api/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(adminSettingsTable);
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    return res.json({ settings });
  } catch {
    return res.json({ settings: {} });
  }
});

// ─── Static frontend ──────────────────────────────────────────────────────────
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    maxAge: isProd ? "7d" : 0,
    etag: true,
    index: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  }));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "API route not found." });
    if (!fs.existsSync(indexHtml)) return res.status(503).send("Frontend not built. Run: npm run build");
    res.sendFile(indexHtml);
  });
} else {
  app.get("*", (_req, res) => {
    if (_req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found." });
    res.status(503).send(`<h2>Frontend not built</h2><p>Run <code>npm run build</code></p>`);
  });
}

// ─── 500 handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[error]", err?.message || err);
  res.status(500).json({ error: "Internal server error." });
});

// ─── Admin account bootstrap ──────────────────────────────────────────────────
// Runs on every startup:
//   • Creates the admin account if it does not exist.
//   • Resets the password to ADMIN_PASSWORD if it already exists.
//   • Always ensures role = admin.
// After setup it verifies a real bcrypt.compare() to confirm the hash works.
async function ensureAdminAccount() {
  const ADMIN_EMAIL    = (process.env.ADMIN_EMAIL    || "ipc23771@gmail.com").toLowerCase().trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "ipc23771").trim();
  const JWT_SECRET     = process.env.JWT_SECRET || "brutescale-dev-secret-change-in-prod";
  const SALT_ROUNDS    = 12;

  console.log("  ─── Admin account bootstrap ────────────────────────────");
  console.log(`  [env] ADMIN_EMAIL    = ${ADMIN_EMAIL}`);
  console.log(`  [env] ADMIN_PASSWORD = ${"*".repeat(ADMIN_PASSWORD.length)} (${ADMIN_PASSWORD.length} chars)`);

  try {
    // 1. Look up existing account
    const [existing] = await db
      .select({ id: usersTable.id, email: usersTable.email, role: usersTable.role, passwordHash: usersTable.passwordHash })
      .from(usersTable)
      .where(eq(usersTable.email, ADMIN_EMAIL))
      .limit(1);

    console.log(`  [db]  Admin found    = ${existing ? `yes (id=${existing.id}, role=${existing.role})` : "no"}`);

    // 2. Hash the target password
    console.log("  [bcrypt] Generating password hash...");
    const newHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    console.log(`  [bcrypt] Hash generated: ${newHash.slice(0, 20)}...`);

    if (!existing) {
      // Create new admin account
      const username = ADMIN_EMAIL.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 20) || "admin";
      await db.insert(usersTable).values({
        username,
        email: ADMIN_EMAIL,
        passwordHash: newHash,
        role: "admin",
      });
      console.log(`  [db]  Admin created  = yes (username=${username})`);
    } else {
      // Update password + ensure role=admin
      await db
        .update(usersTable)
        .set({ passwordHash: newHash, role: "admin" })
        .where(eq(usersTable.email, ADMIN_EMAIL));
      console.log(`  [db]  Password reset = yes`);
      console.log(`  [db]  Role enforced  = admin`);
    }

    // 3. Re-fetch and verify bcrypt.compare works
    const [verified] = await db
      .select({ passwordHash: usersTable.passwordHash, role: usersTable.role })
      .from(usersTable)
      .where(eq(usersTable.email, ADMIN_EMAIL))
      .limit(1);

    const compareOk = await bcrypt.compare(ADMIN_PASSWORD, verified.passwordHash);
    console.log(`  [bcrypt] Login comparison = ${compareOk ? "✓ PASS" : "✗ FAIL"}`);

    if (!compareOk) {
      console.error("  ⚠️  CRITICAL: bcrypt.compare failed after writing hash — login will not work!");
      return;
    }

    // 4. Verify a real JWT can be issued (smoke-test the full login path)
    const token = jwt.sign({ id: 0, username: "admin", isAdmin: true }, JWT_SECRET, { expiresIn: "1m" });
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`  [jwt]  Token smoke test  = ${decoded.isAdmin ? "✓ PASS" : "✗ FAIL"}`);

    console.log("  ─────────────────────────────────────────────────────────");
    console.log("  Admin account ready:");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Role:     ${verified.role}`);
    console.log("  ─────────────────────────────────────────────────────────");
  } catch (err) {
    console.error("  ⚠️  ensureAdminAccount failed:", err?.message);
    console.error(err);
  }
}

// ─── Start ────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, "0.0.0.0", async () => {
  console.log(`  🚀 BruteScale is running`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  API: http://localhost:${PORT}/api/healthz`);
  if (!fs.existsSync(distDir)) {
    console.log("  ⚠️  No /dist folder. Run: npm run build");
  }
  await ensureAdminAccount();
  console.log("");
});

function shutdown(signal) {
  console.log(`\n${signal} — shutting down gracefully...`);
  server.close(() => { console.log("Server closed."); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
