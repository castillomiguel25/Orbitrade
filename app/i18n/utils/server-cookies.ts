import { cookies } from 'next/headers';
import { type Locale, DEFAULT_LOCALE, isValidLocale } from './locales';

const LOCALE_COOKIE_NAME = 'locale';

// Server-side cookie functions
export const getLocaleFromServerCookies = async (): Promise<Locale> => {
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);
    const locale = localeCookie?.value;
    
    return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}; 