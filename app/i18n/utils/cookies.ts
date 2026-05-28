import { type Locale, DEFAULT_LOCALE, isValidLocale } from './locales';

const LOCALE_COOKIE_NAME = 'locale';

// Supported locales mapping - maps browser language codes to our supported locales
const LOCALE_MAPPING: Record<string, Locale> = {
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'es-CO': 'es',
  'es-CL': 'es',
  'es-PE': 'es',
  'es-VE': 'es',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'en-AU': 'en',
};

// Function to detect browser language using Intl API and navigator
export const detectBrowserLanguage = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  try {
    // Get browser languages in order of preference
    const browserLanguages = navigator.languages || [navigator.language];
    
    // Try to find a matching locale from browser preferences
    for (const browserLang of browserLanguages) {
      // First try exact match
      if (LOCALE_MAPPING[browserLang]) {
        return LOCALE_MAPPING[browserLang];
      }
      
      // Then try language code only (e.g., 'en-US' -> 'en')
      const langCode = browserLang.split('-')[0];
      if (LOCALE_MAPPING[langCode]) {
        return LOCALE_MAPPING[langCode];
      }
    }

    // Fallback: Use Intl.DateTimeFormat to get resolved locale
    const resolvedLocale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (LOCALE_MAPPING[resolvedLocale]) {
      return LOCALE_MAPPING[resolvedLocale];
    }

    // Final fallback
    return DEFAULT_LOCALE;
  } catch (error) {
    console.warn('Error detecting browser language:', error);
    return DEFAULT_LOCALE;
  }
};

// Client-side cookie functions
export const getLocaleFromCookies = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split('=')[1];
    
  return isValidLocale(cookieValue) ? cookieValue : DEFAULT_LOCALE;
};

// Get locale with browser detection fallback
export const getLocaleWithFallback = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  // First try to get from cookies
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split('=')[1];
    
  if (isValidLocale(cookieValue)) {
    return cookieValue;
  }
  
  // If no cookie found, detect browser language
  return detectBrowserLanguage();
};

export const setLocaleToCookies = (locale: Locale): void => {
  if (typeof window === 'undefined') return;
  
  // Set cookie with 1 year expiration
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}; 