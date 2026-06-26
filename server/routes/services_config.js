import { Router } from "express";
import { db, servicesConfigTable } from "../db.js";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();

const DEFAULT_SERVICES = [
  { slug: "minecraft", name: "Minecraft Hosting", icon: "⛏️", description: "High-performance Minecraft server hosting with DDoS protection.", features: '["DDoS Protection","Instant Setup","Custom Modpacks","24/7 Support"]', pricingLink: "/minecraft-hosting", orderUrl: "https://discord.gg/", sortOrder: 0 },
  { slug: "vps", name: "VPS Hosting", icon: "🖥️", description: "Scalable virtual private servers with full root access.", features: '["Full Root Access","SSD NVMe","KVM Virtualization","Multiple OS"]', pricingLink: "/vps-hosting", orderUrl: "https://discord.gg/", sortOrder: 1 },
  { slug: "rdp", name: "RDP Hosting", icon: "🪟", description: "Windows RDP servers for remote desktop access.", features: '["Windows Server","Remote Desktop","High RAM","Fast SSD"]', pricingLink: "/rdp-hosting", orderUrl: "https://discord.gg/", sortOrder: 2 },
  { slug: "dedicated", name: "Dedicated Servers", icon: "🔩", description: "Bare-metal dedicated servers for maximum performance.", features: '["Bare Metal","Custom Hardware","Unmetered Bandwidth","Full Control"]', pricingLink: "#", orderUrl: "https://discord.gg/", sortOrder: 3 },
  { slug: "discord-bot", name: "Discord Bot Hosting", icon: "🤖", description: "24/7 Discord bot hosting with instant deployment.", features: '["24/7 Uptime","Multiple Languages","Auto Restart","Discord Support"]', pricingLink: "#", orderUrl: "https://discord.gg/", sortOrder: 4 },
  { slug: "web-hosting", name: "Web Hosting", icon: "🌐", description: "Fast web hosting with one-click installs.", features: '["cPanel Access","SSL Included","99.9% Uptime","One-Click Install"]', pricingLink: "#", orderUrl: "https://discord.gg/", sortOrder: 5 },
];

// Seed defaults if empty
async function seedIfEmpty() {
  const existing = await db.select({ id: servicesConfigTable.id }).from(servicesConfigTable).limit(1);
  if (existing.length === 0) {
    for (const s of DEFAULT_SERVICES) {
      await db.insert(servicesConfigTable).values(s).onConflictDoNothing();
    }
  }
}

// Public: GET /api/services-config
router.get("/", async (req, res) => {
  try {
    await seedIfEmpty();
    const rows = await db.select().from(servicesConfigTable)
      .where(eq(servicesConfigTable.visible, 1))
      .orderBy(asc(servicesConfigTable.sortOrder));
    return res.json({ services: rows.map(r => ({ ...r, features: tryParse(r.features, []) })) });
  } catch (err) {
    console.error("list services error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: GET /api/services-config/admin
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    await seedIfEmpty();
    const rows = await db.select().from(servicesConfigTable).orderBy(asc(servicesConfigTable.sortOrder));
    return res.json({ services: rows.map(r => ({ ...r, features: tryParse(r.features, []) })) });
  } catch (err) {
    console.error("admin list services error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: POST /api/services-config
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { slug, name, icon = "🖥️", description, features = [], pricingLink, orderUrl, imageUrl, visible = 1, sortOrder = 0 } = req.body;
    if (!slug || !name) return res.status(400).json({ error: "slug and name are required." });
    const [row] = await db.insert(servicesConfigTable).values({
      slug, name, icon, description: description || null,
      features: JSON.stringify(Array.isArray(features) ? features : []),
      pricingLink: pricingLink || null, orderUrl: orderUrl || null,
      imageUrl: imageUrl || null, visible: visible ? 1 : 0, sortOrder: Number(sortOrder) || 0,
    }).returning();
    return res.status(201).json({ service: { ...row, features: tryParse(row.features, []) } });
  } catch (err) {
    console.error("create service error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: PATCH /api/services-config/:id
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    const body = { ...req.body };
    if (body.features !== undefined) body.features = JSON.stringify(Array.isArray(body.features) ? body.features : []);
    if (body.visible !== undefined) body.visible = body.visible ? 1 : 0;
    if (body.sortOrder !== undefined) body.sortOrder = Number(body.sortOrder);
    const [row] = await db.update(servicesConfigTable).set(body).where(eq(servicesConfigTable.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Service not found." });
    return res.json({ service: { ...row, features: tryParse(row.features, []) } });
  } catch (err) {
    console.error("update service error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Admin: DELETE /api/services-config/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    await db.delete(servicesConfigTable).where(eq(servicesConfigTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete service error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

function tryParse(val, fallback) {
  try { return JSON.parse(val || "[]"); } catch { return fallback; }
}

export default router;
