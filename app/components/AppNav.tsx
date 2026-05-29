"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { LanguageSelector } from "./LanguageSelector";

interface NavItem {
  href: string;
  icon: string; // SVG icon name from /public/icons/
  label: string;
  labelEs: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",    icon: "home",        label: "Dashboard",   labelEs: "Dashboard"  },
  { href: "/production",   icon: "trending-up", label: "Production",  labelEs: "Producción" },
  { href: "/deposits",     icon: "download",    label: "Deposits",    labelEs: "Depósitos"  },
  { href: "/withdrawals",  icon: "arrow-up",    label: "Withdrawals", labelEs: "Retiros"    },
  { href: "/history",      icon: "clock",       label: "History",     labelEs: "Historial"  },
  { href: "/partners",     icon: "users",       label: "Partners",    labelEs: "Partners"   },
  { href: "/account",      icon: "user",        label: "Account",     labelEs: "Cuenta"     },
];

// Bottom-tab items for mobile (5 primary routes)
const MOBILE_ITEMS = [
  NAV_ITEMS[0], // dashboard
  NAV_ITEMS[1], // production
  NAV_ITEMS[2], // deposits
  NAV_ITEMS[3], // withdrawals
  NAV_ITEMS[6], // account
];

function NavIcon({ name, className }: { name: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      className={className ?? "w-5 h-5"}
      style={{ filter: "invert(1) opacity(0.7)" }}
    />
  );
}

function ActiveNavIcon({ name, className }: { name: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      className={className ?? "w-5 h-5"}
      style={{
        filter:
          "invert(72%) sepia(55%) saturate(700%) hue-rotate(0deg) brightness(103%) contrast(101%)",
      }}
    />
  );
}

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useUserStore();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    clearUser();
    router.push("/access");
    router.refresh();
  };

  return (
    <>
      {/* ── Desktop top nav (md+) ── */}
      <nav
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center px-6 gap-1"
        style={{
          background: "rgba(22, 26, 33, 0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(124, 138, 160, 0.1)",
        }}
      >
        {/* Brand */}
        <Link
          href="/dashboard"
          className="mr-6 flex items-center gap-2 flex-shrink-0"
        >
          <span
            className="text-base font-bold tracking-wider"
            style={{ color: "#F5A524" }}
          >
            ORBITRADE
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150"
                style={{
                  color: active ? "#F5A524" : "#7C8AA0",
                  background: active
                    ? "rgba(245, 165, 36, 0.08)"
                    : "transparent",
                }}
              >
                {active ? (
                  <ActiveNavIcon name={item.icon} className="w-4 h-4" />
                ) : (
                  <NavIcon name={item.icon} className="w-4 h-4" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: language + logout */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <LanguageSelector />
          <button
            onClick={handleLogout}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-150"
            style={{ color: "#7C8AA0" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#E6E8EC")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#7C8AA0")
            }
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Mobile bottom tabs (< md) ── */}
      <nav
        className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 h-16"
        style={{
          background: "rgba(22, 26, 33, 0.99)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(124, 138, 160, 0.1)",
        }}
      >
        {MOBILE_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-150"
              style={{ color: active ? "#F5A524" : "#7C8AA0" }}
            >
              {active ? (
                <ActiveNavIcon name={item.icon} className="w-5 h-5" />
              ) : (
                <NavIcon name={item.icon} className="w-5 h-5" />
              )}
              <span
                className="text-[10px] font-medium leading-none tracking-wide"
              >
                {item.labelEs}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
