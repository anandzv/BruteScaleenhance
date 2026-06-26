import { Router } from "express";
import { db, plansTable } from "../db.js";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

// Public: GET /api/plans?service=minecraft
router.get("/", async (req, res) => {
  try {
    const { service } = req.query;
    let rows = await db
      .select()
      .from(plansTable)
      .where(eq(plansTable.status, "active"))
      .orderBy(asc(plansTable.sortOrder));
    if (service) rows = rows.filter(r => r.service === service);
    rows = rows.map(r => ({ ...r, features: tryParse(r.features, []) }));
    return res.json({ plans: rows });
  } catch (err) {
    console.error("list plans error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: GET /api/plans/admin
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const rows = await db.select().from(plansTable).orderBy(asc(plansTable.sortOrder));
    return res.json({ plans: rows.map(r => ({ ...r, features: tryParse(r.features, []) })) });
  } catch (err) {
    console.error("admin list plans error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: POST /api/plans
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      service = "minecraft", title, price = 0, currency = "INR",
      billingPeriod = "monthly", cpu, ram, storage, bandwidth, location,
      buttonText = "Order Now", buttonUrl, features = [], badge,
      popular = 0, bgColor, status = "active", sortOrder = 0,
    } = req.body;
    if (!title) return res.status(400).json({ error: "title is required." });
    const [row] = await db.insert(plansTable).values({
      service, title, price: Number(price), currency, billingPeriod,
      cpu: cpu || null, ram: ram || null, storage: storage || null,
      bandwidth: bandwidth || null, location: location || null,
      buttonText, buttonUrl: buttonUrl || null,
      features: JSON.stringify(Array.isArray(features) ? features : []),
      badge: badge || null, popular: popular ? 1 : 0,
      bgColor: bgColor || null, status, sortOrder: Number(sortOrder) || 0,
    }).returning();
    return res.status(201).json({ plan: { ...row, features: tryParse(row.features, []) } });
  } catch (err) {
    console.error("create plan error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: PATCH /api/plans/:id
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    const body = { ...req.body };
    if (body.features !== undefined) body.features = JSON.stringify(Array.isArray(body.features) ? body.features : []);
    if (body.popular !== undefined) body.popular = body.popular ? 1 : 0;
    if (body.price !== undefined) body.price = Number(body.price);
    if (body.sortOrder !== undefined) body.sortOrder = Number(body.sortOrder);
    const [row] = await db.update(plansTable).set(body).where(eq(plansTable.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Plan not found." });
    return res.json({ plan: { ...row, features: tryParse(row.features, []) } });
  } catch (err) {
    console.error("update plan error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: DELETE /api/plans/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    await db.delete(plansTable).where(eq(plansTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete plan error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

function tryParse(val, fallback) {
  try { return JSON.parse(val || "[]"); } catch { return fallback; }
}

export default router;
