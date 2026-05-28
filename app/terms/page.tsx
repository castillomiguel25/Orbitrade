'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function TermsPage() {
  const intl = useIntl();

  const regulations = [
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.fleetEnrollment.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.fleetEnrollment.content' }),
      icon: "01",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section01' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.miningOperations.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.miningOperations.content' }),
      icon: "02",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section02' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.operatorQualification.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.operatorQualification.content' }),
      icon: "03",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section03' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.cosmicRisk.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.cosmicRisk.content' }),
      icon: "04",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section04' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.prohibitedActivities.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.prohibitedActivities.content' }),
      icon: "05",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section05' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.liabilityProtection.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.liabilityProtection.content' }),
      icon: "06",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section06' })
    },
    {
      title: intl.formatMessage({ id: 'pages.terms.regulations.regulationUpdate.title' }),
      content: intl.formatMessage({ id: 'pages.terms.regulations.regulationUpdate.content' }),
      icon: "07",
      section: intl.formatMessage({ id: 'pages.terms.regulations.section07' })
    }
  ];

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Background - matching landing */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f1a] via-[#0a1510] to-void-black" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'radial-gradient(circle, #13f187 0%, transparent 70%)', top: '5%', left: '15%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)', top: '40%', right: '10%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 max-w-4xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-mono text-cosmic-gray mb-12">
          <Link href="/" className="text-miner-green hover:text-miner-green/80 transition-colors">
            ORBITRADE
          </Link>
          <span className="text-cosmic-gray/40">/</span>
          <span className="text-star-white">
            {intl.formatMessage({ id: 'pages.terms.fleetRegulations' })}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.terms.fleetRegulations' })}</span>
          </h1>
          <p className="text-lg text-cosmic-gray font-body leading-relaxed max-w-2xl mb-6">
            {intl.formatMessage({
              id: 'pages.terms.subtitle',
              defaultMessage: 'Legal framework and compliance requirements for OrbiTrade space mining fleet operations'
            })}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-cosmic-gray">
              {intl.formatMessage({ id: 'pages.terms.lastUpdated', defaultMessage: 'LAST_UPDATED' })}:
            </span>
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.terms.stardate' })}</span>
          </div>
        </div>

        {/* Regulations */}
        <div className="space-y-6">
          {regulations.map((regulation, index) => (
            <div
              key={index}
              className="group rounded-2xl p-6 sm:p-8 transition-all duration-300"
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div className="flex items-start gap-5">
                {/* Number */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold"
                  style={{
                    background: 'rgba(19, 241, 135, 0.08)',
                    border: '1px solid rgba(19, 241, 135, 0.2)',
                    color: '#13f187',
                  }}
                >
                  {regulation.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-star-white tracking-wide">
                      {regulation.title}
                    </h2>
                    <span className="text-xs font-mono text-cosmic-gray/50">{regulation.section}</span>
                  </div>
                  <p className="text-cosmic-gray font-body leading-relaxed text-[15px]">
                    {regulation.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div
          className="mt-12 rounded-2xl p-6 sm:p-8"
          style={{
            background: 'rgba(200, 255, 0, 0.03)',
            border: '1px solid rgba(200, 255, 0, 0.15)',
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'rgba(200, 255, 0, 0.1)' }}
            >
              ⚠️
            </div>
            <h2 className="font-display text-lg font-bold tracking-wide" style={{ color: '#c8ff00' }}>
              {intl.formatMessage({ id: 'pages.terms.disclaimer.title', defaultMessage: 'LEGAL DISCLAIMER' })}
            </h2>
          </div>
          <p className="text-cosmic-gray font-body leading-relaxed text-[15px]">
            {intl.formatMessage({
              id: 'pages.terms.disclaimer.text',
              defaultMessage: 'ORBITRADE is an NFT collection and simulation game. Nothing on this platform constitutes financial advice, an investment recommendation, or a solicitation to buy or sell any asset. ORBITRADE is NOT a regulated financial product, broker, or investment fund. There are no guaranteed returns of any kind. All digital assets involve risk and may lose value. You should consult a qualified financial advisor before making any decisions. Only participate with funds you can afford to lose entirely.'
            })}
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #13f187 0%, #0a9f5a 100%)',
              color: '#000201',
            }}
          >
            {intl.formatMessage({ id: 'pages.terms.contactLegal', defaultMessage: 'CONTACT LEGAL' })}
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e8e8e8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {intl.formatMessage({ id: 'pages.terms.dataVaultProtocols', defaultMessage: 'PRIVACY POLICY' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
