# BruteScale — Production Deployment

## Quick Start

```bash
# 1. Install dependencies (from public npm registry)
npm install

# 2. Build the frontend
npm run build

# 3. Create and fill your environment file
cp .env.example .env
# Edit .env with your PORT, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 4. Start the server
npm start
```

The server will automatically:
- Create the SQLite database at `data/brutescale.db`
- Create the uploads folder at `data/uploads/`
- Seed the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Pterodactyl Egg

| Field | Value |
|-------|-------|
| Docker Image | `ghcr.io/pterodactyl/yolks:nodejs_22` |
| Startup Command | `npm start` |
| Install Script | `npm install && npm run build` |
| Node Version | 22 LTS |

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port to listen on (default: 3000) |
| `NODE_ENV` | Set to `production` |
| `JWT_SECRET` | Long random secret for signing JWTs |
| `ADMIN_EMAIL` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |

## Admin Panel

Visit `/admin` and log in with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Project Structure

```
/
├── server/          Express API + DB logic
├── src/             React frontend source
├── dist/            Pre-built frontend (or build with npm run build)
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
