# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
pnpm dev          # Dev server with Turbopack (http://localhost:3000)
pnpm build        # Production build (output: standalone, for Docker)
pnpm start        # Start production server
pnpm lint         # Next.js linting

# i18n tooling (custom scripts in scripts/)
pnpm i18n:validate      # Verify all locales share the same keys as en (base)
pnpm i18n:sync          # Sync missing keys across locales
pnpm i18n:sync:dry      # Preview sync without writing
pnpm i18n:duplicates    # Detect duplicate keys
```

Package manager is **pnpm@9.15.9** (note: a `package-lock.json` also exists, but pnpm is canonical — see `pnpm-lock.yaml`). The app is **Next.js 16 / React 19** (App Router) with **Tailwind CSS v4**.

## Architecture Overview

Space-themed investment/farming platform ("ORBITRADE") built on **Supabase** (auth, Postgres, realtime) and **TRON (TRC20)** for deposits/withdrawals.

### Space-themed route naming

Protected app routes use space/sci-fi names rather than literal feature names. The full set of authenticated routes (see `PROTECTED_PATHS` in `middleware.ts`):

```
/command-center  /commander  /hangar      /extraction  /plasma-core
/armada          /hive       /datalog     /simulation  /ledger
```

`/command-center` is the post-login landing (dashboard). When adding a protected route you MUST register it in `PROTECTED_PATHS` in `middleware.ts` — the directory existing under `app/(protected)/` is not enough.

### Dual-domain architecture (critical, non-obvious)

The single deployment serves two domains, switched by hostname in `middleware.ts`:
- **Marketing domain** (`NEXT_PUBLIC_MARKETING_DOMAIN`, e.g. `orbitrade.io`) — landing, terms, privacy, how-it-works, arcade games. SEO on.
- **App domain** (`NEXT_PUBLIC_APP_DOMAIN`, e.g. `app.orbitrade.io`) — protected routes + auth pages (`/access`, `/enlist`). SEO off.

The middleware 302-redirects routes to their correct domain and shares Supabase auth cookies across subdomains (`domain=.orbitrade.io`, `sameSite=lax`). Dual-domain mode is **only active when both env vars are set and hostname is not localhost** — locally everything serves from one origin, so this redirect logic is dormant. When changing route protection or auth redirects, account for both modes.

### Authentication Flow

1. **`middleware.ts`** — server-side route protection via `@supabase/ssr` + dual-domain routing + forced HTTPS. Unauthenticated hits to protected paths → `/access`; authenticated hits to auth pages or `/` → `/command-center`.
2. **`app/(protected)/AuthGuard.tsx`** — client-side auth verification inside the protected layout.
3. **Supabase clients**:
   - Browser: `app/utils/supabaseClient.ts`
   - Server (RSC/route handlers): `app/utils/supabase/server.ts` — `createClient()`; for cookie writes use `createClient({ write: true })`
   - Admin (service-role, server-only): `app/utils/supabase/admin.ts`

### API Route Pattern

All routes in `app/api/` authenticate the caller before acting:
```typescript
import { createClient } from "../../utils/supabase/server";
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
// verify user, then use admin client / business logic
```
Rate limiting helpers live in `app/utils/rateLimit.ts`.

### State Management — Zustand (`app/store/`)

- `useUserStore` — auth state
- `useProfileStore` — user profile, `fetchProfile()` syncs from API

Data-fetching hooks in `app/hooks/` (`useDeposits`, `useEarnings`, `useReferrals`, `useWithdrawals`, `useIdleTimeout`).

### Business logic constants (`app/constants/`)

- `investmentPlans.ts` — investment plan definitions (id, daily yield `rendimiento`, min/max, `duracionDias`, optional `maxPerUser`). Plans carry `titleKey`/`descriptionKey` for i18n. Some plans (e.g. `plan-17`, `plan-20`) are deposit-gated — also enforced server-side in `app/api/invest/route.ts`.
- `referral.ts` — 3-level referral percentages (6% / 3% / 1%).
- `withdrawal.ts`, `themeFlags.ts` (seasonal UI flags).

### Internationalization (`app/i18n/`)

- **react-intl**. Four locales: `en` (base/default), `es`, `pt`, `it` — defined in `app/i18n/utils/locales.ts`.
- Messages: `app/i18n/messages/{en,es,pt,it}.ts`. `en.ts` is the source of truth (~1,188 keys); other locales are partially translated — run `pnpm i18n:validate` after adding keys. See `I18N_STATUS.md` for current coverage.
- Locale is cookie-based (`app/i18n/utils/cookies.ts`, `server-cookies.ts`), provided via `IntlProvider.tsx`.

### Key integrations

- **TronWeb** (`tronweb`) — TRC20 wallet/transaction support; `connect-src` CSP allows `api.trongrid.io`.
- **OpenAI + Tesseract.js** — OCR/text extraction from uploaded payment proofs (`app/api/extract-text`, `app/api/upload-proof`).
- Arcade games (`tetris`, `galaxian`) and a roulette/tickets system exist as engagement features with their own API routes.

### Security headers

`next.config.ts` sets a strict CSP plus HSTS, `X-Frame-Options: DENY`, `nosniff`, and a restrictive `Permissions-Policy` on all routes. When adding an external script/style/connect origin, update the CSP `default-src`/`script-src`/`connect-src` accordingly or it will be blocked.

### Path alias

`@/*` → project root (`tsconfig.json`).

### Deployment

Dockerized (`Dockerfile`, `docker-compose.yml`) with `output: 'standalone'`, deployed via Dokploy on DigitalOcean. `NEXT_PUBLIC_*` vars must be set as **build args** so they inline at `next build` time. See `README.md` for the full deploy + DNS walkthrough.

### Environment variables

Core (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_WALLET`, `DESTINATION_WALLET`, `OPENAI_API_KEY`, `NEXT_PUBLIC_DEPOSITS_ENABLED`. Dual-domain (optional): `NEXT_PUBLIC_MARKETING_DOMAIN`, `NEXT_PUBLIC_APP_DOMAIN`.
