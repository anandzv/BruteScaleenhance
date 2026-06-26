# BruteScale — Enterprise Hosting Website

Premium hosting provider website with DDoS protection visualization, admin panel, user authentication, and full content management.

## Requirements

- **Node.js** 20 or later  
- **npm** 9 or later  
- No database server required — uses SQLite (auto-created on first start)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file (optional — defaults work out of the box)
cp .env.example .env

# 3. Build the frontend
npm run build

# 4. Start the server
npm start
```

Visit `http://localhost:3000` (or your configured port).

On first start the server automatically prints:

```
✓ Admin account created: ipc23771@gmail.com (role=admin)
```

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `ipc23771@gmail.com` |
| Password | `ipc23771` |
| Role | `admin` (set in DB, not env var) |

The admin account is created automatically on first startup. If the account already exists it is promoted to `role=admin` automatically. No manual DB edits required.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Set to `production` for live deployments |
| `JWT_SECRET` | dev fallback | Secret for JWT tokens — **change in production!** |
| `ADMIN_EMAIL` | `ipc23771@gmail.com` | Admin account email (auto-created on first start) |
| `ADMIN_PASSWORD` | `ipc23771` | Admin account password (used only when creating the account) |

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Scripts

| Command | Description |
|---|---|
| `npm install` | Install all dependencies |
| `npm run build` | Build the React frontend to `dist/` |
| `npm start` | Start the production server |
| `npm run dev` | Run frontend (Vite) + backend (Node watch) concurrently |
| `npm run dev:client` | Vite dev server only (port 5000) |
| `npm run dev:server` | Node server only (port 3000) |

## Admin Panel

1. Start the server — the admin account is created automatically  
2. Log in at `/login` with `ipc23771@gmail.com` / `ipc23771`  
3. Click the user avatar in the top-right → **Admin Dashboard**  
4. Or navigate directly to `/admin/dashboard`

The admin panel includes:
- **Dashboard** — site stats overview  
- **Hosting Plans** — create and manage Minecraft / VPS / RDP plans  
- **Reviews** — manage YouTube, Instagram, Discord reviews  
- **Homepage** — hero text, announcement badge, button labels  
- **DDoS Page** — DDoS protection page content  
- **Documentation** — docs categories and articles  
- **Users** — view and delete registered users  
- **Settings** — site name, SEO, Discord, footer  
- **Activity Logs** — audit trail of admin actions  

## Database

SQLite database is stored at `data/brutescale.db` and created automatically on first startup. No configuration required.

To backup: copy `data/brutescale.db` anywhere.  
To reset: delete `data/brutescale.db` and restart.

## Folder Structure

```
BruteScale/
├── data/                    # SQLite database (auto-created)
├── dist/                    # Built frontend (created by npm run build)
├── public/                  # Static assets (favicon, robots.txt, etc.)
├── server/                  # Backend Express server
│   ├── index.js             # Server entry point + admin seeding
│   ├── db.js                # SQLite + Drizzle setup + migrations
│   ├── middleware/
│   │   └── admin.js         # DB-backed admin guard
│   └── routes/
│       ├── auth.js          # /api/auth/* routes
│       ├── admin.js         # /api/admin/* routes
│       ├── plans.js         # /api/plans
│       ├── reviews.js       # /api/reviews
│       ├── docs_admin.js    # /api/docs
│       ├── media.js         # /api/media
│       └── services_config.js
├── src/                     # React frontend source
│   ├── components/
│   │   ├── sections/        # Page sections (Navbar, Hero, etc.)
│   │   ├── admin/           # Admin panel components
│   │   └── ui/              # shadcn/ui components
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── pages/               # Route pages
│   └── App.tsx              # Router setup
├── .env                     # Your environment variables (not committed)
├── .env.example             # Template with default values
├── index.html
├── package.json
└── vite.config.js
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/healthz` | None | Health check |
| POST | `/api/auth/register` | None | Create account |
| POST | `/api/auth/login` | None | Login |
| GET | `/api/auth/me` | Bearer | Verify token + refresh isAdmin |
| GET | `/api/settings` | None | Public site settings |
| GET | `/api/plans` | None | Public plans list |
| GET | `/api/reviews` | None | Public reviews list |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/settings` | Admin | All settings |
| POST | `/api/admin/settings/bulk` | Admin | Save multiple settings |
| GET | `/api/admin/users` | Admin | List users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/logs` | Admin | Activity logs |
| POST | `/api/admin/logs` | Admin | Add log entry |
| DELETE | `/api/admin/logs` | Admin | Clear all logs |

## Pterodactyl Deployment

1. Upload ZIP to Pterodactyl file manager and extract  
2. Create a `.env` file (or set Startup Variables):

```
JWT_SECRET=your-long-random-secret
ADMIN_EMAIL=ipc23771@gmail.com
ADMIN_PASSWORD=ipc23771
PORT=3000
NODE_ENV=production
```

3. Run the install script: `npm install && npm run build`  
4. Set startup command to: `npm start`

On first boot the server prints `✓ Admin account created` and the admin panel is ready.

> **Note:** `better-sqlite3` requires a C++ build toolchain. Most Pterodactyl Node.js eggs include this. If `npm install` fails with a build error, ensure the egg has `build-essential` and `python3` available.

## VPS Deployment

```bash
cd /var/www/brutescale
npm install
cp .env.example .env   # edit JWT_SECRET if needed
npm run build
npm start
# or with PM2:
npm install -g pm2
pm2 start server/index.js --name brutescale
pm2 save && pm2 startup
```

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Three.js, Wouter, shadcn/ui
- **Backend:** Express 4, Node.js ESM
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **Auth:** JWT (jsonwebtoken) + bcryptjs, role stored in DB
- **Security:** Helmet, CORS, Compression, Morgan logging
