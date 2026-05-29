'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useUserStore } from '../store/useUserStore';
import { useState } from 'react';
import { getMarketingUrl } from '../utils/domains';

interface FooterProps {
  isLogged: boolean;
}

export function Footer({ isLogged }: FooterProps) {
  const { user } = useUserStore();
  const intl = useIntl();
  const [currentYear] = useState(new Date().getFullYear());

  if (isLogged || !!user) return null;

  return (
    <footer className="relative z-30 mt-auto bg-[#0E1116] border-t border-[#7C8AA0]/15">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/25">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-semibold text-lg text-[#E6E8EC] tracking-wide">ORBITRADE</span>
            </div>
            <p className="text-[#7C8AA0] text-sm mb-6 max-w-md leading-relaxed">
              {intl.formatMessage({ id: 'footer.description' })}
            </p>
            <p className="text-[#7C8AA0]/70 text-xs leading-relaxed max-w-md">
              {intl.formatMessage({ id: 'footer.disclaimer' })}
            </p>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-4">
              {intl.formatMessage({ id: 'footer.legalLinks' })}
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: '/terms', id: 'footer.terms' },
                { href: '/privacy', id: 'footer.privacy' },
                { href: '/security', id: 'footer.security' },
                { href: '/contact', id: 'footer.contact' },
              ].map(({ href, id }) => (
                <Link
                  key={href}
                  href={getMarketingUrl(href)}
                  className="text-[#7C8AA0] text-sm hover:text-amber-400 transition-colors duration-150"
                >
                  {intl.formatMessage({ id })}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h4 className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-4">
              {intl.formatMessage({ id: 'footer.support' })}
            </h4>
            <div className="flex flex-col gap-2 text-[#7C8AA0] text-sm">
              <a href="mailto:contact@orbitrade.io" className="hover:text-amber-400 transition-colors duration-150">
                contact@orbitrade.io
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#7C8AA0]/15 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#7C8AA0] text-xs">
            © {currentYear} Orbitrade. {intl.formatMessage({ id: 'footer.rightsReserved' })}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-[#7C8AA0]">TRC20 · USDT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
