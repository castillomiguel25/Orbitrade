'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { esMessages, enMessages, itMessages, ptMessages } from './messages';
import {
  type Locale,
  getLocaleWithFallback,
  setLocaleToCookies,
  DEFAULT_LOCALE,
} from './utils';

interface IntlContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

const messages: Record<Locale, any> = {
  en: enMessages,
  es: esMessages,
  pt: ptMessages,
  it: itMessages,
};

export function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load locale from cookies or detect browser language on mount
  useEffect(() => {
    const detectedLocale = getLocaleWithFallback();
    setLocale(detectedLocale);
    
    // Save the detected locale to cookies if it wasn't already saved
    setLocaleToCookies(detectedLocale);
    
    setIsLoaded(true);
  }, []);

  // Save locale to cookies when it changes
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocaleToCookies(newLocale);
  };

  // Don't render until we've loaded the locale
  if (!isLoaded) {
    return null;
  }

  return (
    <IntlContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <ReactIntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale={DEFAULT_LOCALE}
      >
        {children}
      </ReactIntlProvider>
    </IntlContext.Provider>
  );
}

export function useIntl() {
  const context = useContext(IntlContext);
  if (context === undefined) {
    throw new Error('useIntl must be used within an IntlProvider');
  }
  return context;
}