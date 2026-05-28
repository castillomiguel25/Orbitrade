// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ──────────────────────────────────────────────
// Route definitions
// ──────────────────────────────────────────────

// Routes that live on the APP domain (require auth)
const PROTECTED_PATHS = [
  '/command-center', '/commander', '/hangar', '/extraction', '/plasma-core',
  '/armada', '/hive', '/datalog', '/simulation', '/ledger'
];

// Auth pages (live on APP domain but don't require auth)
const AUTH_PATHS = ['/access', '/enlist'];

// Marketing/public pages (live on MARKETING domain)
const MARKETING_PATHS = [
  '/', '/how-it-works', '/terms', '/privacy', '/contact',
  '/tetris', '/galaxian', '/help'
];

// ──────────────────────────────────────────────
// Domain configuration
// ──────────────────────────────────────────────

const MARKETING_DOMAIN = process.env.NEXT_PUBLIC_MARKETING_DOMAIN || ''; // e.g. "plasmine.io"
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || '';             // e.g. "app.plasmine.io"

function getBaseDomain(domain: string): string | undefined {
  const parts = domain.split('.');
  if (parts.length < 2) return undefined;
  return parts.slice(-2).join('.');
}

function isDualDomainMode(hostname: string): boolean {
  if (!(MARKETING_DOMAIN && APP_DOMAIN)) return false;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') return false;
  const baseDomain = getBaseDomain(MARKETING_DOMAIN);
  if (!baseDomain) return false;
  return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);
}

/**
 * Get shared cookie domain for cross-subdomain auth.
 * e.g. "plasmine.io" -> ".plasmine.io"
 */
function getSharedCookieDomain(hostname: string): string | undefined {
  if (!isDualDomainMode(hostname)) return undefined;
  const baseDomain = getBaseDomain(MARKETING_DOMAIN);
  if (!baseDomain) return undefined;
  if (hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)) {
    return `.${baseDomain}`;
  }

  return undefined;
}

function getHostname(req: NextRequest): string {
  const host = req.headers.get('host') || '';
  // Strip port for comparison (localhost:3000 -> localhost)
  return host.split(':')[0];
}

function isMarketingDomain(hostname: string): boolean {
  return hostname === MARKETING_DOMAIN || hostname === `www.${MARKETING_DOMAIN}`;
}

function isAppDomain(hostname: string): boolean {
  return hostname === APP_DOMAIN;
}

// ──────────────────────────────────────────────
// Path matchers
// ──────────────────────────────────────────────

function isProtected(path: string): boolean {
  return PROTECTED_PATHS.some(p => path.startsWith(p));
}

function isAuthPath(path: string): boolean {
  return AUTH_PATHS.includes(path);
}

function isMarketingPath(path: string): boolean {
  // Exact match for "/" or startsWith for others
  if (path === '/') return true;
  return MARKETING_PATHS.some(p => p !== '/' && path.startsWith(p));
}

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const proto = req.headers.get('x-forwarded-proto') || '';
  const hostname = getHostname(req);
  const dualDomainMode = isDualDomainMode(hostname);

  // Force HTTPS in production
  if (
    proto === 'http' &&
    host &&
    !host.includes('localhost') &&
    !host.startsWith('127.0.0.1')
  ) {
    const httpsUrl = new URL(req.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  // Skip assets, API, static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap')
  ) {
    return res;
  }

  // ──────────────────────────────────────────
  // Dual-domain routing
  // ──────────────────────────────────────────
  if (dualDomainMode) {
    // On MARKETING domain: redirect protected/auth routes -> app domain
    if (isMarketingDomain(hostname)) {
      if (isProtected(pathname) || isAuthPath(pathname)) {
        return NextResponse.redirect(
          new URL(`https://${APP_DOMAIN}${pathname}${req.nextUrl.search}`),
          { status: 302 }
        );
      }
    }

    // On APP domain: redirect marketing-only routes -> marketing domain
    if (isAppDomain(hostname)) {
      if (isMarketingPath(pathname)) {
        return NextResponse.redirect(
          new URL(`https://${MARKETING_DOMAIN}${pathname}${req.nextUrl.search}`),
          { status: 302 }
        );
      }
    }
  }

  // ──────────────────────────────────────────
  // Auth check (both domains or single-domain)
  // ──────────────────────────────────────────
  if (isProtected(pathname) || isAuthPath(pathname) || pathname === '/') {
    const sharedDomain = getSharedCookieDomain(hostname);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => {
              res.cookies.set({
                name,
                value,
                ...options,
                sameSite: 'lax', // Required for cross-subdomain redirects
                ...(sharedDomain ? { domain: sharedDomain } : {}),
              });
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Not logged in + trying to access protected -> redirect to login
    if (!user && isProtected(pathname)) {
      const loginUrl = dualDomainMode
        ? `https://${APP_DOMAIN}/access`
        : '/access';
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // Logged in + on auth page or landing -> redirect to dashboard
    if (user && (isAuthPath(pathname) || pathname === '/')) {
      const dashboardUrl = dualDomainMode
        ? `https://${APP_DOMAIN}/command-center`
        : '/command-center';
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
  }

  return res;
}
