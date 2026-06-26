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

# 2. Copy env file and configure it
cp .env.example .env
nano .env          # set JWT_SECRET and ADMIN_EMAIL

# 3. Build the frontend
npm run build

# 4. Start the server
npm start
```

Visit `http://localhost:3000` (or your configured port).

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Set to `production` for live deployments |
| `JWT_SECRET` | **Yes** | dev fallback | Secret for JWT tokens — **change in production!** |
| `ADMIN_EMAIL` | **Yes** | *(none)* | Email address that gets admin access |

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
| `npm run dev:client` | Vite dev server only (port 5173) |
| `npm run dev:server` | Node server only (port 3000) |

## Admin Panel

1. Register an account using the email set in `ADMIN_EMAIL`  
2. You will automatically have admin access  
3. Visit `/admin` or use the admin dropdown in the navbar  

The admin panel includes:
- **Dashboard** — site stats overview  
- **Discord Settings** — invite link, server name  
- **Homepage** — hero text, announcement badge, button labels  
- **Network** — datacenter status per region  
- **Docs Manager** — documentation content  
- **Appearance** — colors, logo, footer  
- **SEO** — meta tags, OG image, Twitter card  
- **Users** — view and delete registered users  
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
│   ├── favicon.svg
│   ├── opengraph.jpg
│   └── robots.txt
├── server/                  # Backend Express server
│   ├── index.js             # Server entry point
│   ├── db.js                # SQLite + Drizzle setup
│   ├── middleware/
│   │   └── admin.js         # JWT admin guard
│   └── routes/
│       ├── auth.js          # /api/auth/* routes
│       └── admin.js         # /api/admin/* routes
├── src/                     # React frontend source
│   ├── assets/              # Images, logos
│   ├── components/
│   │   ├── sections/        # Page sections (Navbar, Hero, etc.)
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (cn, etc.)
│   ├── pages/               # Route pages
│   ├── App.tsx              # Router setup
│   ├── index.css            # Global styles + Tailwind
│   └── main.tsx             # React entry point
├── .env                     # Your environment variables (not committed)
├── .env.example             # Template for environment variables
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.js           # Vite build configuration
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/healthz` | None | Health check |
| POST | `/api/auth/register` | None | Create account |
| POST | `/api/auth/login` | None | Login |
| GET | `/api/auth/me` | Bearer | Verify token |
| GET | `/api/settings` | None | Public site settings |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/settings` | Admin | All settings |
| POST | `/api/admin/settings` | Admin | Save one setting |
| POST | `/api/admin/settings/bulk` | Admin | Save multiple settings |
| GET | `/api/admin/users` | Admin | List users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/logs` | Admin | Activity logs |
| POST | `/api/admin/logs` | Admin | Add log entry |
| DELETE | `/api/admin/logs` | Admin | Clear all logs |

## Pterodactyl Deployment

1. Upload ZIP to Pterodactyl file manager and extract  
2. Create a `.env` file with your environment variables  
3. In the startup command field use: `node server/index.js`  
4. Or run in the console:
   ```bash
   npm install && npm run build && npm start
   ```

> **Note:** `better-sqlite3` requires a C++ build toolchain. Most Pterodactyl Node.js eggs have this pre-installed. If you see a build error during `npm install`, the egg may need `build-essential` / `python3` installed.

## VPS Deployment

```bash
# Clone or extract the project
cd /var/www/brutescale

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Build frontend
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server/index.js --name brutescale
pm2 save
pm2 startup
```

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Three.js, Wouter, shadcn/ui
- **Backend:** Express 4, Node.js ESM
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Security:** Helmet, CORS, Compression, Morgan logging
