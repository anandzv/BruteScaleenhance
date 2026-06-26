# BruteScale — Pterodactyl Deployment Guide

## Overview
BruteScale is a standalone Node.js application. No Replit, no cloud services, no external dependencies beyond what npm installs.

---

## Requirements
| Item | Value |
|------|-------|
| Node.js | 22 LTS |
| npm | Included with Node 22 |
| Disk | 500 MB minimum |
| RAM | 512 MB minimum |

---

## Pterodactyl Egg Settings

| Field | Value |
|-------|-------|
| Docker Image | `ghcr.io/pterodactyl/yolks:nodejs_22` |
| Startup Command | `npm start` |
| Install Script | `npm install` |
| Build Command | `npm run build` |

---

## Deployment Steps

### 1. Upload & Extract
Upload the `production-build/` ZIP to your Pterodactyl server file manager and extract it to the server root.

### 2. Create Environment File
Copy `.env.example` to `.env` and fill in your values:
```
cp .env.example .env
nano .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build Frontend (optional — dist/ is pre-built)
```bash
npm run build
```

### 5. Start the Server
```bash
npm start
```

The server will:
- Auto-create the SQLite database at `data/brutescale.db`
- Auto-create the uploads folder at `data/uploads/`
- Auto-seed the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Serve the frontend + API on `PORT` (default: 3000)

---

## Required Environment Variables

Create a `.env` file in the server root:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=your_very_long_random_secret_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_strong_admin_password
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Admin Panel

After starting, visit `http://yourserver:PORT/admin`

Login with the email and password you set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

## File Structure (production)
```
/
├── server/          ← Express API + DB
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   └── middleware/
├── dist/            ← Pre-built React frontend
├── public/          ← Static assets
├── data/
│   ├── brutescale.db  ← SQLite database (auto-created)
│   └── uploads/       ← Uploaded media (auto-created)
├── package.json
├── .env             ← You create this from .env.example
└── .env.example
```

---

## Routing
All routes (`/`, `/admin`, `/docs`, `/reviews`, etc.) are handled by the Express SPA fallback. Refreshing any page will NOT return 404.

## Uploads
Uploaded images are stored at `data/uploads/` and served at `/uploads/filename`.

## Database
SQLite file at `data/brutescale.db` — created automatically on first start. Back it up regularly.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | Change `PORT` in `.env` |
| Admin can't log in | Check `ADMIN_EMAIL` matches exactly |
| 404 on page refresh | Ensure `NODE_ENV=production` in `.env` |
| Images not loading | Check `data/uploads/` exists and is writable |
| JWT errors | Regenerate `JWT_SECRET` in `.env` |
