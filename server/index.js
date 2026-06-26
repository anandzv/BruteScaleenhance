import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db, adminSettingsTable } from "./db.js";
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

// ─── Uploaded media (served statically) ─────────────────────────────────────
app.use("/uploads", express.static(uploadsDir, { maxAge: isProd ? "7d" : 0 }));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth",            authRouter);
app.use("/api/admin",           adminRouter);
app.use("/api/reviews",         reviewsRouter);
app.use("/api/plans",           plansRouter);
app.use("/api/services-config", servicesRouter);
app.use("/api/docs",            docsRouter);
app.use("/api/media",           mediaRouter);

app.get("/api/healthz", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// Public settings (no auth required)
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

// ─── Static frontend ─────────────────────────────────────────────────────────
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
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API route not found." });
    }
    if (!fs.existsSync(indexHtml)) {
      return res.status(503).send("Frontend not built. Run: npm run build");
    }
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

// ─── Start ───────────────────────────────────────────────────────────────────
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log(`  🚀 BruteScale is running`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  API: http://localhost:${PORT}/api/healthz`);
  if (!fs.existsSync(distDir)) {
    console.log("");
    console.log("  ⚠️  No /dist folder found. Run: npm run build");
  }
  console.log("");
});

function shutdown(signal) {
  console.log(`\n${signal} — shutting down gracefully...`);
  server.close(() => { console.log("Server closed."); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
