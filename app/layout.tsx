// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Rajdhani, Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { createClient } from "./utils/supabase/server";
import { IntlProvider } from "./i18n/IntlProvider";
import { getLocaleFromServerCookies } from "./i18n/utils/server-cookies";
import { getSiteMetadata } from "./i18n/utils/metadata";

// ORBITRADE Typography - New Fonts
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
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
    { media: "(prefers-color-scheme: light)", color: "#000201" },
    { media: "(prefers-color-scheme: dark)", color: "#000201" },
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
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000201" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo.png" />
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${rajdhani.variable} ${inter.variable} ${firaCode.variable} font-body min-h-screen bg-void text-star-white flex flex-col overflow-x-hidden`}
      >
        {/* Miner Background Layers */}
        <div className="fixed inset-0 bg-miner z-0" />
        <div className="fixed inset-0 bg-nebula-glow z-0 pointer-events-none" />
        <div className="fixed inset-0 bg-miner-particles z-0 pointer-events-none opacity-30" />

        <IntlProvider>
          <Header isLogged={isLogged} />
          <main className="flex-1 relative z-10 min-h-0">{children}</main>
          <Footer isLogged={isLogged} />
          <Toaster
            position="top-center"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(8, 8, 12, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                backdropFilter: 'blur(16px)',
                fontFamily: 'var(--font-rajdhani)',
                fontSize: '1rem',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)',
                padding: '16px',
              },
              classNames: {
                success: '!border-l-4 !border-l-[#13f187] !bg-gradient-to-r !from-[rgba(19,241,135,0.1)] !to-transparent',
                error: '!border-l-4 !border-l-[#ef4444] !bg-gradient-to-r !from-[rgba(239,68,68,0.1)] !to-transparent',
                warning: '!border-l-4 !border-l-[#ff6b35] !bg-gradient-to-r !from-[rgba(255,107,53,0.1)] !to-transparent',
                info: '!border-l-4 !border-l-[#00f5ff] !bg-gradient-to-r !from-[rgba(0,245,255,0.1)] !to-transparent',
                title: 'font-bold tracking-wide',
                description: 'text-gray-300',
              },
            }}
          />
        </IntlProvider>
      </body>
    </html>
  );
}
