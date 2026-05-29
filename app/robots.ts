import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostname = host.split(':')[0];

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || '';
  const marketingDomain = process.env.NEXT_PUBLIC_MARKETING_DOMAIN || 'orbitrade.io';

  // On the APP domain: block ALL indexing
  if (appDomain && hostname === appDomain) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  // On MARKETING domain (or single-domain mode): allow public, block protected
  const baseUrl = `https://${marketingDomain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard',
          '/production',
          '/deposits',
          '/withdrawals',
          '/history',
          '/partners',
          '/account',
          '/access',
          '/enlist',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
