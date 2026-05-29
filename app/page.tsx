'use client';

import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { investmentPlans } from "./constants/investmentPlans";

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';
const BORDER = 'rgba(255,255,255,0.06)';

function HeroSection() {
  const router = useRouter();
  const intl = useIntl();

  return (
    <section
      style={{ background: GRAPHITE, borderBottom: `1px solid ${BORDER}` }}
      className="min-h-[88vh] flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
          style={{ background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.25)', color: AMBER }}
        >
          {intl.formatMessage({ id: 'pages.home.hero.badge' })}
        </div>

        <h1 style={{ color: TEXT }} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5">
          {intl.formatMessage({ id: 'pages.home.hero.headline' })}
          {' '}
          <span style={{ color: AMBER }}>
            {intl.formatMessage({ id: 'pages.home.hero.headlineAccent' })}
          </span>
        </h1>

        <p style={{ color: MUTED }} className="text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          {intl.formatMessage({ id: 'pages.home.hero.subtitle' })}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/enlist')}
            style={{ background: AMBER, color: GRAPHITE }}
            className="px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-opacity hover:opacity-90"
          >
            {intl.formatMessage({ id: 'pages.home.hero.cta.primary' })}
          </button>
          <button
            onClick={() => router.push('/access')}
            style={{ border: '1px solid rgba(245,165,36,0.3)', color: TEXT }}
            className="px-8 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-colors hover:bg-white/5"
          >
            {intl.formatMessage({ id: 'pages.home.hero.cta.secondary' })}
          </button>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const intl = useIntl();

  const stats = [
    {
      value: intl.formatMessage({ id: 'pages.home.stats.investors.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.investors.label' }),
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.distributed.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.distributed.label' }),
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.plans.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.plans.label' }),
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.uptime.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.uptime.label' }),
    },
  ];

  return (
    <section style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }} className="py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div style={{ color: AMBER }} className="text-3xl font-bold mb-1">{stat.value}</div>
            <div style={{ color: MUTED }} className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PlansSection() {
  const router = useRouter();
  const intl = useIntl();

  const entryPlan = investmentPlans[0];
  const premiumPlan = investmentPlans[1];

  const plans = [
    {
      badge: intl.formatMessage({ id: 'pages.home.plans.entry.badge' }),
      yield: `${entryPlan.rendimiento}%`,
      minInvest: `$${entryPlan.minPrice}`,
      maxInvest: `$${entryPlan.maxPrice}`,
      duration: `${entryPlan.duracionDias}`,
      highlighted: false,
    },
    {
      badge: intl.formatMessage({ id: 'pages.home.plans.industrial.badge' }),
      yield: `${premiumPlan.rendimiento}%`,
      minInvest: `$${premiumPlan.minPrice}`,
      maxInvest: `$${premiumPlan.maxPrice}`,
      duration: `${premiumPlan.duracionDias}`,
      highlighted: true,
    },
  ];

  return (
    <section style={{ background: GRAPHITE, borderBottom: `1px solid ${BORDER}` }} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ background: 'rgba(245,165,36,0.1)', border: '1px solid rgba(245,165,36,0.25)', color: AMBER }}
          >
            {intl.formatMessage({ id: 'pages.home.plans.badge' })}
          </div>
          <h2 style={{ color: TEXT }} className="text-3xl font-bold mb-3">
            {intl.formatMessage({ id: 'pages.home.plans.title' })}
          </h2>
          <p style={{ color: MUTED }} className="text-base max-w-sm mx-auto">
            {intl.formatMessage({ id: 'pages.home.plans.subtitle' })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.badge}
              style={{
                background: SURFACE,
                border: plan.highlighted
                  ? '1px solid rgba(245,165,36,0.35)'
                  : `1px solid ${BORDER}`,
              }}
              className="rounded-xl p-6"
            >
              <div className="mb-4">
                <span
                  style={{
                    color: plan.highlighted ? AMBER : MUTED,
                    background: plan.highlighted ? 'rgba(245,165,36,0.1)' : 'rgba(124,138,160,0.08)',
                    border: `1px solid ${plan.highlighted ? 'rgba(245,165,36,0.3)' : 'rgba(124,138,160,0.2)'}`,
                  }}
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                >
                  {plan.badge}
                </span>
              </div>

              <div style={{ color: AMBER }} className="text-4xl font-bold mb-1">
                {plan.yield}
                <span style={{ color: MUTED }} className="text-base font-normal">
                  {' '}{intl.formatMessage({ id: 'pages.home.plans.perDay' })}
                </span>
              </div>

              <div style={{ color: MUTED }} className="text-sm mb-6">
                {intl.formatMessage({ id: 'pages.home.plans.minLabel' })} {plan.minInvest}
                {' — '}
                {intl.formatMessage({ id: 'pages.home.plans.maxLabel' })} {plan.maxInvest}
                {' · '}
                {plan.duration} {intl.formatMessage({ id: 'pages.home.plans.days' })}
              </div>

              <button
                onClick={() => router.push('/enlist')}
                style={{
                  background: plan.highlighted ? AMBER : 'transparent',
                  color: plan.highlighted ? GRAPHITE : TEXT,
                  border: plan.highlighted ? 'none' : `1px solid rgba(255,255,255,0.12)`,
                }}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
              >
                {intl.formatMessage({ id: 'pages.home.plans.cta' })}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const intl = useIntl();

  const steps = [
    {
      num: intl.formatMessage({ id: 'pages.home.howItWorks.step1.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step1.title' }),
      desc: intl.formatMessage({ id: 'pages.home.howItWorks.step1.description' }),
    },
    {
      num: intl.formatMessage({ id: 'pages.home.howItWorks.step2.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step2.title' }),
      desc: intl.formatMessage({ id: 'pages.home.howItWorks.step2.description' }),
    },
    {
      num: intl.formatMessage({ id: 'pages.home.howItWorks.step3.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step3.title' }),
      desc: intl.formatMessage({ id: 'pages.home.howItWorks.step3.description' }),
    },
    {
      num: intl.formatMessage({ id: 'pages.home.howItWorks.step4.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step4.title' }),
      desc: intl.formatMessage({ id: 'pages.home.howItWorks.step4.description' }),
    },
  ];

  return (
    <section style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}` }} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div style={{ color: AMBER }} className="text-xs font-semibold tracking-widest uppercase mb-3">
            {intl.formatMessage({ id: 'pages.home.howItWorks.badge' })}
          </div>
          <h2 style={{ color: TEXT }} className="text-3xl font-bold">
            {intl.formatMessage({ id: 'pages.home.howItWorks.title.part1' })}
            {' '}
            <span style={{ color: AMBER }}>
              {intl.formatMessage({ id: 'pages.home.howItWorks.title.part2' })}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              style={{ background: GRAPHITE, border: `1px solid ${BORDER}` }}
              className="p-5 rounded-xl"
            >
              <div style={{ color: AMBER }} className="text-2xl font-bold font-mono mb-3">{step.num}</div>
              <div style={{ color: TEXT }} className="font-semibold text-sm mb-2">{step.title}</div>
              <div style={{ color: MUTED }} className="text-xs leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const intl = useIntl();

  const features = [
    {
      icon: '⚡',
      title: intl.formatMessage({ id: 'pages.home.features.passiveIncome.title' }),
      desc: intl.formatMessage({ id: 'pages.home.features.passiveIncome.description' }),
    },
    {
      icon: '🔐',
      title: intl.formatMessage({ id: 'pages.home.features.secure.title' }),
      desc: intl.formatMessage({ id: 'pages.home.features.secure.description' }),
    },
    {
      icon: '📊',
      title: intl.formatMessage({ id: 'pages.home.features.instant.title' }),
      desc: intl.formatMessage({ id: 'pages.home.features.instant.description' }),
    },
    {
      icon: '🤝',
      title: intl.formatMessage({ id: 'pages.home.features.community.title' }),
      desc: intl.formatMessage({ id: 'pages.home.features.community.description' }),
    },
  ];

  return (
    <section style={{ background: GRAPHITE, borderBottom: `1px solid ${BORDER}` }} className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div style={{ color: AMBER }} className="text-xs font-semibold tracking-widest uppercase mb-3">
            {intl.formatMessage({ id: 'pages.home.features.badge' })}
          </div>
          <h2 style={{ color: TEXT }} className="text-3xl font-bold">
            {intl.formatMessage({ id: 'pages.home.features.title.part1' })}
            {' '}
            <span style={{ color: AMBER }}>
              {intl.formatMessage({ id: 'pages.home.features.title.part2' })}
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
              className="p-5 rounded-xl flex gap-4"
            >
              <div
                style={{ background: 'rgba(245,165,36,0.1)', color: AMBER, flexShrink: 0 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              >
                {f.icon}
              </div>
              <div>
                <div style={{ color: TEXT }} className="font-semibold text-sm mb-1">{f.title}</div>
                <div style={{ color: MUTED }} className="text-xs leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const router = useRouter();
  const intl = useIntl();

  const badges = [
    intl.formatMessage({ id: 'pages.home.cta.badge1' }),
    intl.formatMessage({ id: 'pages.home.cta.badge2' }),
    intl.formatMessage({ id: 'pages.home.cta.badge3' }),
  ];

  return (
    <section style={{ background: SURFACE }} className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 style={{ color: TEXT }} className="text-3xl font-bold mb-4">
          {intl.formatMessage({ id: 'pages.home.cta.title.part1' })}
          {' '}
          <span style={{ color: AMBER }}>
            {intl.formatMessage({ id: 'pages.home.cta.title.part2' })}
          </span>
          {intl.formatMessage({ id: 'pages.home.cta.title.part3' })}
        </h2>

        <p style={{ color: MUTED }} className="text-base mb-8">
          {intl.formatMessage({ id: 'pages.home.cta.subtitle' })}
        </p>

        <button
          onClick={() => router.push('/enlist')}
          style={{ background: AMBER, color: GRAPHITE }}
          className="px-10 py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-opacity hover:opacity-90"
        >
          {intl.formatMessage({ id: 'pages.home.cta.button' })}
        </button>

        <div
          style={{ borderTop: `1px solid ${BORDER}` }}
          className="mt-10 pt-8 flex flex-wrap justify-center gap-6"
        >
          {badges.map((badge) => (
            <div key={badge} style={{ color: MUTED }} className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" style={{ color: AMBER }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OrbitradeLanding() {
  return (
    <div style={{ background: GRAPHITE }}>
      <HeroSection />
      <StatsSection />
      <PlansSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
