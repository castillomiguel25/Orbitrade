"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";

export function Header({ isLogged }: { isLogged?: boolean }) {
  const { user, isLoading, clearUser } = useUserStore();
  const router = useRouter();
  const intl = useIntl();
  const [scrolled, setScrolled] = useState(false);

  const logged = isLogged || !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    clearUser();
    router.refresh();
  };

  if (isLoading && typeof isLogged !== 'boolean') {
    return (
      <header className="w-full flex items-center justify-between px-6 py-4 bg-transparent relative z-50">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 animate-pulse" />
          <div className="w-28 h-6 rounded bg-amber-500/10 animate-pulse hidden sm:block" />
        </div>
        {/* Actions Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 rounded-lg bg-amber-500/10 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 relative z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0E1116]/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
      style={{
        borderBottom: scrolled ? '1px solid rgba(245, 165, 36, 0.15)' : 'none',
        boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 165, 36, 0.05)' : 'none'
      }}
    >
      {/* Logo & Branding */}
      <Link href={logged ? "/command-center" : "/"} className="flex items-center gap-3 group">
      </Link>

      {/* Navigation Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {!logged ? (
          <div className="flex gap-2 sm:gap-3 items-center">
            {/* Register Button */}
            <Link href="/enlist">
              <Button
                variant="primary"
                size="sm"
                className="hidden sm:flex"
              >
                <span className="flex items-center gap-2">
                  <span>🛸</span>
                  {intl.formatMessage({ id: 'header.startNow' })}
                </span>
              </Button>
            </Link>

            {/* Login Button */}
            <Link href="/access">
              <Button
                variant="outline"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <span>👾</span>
                  {intl.formatMessage({ id: 'header.login' })}
                </span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status Indicator */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(14, 17, 22, 0.6)',
                border: '1px solid rgba(245, 165, 36, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: '#F5A524',
                  boxShadow: '0 0 8px #F5A524'
                }}
              />
              <span className="text-xs font-mono font-semibold text-amber-400 tracking-wider">
                CONNECTED
              </span>
            </div>

            {/* Dashboard Link (mobile) */}
            <Link href="/command-center" className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
              >
                <span>🎛️</span>
              </Button>
            </Link>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {intl.formatMessage({ id: 'header.logout' })}
                </span>
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Decorative scan line */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(245, 165, 36, 0.5), transparent)',
          opacity: scrolled ? 0.8 : 0.3,
          animation: 'minerScanHorizontal 4s ease-in-out infinite'
        }}
      />

      {/* Custom animation */}
      <style jsx>{`
        @keyframes minerScanHorizontal {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(0.5);
          }
          50% {
            opacity: 0.8;
            transform: scaleX(1);
          }
        }
      `}</style>
    </header>
  );
}
