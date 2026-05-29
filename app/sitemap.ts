import { MetadataRoute } from 'next';
import { VALID_LOCALES, type Locale } from './i18n/utils/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const marketingDomain = process.env.NEXT_PUBLIC_MARKETING_DOMAIN || 'orbitrade.io';
  const baseUrl = `https://${marketingDomain}`;

  // Only public/marketing routes - protected routes live on app domain
  const routes = [
    '', // Homepage
    '/how-it-works',
    '/terms',
    '/privacy',
    '/contact',
  ];

  // Generate sitemap entries for each route in each language
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    VALID_LOCALES.forEach((locale: Locale) => {
      const url = `${baseUrl}/${locale}${route}`;

      // Create alternates for all languages
      const alternates = {
        languages: {} as Record<string, string>,
      };

      VALID_LOCALES.forEach((altLocale: Locale) => {
        const localeMap: Record<Locale, string> = {
          en: 'en-US',
          es: 'es-ES',
        };
        alternates.languages[localeMap[altLocale]] = `${baseUrl}/${altLocale}${route}`;
      });

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates,
      });
    });
  });

  return sitemapEntries;
}
