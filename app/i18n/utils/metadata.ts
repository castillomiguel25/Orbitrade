import { Metadata } from 'next';
import type { Locale } from './locales';
import { enMessages } from '../messages/en';
import { esMessages } from '../messages/es';
import { ptMessages } from '../messages/pt';
import { itMessages } from '../messages/it';

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  it: itMessages,
};

type MessageId = keyof typeof enMessages;

function formatMessage(locale: Locale, id: MessageId): string {
  return messages[locale][id] || messages.en[id] || id;
}

export function getSiteMetadata(locale: Locale): Metadata {
  const localeMap: Record<Locale, string> = {
    en: 'en_US',
    es: 'es_ES',
    pt: 'pt_BR',
    it: 'it_IT',
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
        'pt-BR': 'https://orbitrade.io/pt',
        'it-IT': 'https://orbitrade.io/it',
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
