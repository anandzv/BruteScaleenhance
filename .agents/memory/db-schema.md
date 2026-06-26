---
name: DB Schema Additions
description: Tables added to the SQLite DB and known migration quirks
---

# DB Schema Additions

All tables use `CREATE TABLE IF NOT EXISTS` in `server/db.js` sqlite.exec() block.

## Tables added
- `plans` — hosting plans (service, title, price, currency, billing_period, cpu, ram, storage, bandwidth, location, button_text, button_url, features JSON, badge, popular, bg_color, status, sort_order)
- `services_config` — service cards (slug unique, name, icon, description, features JSON, pricing_link, order_url, image_url, visible, sort_order)
- `docs` — documentation articles (category, title, slug, content, published, sort_order, created_at, updated_at)
- `media` — uploaded files (filename, original_name, mime_type, size, url, media_type)

## Migration quirk — rating column in reviews
The `reviews` table was created before `rating INTEGER DEFAULT 5` was added.
`CREATE TABLE IF NOT EXISTS` won't add new columns to existing tables.
The `rating` column was added via: `ALTER TABLE reviews ADD COLUMN rating INTEGER DEFAULT 5`
This must be run once against the existing DB. The sqlite.exec() block in db.js now includes it
in the CREATE TABLE definition — but existing installations need the ALTER TABLE.

**Why:** SQLite doesn't support adding columns in CREATE TABLE IF NOT EXISTS for existing tables.
**How to apply:** If other columns are added to existing tables in the future, run ALTER TABLE manually against data/brutescale.db, OR add migration logic at startup.
