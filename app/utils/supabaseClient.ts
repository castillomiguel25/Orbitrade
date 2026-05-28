import { createBrowserClient } from '@supabase/ssr';

/**
 * Get cookie options for cross-subdomain auth sharing.
 * When dual-domain mode is active, cookies need to be accessible
 * on both orbitrade.io and app.orbitrade.io.
 */
function getCookieOptions() {
  const marketingDomain = process.env.NEXT_PUBLIC_MARKETING_DOMAIN;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;

  if (!marketingDomain || !appDomain) return undefined;

  if (typeof window === 'undefined') return undefined;

  const parts = marketingDomain.split('.');
  if (parts.length < 2) return undefined;

  const baseDomain = parts.slice(-2).join('.');
  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost');

  if (isLocalhost) return undefined;

  if (hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)) {
    return {
      domain: `.${baseDomain}`,
      sameSite: 'lax' as const,
    };
  }

  return undefined;
}

/**
 * Lazy-initialized Supabase browser client.
 * Avoids build-time crashes when NEXT_PUBLIC env vars
 * are not available during `next build`.
 */
let _supabase: ReturnType<typeof createBrowserClient> | null = null;

function getSupabase() {
  if (!_supabase) {
    const cookieOpts = getCookieOptions();
    _supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      cookieOpts ? { cookieOptions: cookieOpts } : {}
    );
  }
  return _supabase;
}

// Proxy provides backward-compatible `supabase.xxx` usage
// while deferring actual client creation until first access.
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop, _receiver) {
    const real = getSupabase();
    const value = Reflect.get(real, prop, real);
    if (typeof value === 'function') {
      return value.bind(real);
    }
    return value;
  },
});
