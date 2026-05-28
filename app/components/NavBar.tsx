"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelIcon } from './PixelIcon';
import { LanguageSelector } from './LanguageSelector';
import { useIntl } from 'react-intl';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const intl = useIntl();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      href: "/command-center",
      icon: "home",
      label: intl.formatMessage({ id: 'components.navBar.home' }),
      color: "miner",
    },
    {
      href: "/plasma-core",
      icon: "trending-up",
      label: intl.formatMessage({ id: 'components.navBar.earnings' }),
      color: "plasma",
    },
    {
      href: "/deposits",
      icon: "download",
      label: intl.formatMessage({ id: 'components.navBar.deposits' }),
      color: "cyber",
    },
    {
      href: "/withdrawals",
      icon: "arrow-up",
      label: intl.formatMessage({ id: 'components.navBar.withdrawals' }),
      color: "bio",
    },
    {
      href: "/datalog",
      icon: "image",
      label: intl.formatMessage({ id: 'components.navBar.movements' }),
      color: "bio",
    },
    {
      href: "/hive",
      icon: "users",
      label: intl.formatMessage({ id: 'components.navBar.referrals' }),
      color: "miner",
    },
  ];

  const getColorConfig = (color: string) => {
    const colors = {
      miner: { main: '#13f187', rgb: '19, 241, 135' },
      plasma: { main: '#dc95e6', rgb: '220, 149, 230' },
      cyber: { main: '#00f5ff', rgb: '0, 245, 255' },
      bio: { main: '#c8ff00', rgb: '200, 255, 0' },
    };
    return colors[color as keyof typeof colors] || colors.miner;
  };

  if (!mounted) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 backdrop-blur-xl"
          style={{ background: 'linear-gradient(to top, rgba(0, 2, 1, 0.98), rgba(10, 10, 15, 0.95), transparent)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(19, 241, 135, 0.4), transparent)' }} />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex items-center justify-center px-2 py-3">
        <div
          className="flex items-center gap-2 px-2 py-2 rounded-2xl"
          style={{
            background: 'rgba(10, 10, 15, 0.8)',
            border: '1px solid rgba(19, 241, 135, 0.2)',
            boxShadow: '0 0 30px rgba(19, 241, 135, 0.1)',
          }}
        >
          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const colorConfig = getColorConfig(item.color);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center p-2 sm:p-2.5 rounded-xl transition-all duration-200 min-w-[52px] sm:min-w-[60px]"
                style={{
                  background: isActive ? `rgba(${colorConfig.rgb}, 0.15)` : 'transparent',
                  border: isActive ? `1px solid rgba(${colorConfig.rgb}, 0.4)` : '1px solid transparent',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: isActive ? `0 0 20px rgba(${colorConfig.rgb}, 0.3)` : 'none',
                }}
                onClick={() => setActiveTab(item.href)}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: colorConfig.main, boxShadow: `0 0 6px ${colorConfig.main}` }}
                  />
                )}

                <PixelIcon
                  name={item.icon}
                  className="w-5 h-5"
                  style={{ color: isActive ? colorConfig.main : '#6b7280' }}
                />
                <span
                  className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase mt-1 transition-colors"
                  style={{ color: isActive ? colorConfig.main : '#6b7280' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Separator */}
          <div className="w-px h-8 mx-1" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Language Selector */}
          <LanguageSelector compact />
        </div>
      </div>
    </nav>
  );
}
