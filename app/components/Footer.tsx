'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useUserStore } from '../store/useUserStore';
import { useState } from 'react';
import { Button } from './Button';
import { getMarketingUrl } from '../utils/domains';

interface FooterProps {
  isLogged: boolean;
}

export function Footer({ isLogged }: FooterProps) {
  const { user } = useUserStore();
  const intl = useIntl();
  const [currentYear] = useState(new Date().getFullYear());

  const logged = isLogged || !!user;

  if (logged) return null;

  return (
    <footer
      className="relative z-30 mt-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(0, 2, 1, 0.98) 100%)',
        borderTop: '1px solid rgba(19, 241, 135, 0.15)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(19, 241, 135, 0.5), transparent)'
        }}
      />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo Mark */}
              <div
                className="relative w-10 h-10 flex items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.15) 0%, rgba(0, 245, 255, 0.08) 100%)',
                  border: '1px solid rgba(19, 241, 135, 0.25)'
                }}
              >
                <span className="text-xl">💻</span>
              </div>
              {/* Logo Text */}
              <div className="flex flex-col">
                <span
                  className="font-display font-bold text-xl tracking-wider leading-none"
                  style={{
                    background: 'linear-gradient(135deg, #13f187 0%, #00f5ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ORBITRADE
                </span>
                <span className="text-[10px] font-mono text-cosmic-gray tracking-widest">
                  MINER NFT COLLECTION
                </span>
              </div>
            </div>

            <p className="text-cosmic-gray text-sm mb-6 max-w-md font-body leading-relaxed">
              {intl.formatMessage({ id: 'footer.description' })}
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <span>🌐</span>
                  {intl.formatMessage({ id: 'footer.joinCommunity' })}
                </span>
              </Button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-mono font-bold text-miner-green mb-4 tracking-wider">
              {intl.formatMessage({ id: 'footer.legalLinks' })}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href={getMarketingUrl('/terms')}
                className="text-cosmic-gray text-sm hover:text-miner-green transition-colors duration-200 font-body"
              >
                {intl.formatMessage({ id: 'footer.terms' })}
              </Link>
              <Link
                href={getMarketingUrl('/privacy')}
                className="text-cosmic-gray text-sm hover:text-miner-green transition-colors duration-200 font-body"
              >
                {intl.formatMessage({ id: 'footer.privacy' })}
              </Link>
              <Link
                href={getMarketingUrl('/contact')}
                className="text-cosmic-gray text-sm hover:text-miner-green transition-colors duration-200 font-body"
              >
                {intl.formatMessage({ id: 'footer.contact' })}
              </Link>
            </nav>
          </div>

          {/* Legal Identity */}
          <div className="col-span-1">
            <h4 className="text-sm font-mono font-bold text-miner-green mb-4 tracking-wider">
              {intl.formatMessage({ id: 'footer.legalEntity' })}
            </h4>
            <div className="flex flex-col gap-2 text-cosmic-gray text-sm font-body">
              <span>contact@orbitrade.io</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-6 pt-6"
          style={{ borderTop: '1px solid rgba(19, 241, 135, 0.1)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-cosmic-gray text-sm font-body">
              © {currentYear} <span className="text-miner-green font-mono">ORBITRADE</span>. {intl.formatMessage({ id: 'footer.rightsReserved' })}
            </p>

            {/* Social Links / Status */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(19, 241, 135, 0.1)',
                  border: '1px solid rgba(19, 241, 135, 0.2)'
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: '#13f187',
                    boxShadow: '0 0 6px #13f187'
                  }}
                />
                <span className="text-xs font-mono text-miner-green">
                  NETWORK ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              background: i % 2 === 0 ? '#13f187' : '#dc95e6',
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#13f187' : '#dc95e6'}`
            }}
          />
        ))}
      </div>
    </footer>
  );
}
