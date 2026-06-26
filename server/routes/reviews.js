import { Router } from "express";
import { db, reviewsTable } from "../db.js";
import { eq, and, asc, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

// ─── Public: GET /api/reviews?type=youtube|instagram|discord ──────────────────
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let query = db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.visible, 1))
      .orderBy(asc(reviewsTable.sortOrder), desc(reviewsTable.createdAt));

    const rows = await query;
    const filtered = type
      ? rows.filter((r) => r.type === type)
      : rows;
    return res.json({ reviews: filtered });
  } catch (err) {
    console.error("list reviews error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Admin: GET /api/reviews/admin ───────────────────────────────────────────
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(reviewsTable)
      .orderBy(asc(reviewsTable.sortOrder), desc(reviewsTable.createdAt));
    return res.json({ reviews: rows });
  } catch (err) {
    console.error("admin list reviews error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Admin: POST /api/reviews ─────────────────────────────────────────────────
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      type, thumbnailUrl, title, creator, uploadDate, videoUrl,
      caption, reelUrl, screenshotUrl, reviewer, message,
      visible = 1, sortOrder = 0,
    } = req.body;

    if (!type || !["youtube", "instagram", "discord"].includes(type)) {
      return res.status(400).json({ error: "type must be youtube, instagram, or discord." });
    }

    const [row] = await db
      .insert(reviewsTable)
      .values({
        type, visible: visible ? 1 : 0, sortOrder: Number(sortOrder) || 0,
        thumbnailUrl: thumbnailUrl || null,
        title: title || null,
        creator: creator || null,
        uploadDate: uploadDate || null,
        videoUrl: videoUrl || null,
        caption: caption || null,
        reelUrl: reelUrl || null,
        screenshotUrl: screenshotUrl || null,
        reviewer: reviewer || null,
        message: message || null,
      })
      .returning();

    return res.status(201).json({ review: row });
  } catch (err) {
    console.error("create review error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Admin: PATCH /api/reviews/:id ───────────────────────────────────────────
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });

    const allowed = [
      "visible", "sortOrder", "thumbnailUrl", "title", "creator",
      "uploadDate", "videoUrl", "caption", "reelUrl",
      "screenshotUrl", "reviewer", "message",
    ];

    const updates = {};
    for (const key of allowed) {
      if (key in req.body) {
        updates[key] = req.body[key];
      }
    }
    if ("visible" in updates) updates.visible = updates.visible ? 1 : 0;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    const [row] = await db
      .update(reviewsTable)
      .set(updates)
      .where(eq(reviewsTable.id, id))
      .returning();

    if (!row) return res.status(404).json({ error: "Review not found." });
    return res.json({ review: row });
  } catch (err) {
    console.error("update review error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ─── Admin: DELETE /api/reviews/:id ──────────────────────────────────────────
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete review error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
