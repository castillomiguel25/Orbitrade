// Locale types and validation
export { type Locale, DEFAULT_LOCALE, VALID_LOCALES, isValidLocale } from './locales';

// Client-side functions
export { 
  detectBrowserLanguage, 
  getLocaleFromCookies, 
  getLocaleWithFallback, 
  setLocaleToCookies 
} from './cookies';

// Note: Server-side functions should be imported directly from './server-cookies'
// to avoid mixing client and server code in the same module 