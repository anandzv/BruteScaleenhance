import { Router } from "express";
import { db, docsTable } from "../db.js";
import { eq, asc, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

// Public: GET /api/docs?category=general&published=1
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let rows = await db.select().from(docsTable)
      .where(eq(docsTable.published, 1))
      .orderBy(asc(docsTable.sortOrder), desc(docsTable.createdAt));
    if (category) rows = rows.filter(r => r.category === category);
    return res.json({ docs: rows });
  } catch (err) {
    console.error("list docs error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: GET /api/docs/admin
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(docsTable)
      .orderBy(asc(docsTable.sortOrder), desc(docsTable.createdAt));
    return res.json({ docs: rows });
  } catch (err) {
    console.error("admin list docs error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: POST /api/docs
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { category = "general", title, slug, content = "", published = 0, sortOrder = 0 } = req.body;
    if (!title) return res.status(400).json({ error: "title is required." });
    const autoSlug = slug || title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [row] = await db.insert(docsTable).values({
      category, title, slug: autoSlug, content,
      published: published ? 1 : 0, sortOrder: Number(sortOrder) || 0,
    }).returning();
    return res.status(201).json({ doc: row });
  } catch (err) {
    console.error("create doc error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: PATCH /api/docs/:id
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    const body = { ...req.body, updatedAt: new Date().toISOString() };
    if (body.published !== undefined) body.published = body.published ? 1 : 0;
    if (body.sortOrder !== undefined) body.sortOrder = Number(body.sortOrder);
    const [row] = await db.update(docsTable).set(body).where(eq(docsTable.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Doc not found." });
    return res.json({ doc: row });
  } catch (err) {
    console.error("update doc error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: DELETE /api/docs/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    await db.delete(docsTable).where(eq(docsTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete doc error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
