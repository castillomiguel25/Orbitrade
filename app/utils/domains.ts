/**
 * Domain strategy utilities for dual-domain setup.
 *
 * Domain A (Marketing/Info): orbitrade.io
 *   - Landing, FAQ, How It Works, Terms, Privacy, Contact
 *   - Public content, SEO active, no login required
 *
 * Domain B (App): app.orbitrade.io
 *   - Dashboard, production, deposits, withdrawals, history, partners, account
 *   - Requires auth, no SEO (robots.txt -> Disallow: /), no ads
 *
 * Environment variables:
 *   NEXT_PUBLIC_MARKETING_DOMAIN = "orbitrade.io"
 *   NEXT_PUBLIC_APP_DOMAIN = "app.orbitrade.io"
 *
 * When both domains are configured, links will point cross-domain.
 * When only one domain is used (default), all links are relative.
 */

const MARKETING_DOMAIN = process.env.NEXT_PUBLIC_MARKETING_DOMAIN || '';
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || '';

/**
 * Check if dual-domain mode is active
 */
export function isDualDomainMode(): boolean {
  return !!(MARKETING_DOMAIN && APP_DOMAIN);
}

/**
 * Get the URL for a marketing/info page (terms, privacy, FAQ, etc.)
 * If NEXT_PUBLIC_MARKETING_DOMAIN is set, returns absolute URL.
 * Otherwise, returns relative path (single-domain mode).
 */
export function getMarketingUrl(path: string): string {
  if (MARKETING_DOMAIN) {
    return `https://${MARKETING_DOMAIN}${path}`;
  }
  return path;
}

/**
 * Get the URL for an app page (dashboard, production, deposits, etc.)
 * If NEXT_PUBLIC_APP_DOMAIN is set, returns absolute URL.
 * Otherwise, returns relative path (single-domain mode).
 */
export function getAppUrl(path: string): string {
  if (APP_DOMAIN) {
    return `https://${APP_DOMAIN}${path}`;
  }
  return path;
}
