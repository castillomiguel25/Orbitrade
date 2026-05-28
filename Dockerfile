# ── Stage 1: Dependencies ─────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined into the client JS bundle at build time.
# Set them as Build Arguments in Dokploy (or --build-arg in docker build).
# Placeholder defaults prevent build crashes; override with real values.
ARG NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ARG NEXT_PUBLIC_WALLET=
ARG NEXT_PUBLIC_DEPOSITS_ENABLED=true
ARG NEXT_PUBLIC_SITE_URL=
ARG NEXT_PUBLIC_MARKETING_DOMAIN=
ARG NEXT_PUBLIC_APP_DOMAIN=

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_WALLET=$NEXT_PUBLIC_WALLET \
    NEXT_PUBLIC_DEPOSITS_ENABLED=$NEXT_PUBLIC_DEPOSITS_ENABLED \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_MARKETING_DOMAIN=$NEXT_PUBLIC_MARKETING_DOMAIN \
    NEXT_PUBLIC_APP_DOMAIN=$NEXT_PUBLIC_APP_DOMAIN \
    NEXT_TELEMETRY_DISABLED=1

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate && pnpm build

# ── Stage 3: Production runner ────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

# Runtime-only secrets are injected by Dokploy as Environment Variables:
#   SUPABASE_SERVICE_ROLE_KEY, DESTINATION_WALLET, OPENAI_API_KEY
CMD ["node", "server.js"]
