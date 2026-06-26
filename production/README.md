# BruteScale — Production Deployment

## Quick Start

```bash
# 1. Install dependencies (from public npm registry)
npm install

# 2. Build the frontend
npm run build

# 3. Configure environment (optional — defaults work out of the box)
cp .env.example .env
# Edit .env to change JWT_SECRET (recommended for production)

# 4. Start the server
npm start
```

On first start the server prints:

```
✓ Admin account created: ipc23771@gmail.com (role=admin)
```

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `ipc23771@gmail.com` |
| Password | `ipc23771` |
| Role | `admin` |

The admin account is created automatically on first startup. If the account already exists with a different role it is promoted to `admin` automatically. No manual database edits are ever needed.

## Pterodactyl Egg

| Field | Value |
|-------|-------|
| Docker Image | `ghcr.io/pterodactyl/yolks:nodejs_22` |
| Startup Command | `npm start` |
| Install Script | `npm install && npm run build` |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port to listen on |
| `NODE_ENV` | `production` | Environment flag |
| `JWT_SECRET` | dev fallback | **Change this in production** — signs all login tokens |
| `ADMIN_EMAIL` | `ipc23771@gmail.com` | Admin account email (auto-created on first start) |
| `ADMIN_PASSWORD` | `ipc23771` | Admin account password (only used when creating the account) |

## Admin Panel

1. Start the server (admin account is created automatically)
2. Log in at `/login` with `ipc23771@gmail.com` / `ipc23771`
3. Click the user avatar → **Admin Dashboard**
4. Or go directly to `/admin/dashboard`

## Project Structure

```
/
├── server/          Express API + DB logic
├── src/             React frontend source
├── dist/            Pre-built frontend (rebuilt by npm run build)
├── public/          Static assets
├── data/
│   ├── brutescale.db   SQLite database (auto-created)
│   └── uploads/        Uploaded media (auto-created)
├── .env             Your environment config (create from .env.example)
└── package.json
```

## All Routes

Every route serves the React SPA — refreshing any URL never returns 404:

`/` `/login` `/register` `/docs` `/minecraft-hosting` `/vps-hosting` `/rdp-hosting` `/ddos` `/reviews` `/admin` `/admin/*`

## Uploads

Uploaded images are stored at `data/uploads/` and served at `/uploads/filename`.
