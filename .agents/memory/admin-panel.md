---
name: Admin Panel Architecture
description: How the BruteScale admin panel is structured after the full CMS build
---

# Admin Panel Architecture

**Route:** `/admin` — protected by `useAuth()` guard, redirects to `/login`
**Auth:** JWT in localStorage (`bs_auth_token`), admin checked via `ADMIN_EMAIL` env var

## Frontend structure
- `src/pages/admin.tsx` — main admin shell (sidebar, routing, settings sections)
- `src/components/admin/shared.tsx` — shared UI: Toast, ConfirmDialog, GlassInput, GlassSelect, GlassTextarea, Card, SectionHeader, SaveButton, Modal, Badge
- `src/components/admin/ReviewsManager.tsx` — YouTube/Instagram/Discord CRUD
- `src/components/admin/PlansManager.tsx` — plans CRUD with service filter
- `src/components/admin/ServicesManager.tsx` — services_config CRUD
- `src/components/admin/DocsManager.tsx` — docs CRUD with category + search
- `src/components/admin/MediaManager.tsx` — multer file upload + grid

## Backend routes
- `/api/admin/*` — all protected by `requireAdmin` middleware (JWT + isAdmin flag)
- `/api/reviews` — public GET, admin POST/PATCH/DELETE
- `/api/plans` — public GET (active only), admin GET/POST/PATCH/DELETE via `/api/plans/admin`
- `/api/services-config` — public GET (visible only), admin via `/api/services-config/admin`
- `/api/docs` — public GET (published only), admin via `/api/docs/admin`
- `/api/media` — admin only; POST /upload uses multer; files stored in `data/uploads/`, served at `/uploads/`

**Why:** Split into separate component files to keep admin.tsx manageable (<500 lines). Each section is independent and passes `token` as a prop.

**How to apply:** When adding new admin sections, create `src/components/admin/NewSection.tsx`, import in admin.tsx, add to NAV_GROUPS, add to `renderContent()` switch.
