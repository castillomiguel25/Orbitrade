# Orbitrade

Next.js 16 (App Router) yield-generation platform built on **Supabase** (auth, Postgres) and **TRON (TRC20)** for deposits and withdrawals. Users deposit USDT, acquire generation installations, and receive daily yield distributions.

> **Not a regulated financial product.** Participation involves risk.

## Quick Start

```bash
pnpm install
cp .env.example .env.local   # Fill in your values
pnpm dev                      # http://localhost:3000
```

## Commands

| Command                | Description                              |
|------------------------|------------------------------------------|
| `pnpm dev`             | Development server (Turbopack)           |
| `pnpm build`           | Production build                         |
| `pnpm start`           | Start production server                  |
| `pnpm test`            | Run unit tests (Vitest)                  |
| `pnpm typecheck`       | TypeScript type check                    |
| `pnpm i18n:validate`   | Verify locale keys are in sync           |
| `pnpm i18n:sync`       | Sync missing keys across locales         |

---

## Environment Variables

Create a `.env.local` file:

```env
# ── Supabase ──────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ── TRON / Wallet ─────────────────────────────
NEXT_PUBLIC_WALLET=your-trc20-deposit-wallet-address
DESTINATION_WALLET=your-trc20-destination-wallet

# ── Features ──────────────────────────────────
NEXT_PUBLIC_DEPOSITS_ENABLED=true

# ── OpenAI (OCR proof extraction) ─────────────
OPENAI_API_KEY=sk-your-key

# ── Single domain (default) ───────────────────
# Leave unset to run everything on one domain.

# ── Dual domain (optional) ────────────────────
# NEXT_PUBLIC_MARKETING_DOMAIN=orbitrade.io
# NEXT_PUBLIC_APP_DOMAIN=app.orbitrade.io
```

---

## Deployment: DigitalOcean + Dokploy

### Architecture

Single Docker container, optionally two domains, one deployment:

```
orbitrade.io      → Landing, Terms, Privacy, FAQ, Contact  (SEO on)
app.orbitrade.io  → Dashboard, Deposits, Withdrawals, auth (SEO off)
```

The middleware detects the hostname and redirects cross-domain. Auth cookies are shared between subdomains (`domain=.orbitrade.io`, `sameSite=lax`).

Dual-domain mode only activates when both `NEXT_PUBLIC_MARKETING_DOMAIN` and `NEXT_PUBLIC_APP_DOMAIN` are set and the hostname is not `localhost`. By default the app runs on a single domain.

### Step 1: DNS

Point both domains to your DigitalOcean droplet IP:

```
orbitrade.io        A    →  <DROPLET_IP>
app.orbitrade.io    A    →  <DROPLET_IP>
```

Set DNS to **DNS Only** (no proxy) initially so Dokploy can issue Let's Encrypt certs.

### Step 2: Dokploy Service

1. Create a new **Application** in Dokploy
2. Source: **Git** → connect your repository
3. Build type: **Dockerfile**
4. Dockerfile path: `./Dockerfile`
5. Exposed port: `3000`

### Step 3: Environment Variables

In Dokploy's **Environment** tab, add all variables from `.env.example`. Mark `NEXT_PUBLIC_*` vars as **Build Args** — they must be inlined at `next build` time.

### Step 4: Domains

In the **Domains** tab:

1. Add `orbitrade.io` → HTTPS enabled, port `3000`
2. Add `app.orbitrade.io` → HTTPS enabled, port `3000`

Dokploy uses Traefik internally to route both domains to the same container.

### Step 5: Deploy

Push to your configured branch or click **Deploy**. Dokploy will build the Docker image with your build args, start the container, and configure SSL.

### Step 6: Verify

| Check | URL | Expected |
|---|---|---|
| Landing | `https://orbitrade.io` | Landing page |
| Login | `https://app.orbitrade.io/access` | Login page |
| Dashboard (auth required) | `https://app.orbitrade.io/dashboard` | Redirects to `/access` if logged out |
| Sitemap | `https://orbitrade.io/sitemap.xml` | Public routes only |

---

## Docker (Local)

```bash
docker compose up --build

# Or manual build + run
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -t orbitrade .

docker run -p 3000:3000 \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e DESTINATION_WALLET=... \
  orbitrade
```

---

## Project Structure

```
app/
├── (protected)/          # Authenticated routes (AppNav, AuthGuard)
│   ├── dashboard/        # KPIs: installed capacity, daily production, balance
│   ├── production/       # Active installations + earnings claim
│   ├── deposits/         # USDT deposit (TXID on-chain + OCR fallback)
│   ├── withdrawals/      # Withdrawal requests + key verification
│   ├── history/          # Unified transaction + balance history
│   ├── partners/         # 3-level referral network (6/3/1%)
│   └── account/          # Profile & security settings
├── api/                  # Server API routes (rate-limited, auth-gated)
├── components/           # Shared UI (Button, Card, Input, Modal, AppNav…)
├── constants/            # withdrawal.ts, referral.ts
├── hooks/                # useDeposits, useEarnings, useWithdrawals…
├── i18n/messages/        # Locales: en (base), es
├── modules/
│   ├── plans/            # 2-tier plan catalog + purchase validation
│   ├── production/       # Pure earnings math (dailyProduction, accruedEarnings)
│   ├── referrals/        # computeReferralPayouts (6/3/1)
│   ├── deposit-confirmation/ # TXID on-chain + OCR fallback
│   └── withdrawals/      # Withdrawal key verification + balance check
├── store/                # Zustand: useUserStore, useProfileStore
├── utils/
│   ├── domains.ts        # Dual-domain URL helpers
│   ├── rateLimit.ts      # In-memory rate limiter
│   └── supabase/         # Server + admin Supabase clients
├── robots.ts             # Dynamic robots.txt per hostname
└── sitemap.ts            # Sitemap (marketing domain only)
middleware.ts             # Auth guard + dual-domain routing + HTTPS redirect
tests/                    # Vitest unit tests (plans, production, referrals)
Dockerfile                # Multi-stage production build
docker-compose.yml        # Local/production orchestration
SPEC.md                   # Full transformation spec and architecture decisions
```

## Plans

Two tiers, both repeatable (no single-purchase limit):

| Tier | ID | Min | Max | Yield/day | Duration |
|------|----|-----|-----|-----------|----------|
| Entry | `plan-entry` | TBD | TBD | TBD% | 365 days |
| Industrial | `plan-industrial` | TBD | TBD | TBD% | 365 days |

Numbers are defined in `app/modules/plans/index.ts` and are TBD by the owner.

## Partners (Referrals)

3-level referral program:

| Level | Commission |
|-------|-----------|
| Level 1 | 6% |
| Level 2 | 3% |
| Level 3 | 1% |

## Security

- **CSP headers** (no `unsafe-eval`), HSTS, `X-Frame-Options: DENY`, `nosniff`
- **Rate limiting** on sensitive routes (deposits: 5/min, withdrawals: 3/min)
- **Withdrawal key** as second factor for all payouts
- **Session timeout**: auto-logout after 30 minutes of inactivity
- **TXID on-chain verification** for all deposits; OCR fallback available
- **HTTPS enforcement** via middleware
