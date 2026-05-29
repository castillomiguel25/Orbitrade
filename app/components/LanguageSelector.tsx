'use client';
import { useState, useRef, useEffect } from 'react';
import { useIntl } from '../i18n/IntlProvider';
import { type Locale } from '../i18n/utils';

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { locale, setLocale } = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: Array<{ code: Locale; name: string; flag: string; short: string }> = [
    { code: 'en', name: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 rounded-lg transition-all duration-200"
        style={{
          background: isOpen ? 'rgba(0, 245, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: isOpen ? '1px solid rgba(0, 245, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <span className="text-base">{currentLanguage?.flag}</span>
        {!compact && (
          <span className="font-mono text-xs font-bold text-white">{currentLanguage?.short}</span>
        )}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-xl overflow-hidden z-50"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {languages.map((lang) => {
            const isActive = locale === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(0, 245, 255, 0.15)' : 'transparent',
                  borderLeft: isActive ? '2px solid #00f5ff' : '2px solid transparent',
                }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className={`font-mono text-sm ${isActive ? 'text-cyber-cyan font-bold' : 'text-gray-300'}`}>
                  {lang.name}
                </span>
                {isActive && (
                  <svg className="w-4 h-4 text-cyber-cyan ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
