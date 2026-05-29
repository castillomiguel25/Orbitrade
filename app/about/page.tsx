import Link from 'next/link';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

export default function AboutPage() {
  return (
    <main style={{ background: GRAPHITE, minHeight: '80vh' }} className="flex items-center justify-center px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.25)', color: AMBER }}
        >
          ABOUT
        </div>

        <h1 style={{ color: TEXT }} className="text-3xl font-bold mb-4">
          About Orbitrade
        </h1>

        <p style={{ color: MUTED }} className="text-base leading-relaxed mb-10">
          Orbitrade is a structured daily yield platform. Deposit capital, activate an investment plan, and earn daily returns — automatically and transparently.
        </p>

        <div
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="rounded-xl p-6 mb-8"
        >
          <p style={{ color: MUTED }} className="text-sm">
            Full company and mission information coming soon.
          </p>
        </div>

        <Link
          href="/enlist"
          style={{ background: AMBER, color: GRAPHITE }}
          className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
