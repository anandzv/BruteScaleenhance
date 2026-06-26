import { Router } from "express";
import { db, usersTable, adminSettingsTable, activityLogsTable } from "../db.js";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/admin.js";

const router = Router();
router.use(requireAdmin);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const users = await db.select({ id: usersTable.id }).from(usersTable);
    const logs  = await db.select({ id: activityLogsTable.id }).from(activityLogsTable);
    return res.json({
      totalUsers:    users.length,
      totalLogs:     logs.length,
      totalServices: 6,
      totalLocations: 3,
      websiteStatus: "Online",
      discordStatus: "Active",
    });
  } catch (err) {
    console.error("admin stats error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/admin/settings
router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(adminSettingsTable);
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    return res.json({ settings });
  } catch (err) {
    console.error("get settings error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/admin/settings
router.post("/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: "key is required." });
    await db
      .insert(adminSettingsTable)
      .values({ key, value: value ?? "" })
      .onConflictDoUpdate({ target: adminSettingsTable.key, set: { value: value ?? "", updatedAt: new Date().toISOString() } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("save setting error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/admin/settings/bulk
router.post("/settings/bulk", async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object")
      return res.status(400).json({ error: "settings object required." });
    for (const [key, value] of Object.entries(settings)) {
      await db
        .insert(adminSettingsTable)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({ target: adminSettingsTable.key, set: { value: String(value), updatedAt: new Date().toISOString() } });
    }
    return res.json({ ok: true, count: Object.keys(settings).length });
  } catch (err) {
    console.error("bulk save settings error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await db
      .select({ id: usersTable.id, username: usersTable.username, email: usersTable.email, createdAt: usersTable.createdAt })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt));
    return res.json({ users });
  } catch (err) {
    console.error("list users error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id." });
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    console.error("delete user error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/admin/logs
router.get("/logs", async (req, res) => {
  try {
    const logs = await db
      .select()
      .from(activityLogsTable)
      .orderBy(desc(activityLogsTable.createdAt))
      .limit(200);
    return res.json({ logs });
  } catch (err) {
    console.error("list logs error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/admin/logs
router.post("/logs", async (req, res) => {
  try {
    const { action, details, adminEmail } = req.body;
    if (!action || !adminEmail)
      return res.status(400).json({ error: "action and adminEmail required." });
    const [log] = await db
      .insert(activityLogsTable)
      .values({ action, details: details ?? null, adminEmail })
      .returning();
    return res.status(201).json({ log });
  } catch (err) {
    console.error("create log error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/admin/logs
router.delete("/logs", async (req, res) => {
  try {
    await db.delete(activityLogsTable);
    return res.json({ ok: true });
  } catch (err) {
    console.error("clear logs error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
