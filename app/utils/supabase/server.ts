import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Get cookie domain for cross-subdomain auth sharing.
 * When dual-domain mode is active (plasmine.io + app.plasmine.io),
 * cookies are set on ".plasmine.io" so they work on both domains.
 */
function getCookieDomain(): string | undefined {
  const marketingDomain = process.env.NEXT_PUBLIC_MARKETING_DOMAIN;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;

  // Only set shared domain if both are configured (dual-domain mode)
  if (marketingDomain && appDomain) {
    // Extract root domain: "app.plasmine.io" -> ".plasmine.io"
    const parts = marketingDomain.split('.');
    if (parts.length >= 2) {
      return `.${parts.slice(-2).join('.')}`;
    }
  }
  return undefined;
}

export async function createClient({ write = false } = {}) {
  const cookieStore = await cookies();
  const cookieDomain = getCookieDomain();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          if (!write) return;
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax", // "lax" required for cross-subdomain redirects
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            });
          });
        },
      },
    }
  );
}
