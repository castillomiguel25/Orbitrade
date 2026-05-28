# PLASMINE

Next.js 16 application (App Router) — NFT collection and simulation game with space-themed UI, built on Supabase + TRON (TRC20).

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # Fill in your values
pnpm dev                      # http://localhost:3000
```

## Commands

| Command      | Description                      |
|--------------|----------------------------------|
| `pnpm dev`   | Development server (Turbopack)   |
| `pnpm build` | Production build                 |
| `pnpm start` | Start production server          |
| `pnpm lint`  | Run Next.js linting              |

---

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# ── Supabase ──────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── TRON / Wallet ─────────────────────────────
NEXT_PUBLIC_WALLET=your-trc20-wallet-address
DESTINATION_WALLET=your-trc20-destination-wallet

# ── Features ──────────────────────────────────
NEXT_PUBLIC_DEPOSITS_ENABLED=true

# ── OpenAI (text extraction) ──────────────────
OPENAI_API_KEY=sk-your-key

# ── Dual Domain (optional, see below) ────────
# NEXT_PUBLIC_MARKETING_DOMAIN=plasmine.io
# NEXT_PUBLIC_APP_DOMAIN=app.plasmine.io
```

---

## Deployment: DigitalOcean + Dokploy

### Architecture

Single Docker container, two domains, one deployment:

```
plasmine.io       → Landing, Terms, Privacy, How It Works (SEO on)
app.plasmine.io   → Dashboard, Hangar, Hive, auth pages  (SEO off)
```

The middleware detects the hostname and redirects cross-domain:
- `plasmine.io/command-center` → 302 to `app.plasmine.io/command-center`
- `app.plasmine.io/` → 302 to `plasmine.io/`

Auth cookies are shared between subdomains (domain=`.plasmine.io`, sameSite=`lax`).

### Step 1: DNS

Point both domains to your DigitalOcean droplet IP:

```
plasmine.io        A    →  <DROPLET_IP>
app.plasmine.io    A    →  <DROPLET_IP>
```

If using Cloudflare or another DNS proxy, set them to **DNS Only** (gray cloud) initially so Dokploy can issue Let's Encrypt certificates. You can enable proxy later.

### Step 2: Dokploy Service

1. Create a new **Application** in Dokploy
2. Source: **Git** → connect your repository
3. Build type: **Dockerfile**
4. Dockerfile path: `./Dockerfile`
5. Exposed port: `3000`

### Step 3: Environment Variables in Dokploy

Go to **Environment** tab and add:

```env
# Build Args (required for NEXT_PUBLIC_* at build time)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MARKETING_DOMAIN=plasmine.io
NEXT_PUBLIC_APP_DOMAIN=app.plasmine.io

# Runtime only
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DESTINATION_WALLET=your-trc20-wallet
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_DEPOSITS_ENABLED=true
```

> **Important**: In Dokploy, variables prefixed with `NEXT_PUBLIC_` must also be configured as **Build Args** so they are inlined during `next build`. In Dokploy's environment settings, mark these as "Build" type.

### Step 4: Domains in Dokploy

In the **Domains** tab of your service:

1. Add `plasmine.io`
   - HTTPS: enabled (Let's Encrypt)
   - Container port: `3000`
2. Add `app.plasmine.io`
   - HTTPS: enabled (Let's Encrypt)
   - Container port: `3000`

Dokploy uses Traefik internally to route both domains to the same container.

### Step 5: Deploy

Click **Deploy** or push to your configured branch. Dokploy will:

1. Pull the repo
2. Run `docker build` with your build args
3. Start the container on port 3000
4. Configure Traefik routing + SSL for both domains

### Step 6: Verify

| Check | URL | Expected |
|---|---|---|
| Landing | `https://plasmine.io` | Shows landing page |
| App redirect | `https://plasmine.io/command-center` | Redirects to `app.plasmine.io/command-center` |
| Login | `https://app.plasmine.io/access` | Shows login page |
| Landing redirect | `https://app.plasmine.io/` | Redirects to `plasmine.io/` |
| robots (marketing) | `https://plasmine.io/robots.txt` | Allows `/`, disallows protected paths |
| robots (app) | `https://app.plasmine.io/robots.txt` | Disallows `/` (blocks all) |
| Sitemap | `https://plasmine.io/sitemap.xml` | Lists only public routes |
| Cross-domain auth | Login on `app.plasmine.io`, visit `plasmine.io` | Cookie shared, user recognized |

---

## Single Domain Mode (Fallback)

If you don't set `NEXT_PUBLIC_MARKETING_DOMAIN` and `NEXT_PUBLIC_APP_DOMAIN`, the app works exactly as before on a single domain. No cross-domain redirects, all routes served from one host. The dual-domain setup is fully opt-in.

---

## Docker (Local)

```bash
# Build and run locally
docker compose up --build

# Or with explicit env vars
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg NEXT_PUBLIC_MARKETING_DOMAIN=plasmine.io \
  --build-arg NEXT_PUBLIC_APP_DOMAIN=app.plasmine.io \
  -t plasmine .

docker run -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e DESTINATION_WALLET=... \
  plasmine
```

---

## Project Structure

```
app/
├── (protected)/        # Routes requiring authentication
│   ├── AuthGuard.tsx   # Client-side auth + 30min idle timeout
│   ├── command-center/ # Dashboard
│   ├── hangar/         # NFT collection
│   ├── hive/           # Referral network
│   └── ...
├── api/                # Server-side API routes (rate-limited)
├── components/         # Shared UI components
├── hooks/              # Custom React hooks
├── i18n/messages/      # Internationalization (en, es, pt, it)
├── store/              # Zustand state stores
├── utils/
│   ├── domains.ts      # Dual-domain URL helpers
│   ├── rateLimit.ts    # In-memory rate limiter
│   ├── supabase/       # Supabase server client
│   └── supabaseClient.ts # Supabase browser client
├── robots.ts           # Dynamic robots.txt (per hostname)
├── sitemap.ts          # Sitemap (marketing domain only)
├── terms/              # Legal terms page + disclaimer
└── privacy/            # Privacy policy + GDPR notice
middleware.ts           # Auth + dual-domain routing
Dockerfile              # Multi-stage production build
docker-compose.yml      # Local/production orchestration
```

## Security Features

- **CSP headers** (no `unsafe-eval`)
- **Rate limiting** on critical API routes (validate-deposits: 5/min, withdrawals: 3/min, transactions: 10/min)
- **Session timeout**: Auto-logout after 30 minutes of inactivity
- **Error sanitization**: Internal errors logged server-side, generic messages to client
- **HTTPS enforcement** via middleware
- **HSTS**, **X-Frame-Options: DENY**, **X-Content-Type-Options: nosniff**
