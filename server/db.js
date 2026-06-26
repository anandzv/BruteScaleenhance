import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(path.join(dataDir, "brutescale.db"));
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT NOT NULL UNIQUE,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS admin_settings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    key        TEXT NOT NULL UNIQUE,
    value      TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS activity_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    action      TEXT NOT NULL,
    details     TEXT,
    admin_email TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    type           TEXT NOT NULL CHECK(type IN ('youtube','instagram','discord')),
    visible        INTEGER NOT NULL DEFAULT 1,
    sort_order     INTEGER NOT NULL DEFAULT 0,
    thumbnail_url  TEXT,
    title          TEXT,
    creator        TEXT,
    upload_date    TEXT,
    video_url      TEXT,
    caption        TEXT,
    reel_url       TEXT,
    screenshot_url TEXT,
    reviewer       TEXT,
    message        TEXT,
    rating         INTEGER DEFAULT 5,
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS plans (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    service        TEXT NOT NULL DEFAULT 'minecraft',
    title          TEXT NOT NULL,
    price          REAL NOT NULL DEFAULT 0,
    currency       TEXT NOT NULL DEFAULT 'INR',
    billing_period TEXT NOT NULL DEFAULT 'monthly',
    cpu            TEXT,
    ram            TEXT,
    storage        TEXT,
    bandwidth      TEXT,
    location       TEXT,
    button_text    TEXT DEFAULT 'Order Now',
    button_url     TEXT,
    features       TEXT DEFAULT '[]',
    badge          TEXT,
    popular        INTEGER DEFAULT 0,
    bg_color       TEXT,
    status         TEXT DEFAULT 'active',
    sort_order     INTEGER DEFAULT 0,
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS services_config (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    slug         TEXT NOT NULL UNIQUE,
    name         TEXT NOT NULL,
    icon         TEXT DEFAULT '🖥️',
    description  TEXT,
    features     TEXT DEFAULT '[]',
    pricing_link TEXT,
    order_url    TEXT,
    image_url    TEXT,
    visible      INTEGER DEFAULT 1,
    sort_order   INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS docs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    category   TEXT NOT NULL DEFAULT 'general',
    title      TEXT NOT NULL,
    slug       TEXT,
    content    TEXT NOT NULL DEFAULT '',
    published  INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS media (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    filename      TEXT NOT NULL,
    original_name TEXT,
    mime_type     TEXT,
    size          INTEGER,
    url           TEXT,
    media_type    TEXT DEFAULT 'image',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── Migrations: add columns to existing DBs that predate them ────────────────
const migrations = [
  "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'",
  "ALTER TABLE reviews ADD COLUMN rating INTEGER DEFAULT 5",
];
for (const sql of migrations) {
  try { sqlite.exec(sql); } catch { /* column already exists — safe to ignore */ }
}

export const usersTable = sqliteTable("users", {
  id:           integer("id").primaryKey({ autoIncrement: true }),
  username:     text("username").notNull().unique(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role:         text("role").notNull().default("user"),
  createdAt:    text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const adminSettingsTable = sqliteTable("admin_settings", {
  id:        integer("id").primaryKey({ autoIncrement: true }),
  key:       text("key").notNull().unique(),
  value:     text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const activityLogsTable = sqliteTable("activity_logs", {
  id:         integer("id").primaryKey({ autoIncrement: true }),
  action:     text("action").notNull(),
  details:    text("details"),
  adminEmail: text("admin_email").notNull(),
  createdAt:  text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const reviewsTable = sqliteTable("reviews", {
  id:            integer("id").primaryKey({ autoIncrement: true }),
  type:          text("type").notNull(),
  visible:       integer("visible").notNull().default(1),
  sortOrder:     integer("sort_order").notNull().default(0),
  thumbnailUrl:  text("thumbnail_url"),
  title:         text("title"),
  creator:       text("creator"),
  uploadDate:    text("upload_date"),
  videoUrl:      text("video_url"),
  caption:       text("caption"),
  reelUrl:       text("reel_url"),
  screenshotUrl: text("screenshot_url"),
  reviewer:      text("reviewer"),
  message:       text("message"),
  rating:        integer("rating").default(5),
  createdAt:     text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const plansTable = sqliteTable("plans", {
  id:            integer("id").primaryKey({ autoIncrement: true }),
  service:       text("service").notNull().default("minecraft"),
  title:         text("title").notNull(),
  price:         real("price").notNull().default(0),
  currency:      text("currency").notNull().default("INR"),
  billingPeriod: text("billing_period").notNull().default("monthly"),
  cpu:           text("cpu"),
  ram:           text("ram"),
  storage:       text("storage"),
  bandwidth:     text("bandwidth"),
  location:      text("location"),
  buttonText:    text("button_text").default("Order Now"),
  buttonUrl:     text("button_url"),
  features:      text("features").default("[]"),
  badge:         text("badge"),
  popular:       integer("popular").default(0),
  bgColor:       text("bg_color"),
  status:        text("status").default("active"),
  sortOrder:     integer("sort_order").default(0),
  createdAt:     text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const servicesConfigTable = sqliteTable("services_config", {
  id:          integer("id").primaryKey({ autoIncrement: true }),
  slug:        text("slug").notNull().unique(),
  name:        text("name").notNull(),
  icon:        text("icon").default("🖥️"),
  description: text("description"),
  features:    text("features").default("[]"),
  pricingLink: text("pricing_link"),
  orderUrl:    text("order_url"),
  imageUrl:    text("image_url"),
  visible:     integer("visible").default(1),
  sortOrder:   integer("sort_order").default(0),
});

export const docsTable = sqliteTable("docs", {
  id:        integer("id").primaryKey({ autoIncrement: true }),
  category:  text("category").notNull().default("general"),
  title:     text("title").notNull(),
  slug:      text("slug"),
  content:   text("content").notNull().default(""),
  published: integer("published").default(0),
  sortOrder: integer("sort_order").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const mediaTable = sqliteTable("media", {
  id:           integer("id").primaryKey({ autoIncrement: true }),
  filename:     text("filename").notNull(),
  originalName: text("original_name"),
  mimeType:     text("mime_type"),
  size:         integer("size"),
  url:          text("url"),
  mediaType:    text("media_type").default("image"),
  createdAt:    text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export { sqlite };
export const db = drizzle(sqlite);
