// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { createClient } from "./utils/supabase/server";
import { IntlProvider } from "./i18n/IntlProvider";
import { getLocaleFromServerCookies } from "./i18n/utils/server-cookies";
import { getSiteMetadata } from "./i18n/utils/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromServerCookies();
  return getSiteMetadata(locale);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0E1116" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1116" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLogged = !!user;

  const initialLocale = await getLocaleFromServerCookies();

  return (
    <html lang={initialLocale} className="antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0E1116" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} font-body min-h-screen bg-graphite text-bone-white flex flex-col overflow-x-hidden`}
        style={{ background: '#0E1116' }}
      >
        <IntlProvider>
          {/* Public Header — only for unauthenticated visitors */}
          {!isLogged && <Header isLogged={false} />}

          <main className="flex-1 relative z-10 min-h-0">{children}</main>

          {/* Public Footer — only for unauthenticated visitors */}
          {!isLogged && <Footer isLogged={false} />}

          <Toaster
            position="top-center"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(22, 26, 33, 0.97)',
                border: '1px solid rgba(124, 138, 160, 0.15)',
                color: '#E6E8EC',
                backdropFilter: 'blur(16px)',
                fontSize: '0.9375rem',
                borderRadius: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                padding: '14px 16px',
              },
              classNames: {
                success: '!border-l-4 !border-l-[#22c55e]',
                error: '!border-l-4 !border-l-[#ef4444]',
                warning: '!border-l-4 !border-l-[#F5A524]',
                info: '!border-l-4 !border-l-[#7C8AA0]',
                title: 'font-semibold tracking-wide',
                description: 'text-[#7C8AA0]',
              },
            }}
          />
        </IntlProvider>
      </body>
    </html>
  );
}
