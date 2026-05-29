import Link from 'next/link';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

const steps = [
  {
    num: '01',
    title: 'Create Account',
    desc: 'Sign up in seconds with your email and phone number.',
  },
  {
    num: '02',
    title: 'Choose a Plan',
    desc: 'Select the investment tier that fits your capital goals.',
  },
  {
    num: '03',
    title: 'Earn Daily',
    desc: 'Your plan generates daily returns automatically from day one.',
  },
  {
    num: '04',
    title: 'Withdraw Anytime',
    desc: 'Request a withdrawal to your crypto wallet whenever you want.',
  },
];

export default function HowItWorksPage() {
  return (
    <main style={{ background: GRAPHITE, minHeight: '80vh' }} className="px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.25)', color: AMBER }}
          >
            HOW IT WORKS
          </div>

          <h1 style={{ color: TEXT }} className="text-3xl font-bold mb-4">
            Simple. Structured. Daily.
          </h1>

          <p style={{ color: MUTED }} className="text-base leading-relaxed max-w-md mx-auto">
            Orbitrade turns your capital into a passive income stream through structured daily yield plans.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {steps.map((step) => (
            <div
              key={step.num}
              style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
              className="p-6 rounded-xl"
            >
              <div style={{ color: AMBER }} className="text-2xl font-bold font-mono mb-3">
                {step.num}
              </div>
              <div style={{ color: TEXT }} className="font-semibold mb-2">{step.title}</div>
              <div style={{ color: MUTED }} className="text-sm leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/enlist"
            style={{ background: AMBER, color: GRAPHITE }}
            className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          >
            Start Today
          </Link>
        </div>
      </div>
    </main>
  );
}
