import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db, mediaTable } from "../db.js";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../data/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|ico|pdf)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error("File type not allowed."));
  },
});

const router = Router();

// Admin: GET /api/media
router.get("/", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(mediaTable).orderBy(desc(mediaTable.createdAt));
    return res.json({ media: rows });
  } catch (err) {
    console.error("list media error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: POST /api/media/upload
router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const { filename, originalname, mimetype, size } = req.file;
    const url = `/uploads/${filename}`;
    const mediaType = mimetype.startsWith("video") ? "video" : mimetype.startsWith("image") ? "image" : "other";
    const [row] = await db.insert(mediaTable).values({
      filename, originalName: originalname, mimeType: mimetype,
      size, url, mediaType,
    }).returning();
    return res.status(201).json({ media: row });
  } catch (err) {
    console.error("upload error:", err);
    return res.status(500).json({ error: err.message || "Upload failed." });
  }
});

// Admin: DELETE /api/media/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    const [row] = await db.select().from(mediaTable).where(eq(mediaTable.id, id)).limit(1);
    if (!row) return res.status(404).json({ error: "Media not found." });
    const filePath = path.join(uploadDir, row.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await db.delete(mediaTable).where(eq(mediaTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete media error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
