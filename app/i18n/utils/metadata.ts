import { Metadata } from 'next';
import type { Locale } from './locales';
import { enMessages } from '../messages/en';
import { esMessages } from '../messages/es';

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  es: esMessages,
};

type MessageId = keyof typeof enMessages;

function formatMessage(locale: Locale, id: MessageId): string {
  return messages[locale][id] || messages.en[id] || id;
}

export function getSiteMetadata(locale: Locale): Metadata {
  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
  };

  return {
    title: formatMessage(locale, 'metadata.site.title'),
    description: formatMessage(locale, 'metadata.site.description'),
    metadataBase: new URL('https://orbitrade.io'),
    keywords: formatMessage(locale, 'metadata.site.keywords').split(', '),
    authors: [{ name: 'ORBITRADE Team' }],
    openGraph: {
      title: formatMessage(locale, 'metadata.site.title'),
      description: formatMessage(locale, 'metadata.site.description'),
      type: 'website',
      locale: localeMap[locale],
      url: `https://orbitrade.io/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: formatMessage(locale, 'metadata.site.title'),
      description: formatMessage(locale, 'metadata.site.description'),
    },
    alternates: {
      canonical: `https://orbitrade.io/${locale}`,
      languages: {
        'en-US': 'https://orbitrade.io/en',
        'es-ES': 'https://orbitrade.io/es',
      },
    },
  };
}

export function getPageMetadata(locale: Locale, pageKey: string): Metadata {
  const titleKey = `metadata.${pageKey}.title` as MessageId;
  const descriptionKey = `metadata.${pageKey}.description` as MessageId;

  return {
    title: formatMessage(locale, titleKey),
    description: formatMessage(locale, descriptionKey),
  };
}
