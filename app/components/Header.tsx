"use client";

import Link from "next/link";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { useIntl } from "react-intl";
import { useState, useEffect } from "react";
import { LanguageSelector } from "./LanguageSelector";

export function Header({ isLogged }: { isLogged?: boolean }) {
  const { user, isLoading, clearUser } = useUserStore();
  const router = useRouter();
  const intl = useIntl();
  const [scrolled, setScrolled] = useState(false);

  const logged = isLogged || !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        <div className="w-28 h-6 rounded bg-[#161A21] animate-pulse" />
        <div className="w-24 h-9 rounded-lg bg-[#161A21] animate-pulse" />
      </header>
    );
  }

  return (
    <header
      className={`w-full flex items-center justify-between px-4 sm:px-6 py-3 relative z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0E1116]/90 backdrop-blur-xl border-b border-[#7C8AA0]/10' : 'bg-transparent'
      }`}
    >
      {/* Brand */}
      <Link href={logged ? "/dashboard" : "/"} className="flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center rounded-md bg-amber-500/15 border border-amber-500/25">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <span className="font-semibold text-sm text-[#E6E8EC] tracking-wide hidden sm:block">ORBITRADE</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelector dropDirection="down" />

        {!logged ? (
          <>
            <Link href="/enlist" className="hidden sm:block">
              <Button variant="primary" size="sm">
                {intl.formatMessage({ id: 'header.startNow' })}
              </Button>
            </Link>
            <Link href="/access">
              <Button variant="outline" size="sm">
                {intl.formatMessage({ id: 'header.login' })}
              </Button>
            </Link>
          </>
        ) : (
          <Button onClick={handleLogout} variant="ghost" size="sm">
            {intl.formatMessage({ id: 'header.logout' })}
          </Button>
        )}
      </div>
    </header>
  );
}
