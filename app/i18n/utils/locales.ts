export type Locale = 'en' | 'es';

export const DEFAULT_LOCALE: Locale = 'es';

// Valid locales array for cleaner validation (ordered by priority)
export const VALID_LOCALES: readonly Locale[] = ['en', 'es'] as const;

// Helper function to validate locale
export const isValidLocale = (locale: string | undefined): locale is Locale => {
  return locale !== undefined && (VALID_LOCALES as readonly string[]).includes(locale);
};