import Link from 'next/link';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

const quickLinks = [
  { label: 'Deposits', href: '/deposits' },
  { label: 'Production', href: '/production' },
  { label: 'Withdrawals', href: '/withdrawals' },
  { label: 'Partners', href: '/partners' },
];

export default function TrainingCenterPage() {
  return (
    <main style={{ background: GRAPHITE, minHeight: '80vh' }} className="px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.25)', color: AMBER }}
          >
            HELP CENTER
          </div>

          <h1 style={{ color: TEXT }} className="text-3xl font-bold mb-4">
            Help &amp; Resources
          </h1>

          <p style={{ color: MUTED }} className="text-base leading-relaxed max-w-md mx-auto">
            Guides, tutorials, and support documentation for Orbitrade investors.
          </p>
        </div>

        <div
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="rounded-xl p-6 mb-8 text-center"
        >
          <p style={{ color: MUTED }} className="text-sm">
            Full documentation and guides coming soon.
          </p>
        </div>

        <div className="mb-10">
          <div style={{ color: MUTED }} className="text-xs font-semibold tracking-widest uppercase mb-4">
            Quick Access
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)', color: TEXT }}
                className="p-4 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/faq"
            style={{ border: '1px solid rgba(245,165,36,0.3)', color: TEXT }}
            className="inline-block px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:bg-white/5"
          >
            View FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
