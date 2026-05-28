"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIntl } from 'react-intl';
import { PixelIcon } from './PixelIcon';
import { LanguageSelector } from './LanguageSelector';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  sublabel: string;
  color: 'miner' | 'plasma' | 'cyber' | 'bio';
  status?: 'active' | 'warning' | 'critical';
}

export function SidebarNav() {
  const intl = useIntl();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/command-center",
      icon: "home",
      label: intl.formatMessage({ id: 'components.navBar.home' }),
      sublabel: "COMMAND CENTER",
      color: "miner",
      status: "active"
    },
    {
      href: "/plasma-core",
      icon: "trending-up",
      label: intl.formatMessage({ id: 'components.navBar.earnings' }),
      sublabel: "PLASMA HARVEST",
      color: "plasma"
    },
    {
      href: "/deposits",
      icon: "download",
      label: intl.formatMessage({ id: 'components.navBar.deposits' }),
      sublabel: "DOCKING BAY",
      color: "cyber"
    },
    {
      href: "/withdrawals",
      icon: "arrow-up",
      label: intl.formatMessage({ id: 'components.navBar.withdrawals' }),
      sublabel: "EXTRACTION",
      color: "bio"
    },
    {
      href: "/datalog",
      icon: "image",
      label: intl.formatMessage({ id: 'components.navBar.movements' }),
      sublabel: "OPERATIONS LOG",
      color: "bio"
    },
    {
      href: "/hive",
      icon: "users",
      label: intl.formatMessage({ id: 'components.navBar.referrals' }),
      sublabel: "HIVE NETWORK",
      color: "miner"
    },
    {
      href: "/commander",
      icon: "user",
      label: "Commander",
      sublabel: "COMMANDER ID",
      color: "plasma"
    },
  ];

  const colorConfig = {
    miner: {
      main: '#13f187',
      rgb: '19, 241, 135',
      gradient: 'from-miner-green/20 to-miner-green/5',
      border: 'border-miner-green/40',
      text: 'text-miner-green',
      bg: 'bg-miner-green'
    },
    plasma: {
      main: '#dc95e6',
      rgb: '220, 149, 230',
      gradient: 'from-plasma-pink/20 to-plasma-pink/5',
      border: 'border-plasma-pink/40',
      text: 'text-plasma-pink',
      bg: 'bg-plasma-pink'
    },
    cyber: {
      main: '#00f5ff',
      rgb: '0, 245, 255',
      gradient: 'from-cyber-cyan/20 to-cyber-cyan/5',
      border: 'border-cyber-cyan/40',
      text: 'text-cyber-cyan',
      bg: 'bg-cyber-cyan'
    },
    bio: {
      main: '#c8ff00',
      rgb: '200, 255, 0',
      gradient: 'from-bio-yellow/20 to-bio-yellow/5',
      border: 'border-bio-yellow/40',
      text: 'text-bio-yellow',
      bg: 'bg-bio-yellow'
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-[60] md:hidden w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.2), rgba(0, 245, 255, 0.1))',
          border: '2px solid rgba(19, 241, 135, 0.5)',
          boxShadow: '0 0 30px rgba(19, 241, 135, 0.3), inset 0 0 20px rgba(19, 241, 135, 0.1)'
        }}
      >
        <div className="relative">
          <span className="text-2xl">{isExpanded ? '✕' : '💻'}</span>
          {!isExpanded && (
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187' }}
            />
          )}
        </div>
      </button>

      {/* Overlay for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`
          fixed z-50 transition-all duration-500 ease-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          left-0 top-0 h-full flex flex-col
          w-[280px] md:w-20 lg:w-[280px]
          md:hover:w-[280px]
          group
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{
          background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.98) 0%, rgba(0, 2, 1, 0.99) 100%)',
          borderRight: '1px solid rgba(19, 241, 135, 0.15)',
          boxShadow: '4px 0 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(19, 241, 135, 0.05)'
        }}
      >
        {/* Decorative edge line */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[2px]"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(19, 241, 135, 0.5), rgba(220, 149, 230, 0.3), transparent)'
          }}
        />

        {/* Header Section */}
        <div className="p-4 md:p-3 lg:p-4 border-b border-miner-green/10">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="relative w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.15), rgba(0, 245, 255, 0.08))',
                border: '1px solid rgba(19, 241, 135, 0.3)',
                boxShadow: '0 0 20px rgba(19, 241, 135, 0.15)'
              }}
            >
              <span className="text-2xl">💻</span>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-miner-green rounded-tl" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-miner-green rounded-tr" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-miner-green rounded-bl" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-miner-green rounded-br" />
            </div>

            {/* Brand text - visible on expanded */}
            <div className="flex-1 min-w-0 md:opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
              <h1
                className="font-display font-bold text-lg tracking-wider leading-none"
                style={{
                  background: 'linear-gradient(135deg, #13f187 0%, #00f5ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                PLASMINE
              </h1>
              <span className="text-[10px] font-mono text-cosmic-gray tracking-widest">
                COMMAND INTERFACE
              </span>
            </div>
          </div>

          {/* Time display */}
          <div
            className="mt-4 px-3 py-2 rounded-lg md:opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'rgba(19, 241, 135, 0.05)',
              border: '1px solid rgba(19, 241, 135, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cosmic-gray uppercase tracking-wider">
                System Time
              </span>
              <span
                className="font-mono text-sm font-bold tracking-wider"
                style={{ color: '#13f187', textShadow: '0 0 10px rgba(19, 241, 135, 0.5)' }}
              >
                {currentTime}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredItem === item.href;
            const config = colorConfig[item.color];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="block relative"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`
                    relative flex items-center gap-3 p-3 rounded-xl
                    transition-all duration-300 ease-out
                    ${isActive ? `bg-gradient-to-r ${config.gradient} border ${config.border}` : 'hover:bg-white/5'}
                  `}
                  style={{
                    boxShadow: isActive ? `0 0 25px rgba(${config.rgb}, 0.2), inset 0 0 20px rgba(${config.rgb}, 0.05)` : 'none'
                  }}
                >
                  {/* Active indicator line */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                      style={{
                        backgroundColor: config.main,
                        boxShadow: `0 0 10px ${config.main}`
                      }}
                    />
                  )}

                  {/* Icon container */}
                  <div
                    className={`
                      relative w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0
                      transition-all duration-300
                      ${isActive || isHovered ? '' : 'opacity-60'}
                    `}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, rgba(${config.rgb}, 0.2), rgba(${config.rgb}, 0.05))`
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? `1px solid rgba(${config.rgb}, 0.3)` : '1px solid transparent'
                    }}
                  >
                    <PixelIcon
                      name={item.icon}
                      className={`w-5 h-5 ${isActive ? config.text : 'text-cosmic-gray'}`}
                    />

                    {/* Glow effect */}
                    {isActive && (
                      <div
                        className="absolute inset-0 rounded-lg blur-md"
                        style={{ background: `rgba(${config.rgb}, 0.3)` }}
                      />
                    )}
                  </div>

                  {/* Text content - visible on expanded */}
                  <div className="flex-1 min-w-0 md:opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-display font-semibold text-sm tracking-wide ${isActive ? config.text : 'text-stellar-white'}`}
                        style={{ textShadow: isActive ? `0 0 15px rgba(${config.rgb}, 0.5)` : 'none' }}
                      >
                        {item.label}
                      </span>

                      {/* Status indicator */}
                      {item.status && (
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{
                            backgroundColor: item.status === 'active' ? '#13f187' : item.status === 'warning' ? '#c8ff00' : '#ff4757',
                            boxShadow: `0 0 8px ${item.status === 'active' ? '#13f187' : item.status === 'warning' ? '#c8ff00' : '#ff4757'}`
                          }}
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-cosmic-gray tracking-wider uppercase">
                      {item.sublabel}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <div
                    className={`
                      w-6 h-6 flex items-center justify-center rounded-md
                      transition-all duration-300 md:opacity-0 lg:opacity-100 group-hover:opacity-100
                      ${isHovered && !isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                    `}
                    style={{
                      background: `rgba(${config.rgb}, 0.1)`,
                      border: `1px solid rgba(${config.rgb}, 0.2)`
                    }}
                  >
                    <svg
                      className={`w-3 h-3 ${config.text}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-miner-green/10 bg-black/40 backdrop-blur-md">
          {/* Language Selector */}
          <div className="flex justify-center md:opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
            <LanguageSelector />
          </div>

          {/* Version info */}
          <div className="mt-3 text-center md:opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] font-mono text-cosmic-gray/50">
              v2.0.0 • <span className="italic">PLASMINE</span>
            </span>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                background: i % 2 === 0 ? '#13f187' : '#dc95e6',
                left: '50%',
                top: `${15 + i * 18}%`,
                animationDelay: `${i * 0.8}s`,
                boxShadow: `0 0 8px ${i % 2 === 0 ? '#13f187' : '#dc95e6'}`
              }}
            />
          ))}
        </div>

        {/* Scan line animation */}
        <div
          className="absolute left-0 right-0 h-[2px] pointer-events-none opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, #13f187, transparent)',
            animation: 'scanVertical 8s linear infinite'
          }}
        />

        <style jsx>{`
          @keyframes scanVertical {
            0% { top: 0; }
            100% { top: 100%; }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(19, 241, 135, 0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(19, 241, 135, 0.4);
          }
        `}</style>
      </nav>
    </>
  );
}
