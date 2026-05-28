'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function Privacy() {
  const intl = useIntl();

  const vaultProtocols = [
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_ACQUISITION_PROTOCOLS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_ACQUISITION_PROTOCOLS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol01' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.INFORMATION_PROCESSING_MATRIX.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.INFORMATION_PROCESSING_MATRIX.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol02' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.QUANTUM_ENCRYPTION_SHIELDS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.QUANTUM_ENCRYPTION_SHIELDS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol03' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_TRANSMISSION_RESTRICTIONS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_TRANSMISSION_RESTRICTIONS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol04' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.BEHAVIORAL_TRACKING_SYSTEMS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.BEHAVIORAL_TRACKING_SYSTEMS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol05' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.OPERATOR_ACCESS_RIGHTS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.OPERATOR_ACCESS_RIGHTS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol06' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_RETENTION_CYCLES.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.DATA_RETENTION_CYCLES.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol07' })
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.COMMUNICATION_CHANNELS.title' }),
      content: intl.formatMessage({ id: 'pages.privacy.vaultProtocols.COMMUNICATION_CHANNELS.content' }),
      section: intl.formatMessage({ id: 'pages.privacy.protocol08' })
    }
  ];

  const dataCategories = [
    {
      title: intl.formatMessage({ id: 'pages.privacy.dataCategories.BIOMETRIC_DATA.title' }),
      items: [
        intl.formatMessage({ id: 'pages.privacy.dataCategories.BIOMETRIC_DATA.items.0' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.BIOMETRIC_DATA.items.1' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.BIOMETRIC_DATA.items.2' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.BIOMETRIC_DATA.items.3' })
      ],
      color: '#13f187',
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.dataCategories.FINANCIAL_MATRICES.title' }),
      items: [
        intl.formatMessage({ id: 'pages.privacy.dataCategories.FINANCIAL_MATRICES.items.0' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.FINANCIAL_MATRICES.items.1' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.FINANCIAL_MATRICES.items.2' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.FINANCIAL_MATRICES.items.3' })
      ],
      color: '#00f5ff',
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.dataCategories.TECHNICAL_TELEMETRY.title' }),
      items: [
        intl.formatMessage({ id: 'pages.privacy.dataCategories.TECHNICAL_TELEMETRY.items.0' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.TECHNICAL_TELEMETRY.items.1' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.TECHNICAL_TELEMETRY.items.2' }),
        intl.formatMessage({ id: 'pages.privacy.dataCategories.TECHNICAL_TELEMETRY.items.3' })
      ],
      color: '#dc95e6',
    }
  ];

  const gdprRights = [
    {
      title: intl.formatMessage({ id: 'pages.privacy.gdpr.ACCESS_PROTOCOLS.title' }),
      description: intl.formatMessage({ id: 'pages.privacy.gdpr.ACCESS_PROTOCOLS.description' }),
      color: '#13f187',
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.gdpr.MODIFICATION_RIGHTS.title' }),
      description: intl.formatMessage({ id: 'pages.privacy.gdpr.MODIFICATION_RIGHTS.description' }),
      color: '#00f5ff',
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.gdpr.DELETION_PROCEDURES.title' }),
      description: intl.formatMessage({ id: 'pages.privacy.gdpr.DELETION_PROCEDURES.description' }),
      color: '#dc95e6',
    },
    {
      title: intl.formatMessage({ id: 'pages.privacy.gdpr.PORTABILITY_SYSTEMS.title' }),
      description: intl.formatMessage({ id: 'pages.privacy.gdpr.PORTABILITY_SYSTEMS.description' }),
      color: '#c8ff00',
    }
  ];

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Background - matching landing */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f1a] via-[#0a1510] to-void-black" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)', top: '10%', right: '15%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: 'radial-gradient(circle, #dc95e6 0%, transparent 70%)', bottom: '20%', left: '10%' }}
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
            {intl.formatMessage({ id: 'pages.privacy.breadcrumb' })}
          </span>
        </nav>

        {/* GDPR Notice */}
        <div
          className="rounded-xl p-5 mb-12"
          style={{
            background: 'rgba(0, 245, 255, 0.04)',
            border: '1px solid rgba(0, 245, 255, 0.15)',
          }}
        >
          <p className="text-xs font-mono font-bold uppercase tracking-wider mb-2 text-cyber-cyan">
            {intl.formatMessage({ id: 'pages.privacy.disclaimer.title', defaultMessage: 'DATA PROTECTION NOTICE' })}
          </p>
          <p className="text-cosmic-gray text-sm leading-relaxed mb-3">
            {intl.formatMessage({
              id: 'pages.privacy.disclaimer.text',
              defaultMessage: 'ORBITRADE is committed to protecting your personal data in compliance with the General Data Protection Regulation (GDPR) and applicable privacy laws.'
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 text-xs font-mono text-cosmic-gray/70">
            <span>{intl.formatMessage({ id: 'pages.privacy.disclaimer.dpo', defaultMessage: 'Data Protection Officer: contact@orbitrade.io' })}</span>
            <span className="hidden sm:inline text-cosmic-gray/30">|</span>
            <span>{intl.formatMessage({ id: 'pages.privacy.disclaimer.entity', defaultMessage: 'Data Controller: ORBITRADE Project' })}</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.privacy.header.title' })}</span>
          </h1>
          <p className="text-lg text-cosmic-gray font-body leading-relaxed max-w-2xl mb-6">
            {intl.formatMessage({ id: 'pages.privacy.subtitle' })}
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="text-cosmic-gray">
              {intl.formatMessage({ id: 'pages.privacy.lastUpdated' })}:
            </span>
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.privacy.stardate' })}</span>
          </div>
        </div>

        {/* Privacy Protocols */}
        <div className="space-y-6 mb-16">
          {vaultProtocols.map((protocol, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 sm:p-8 transition-all duration-300"
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold"
                  style={{
                    background: 'rgba(0, 245, 255, 0.08)',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    color: '#00f5ff',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="font-display text-lg sm:text-xl font-bold text-star-white tracking-wide">
                      {protocol.title}
                    </h2>
                    <span className="text-xs font-mono text-cosmic-gray/50">{protocol.section}</span>
                  </div>
                  <p className="text-cosmic-gray font-body leading-relaxed text-[15px]">
                    {protocol.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Categories */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-star-white tracking-wider mb-8">
            {intl.formatMessage({ id: 'pages.privacy.dataTypes.title', defaultMessage: 'Data Collection Categories' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {dataCategories.map((category, index) => (
              <div
                key={index}
                className="rounded-xl p-6"
                style={{
                  background: 'rgba(15, 15, 20, 0.6)',
                  border: `1px solid ${category.color}15`,
                }}
              >
                <h3 className="font-display text-sm font-bold tracking-wider mb-4" style={{ color: category.color }}>
                  {category.title}
                </h3>
                <ul className="space-y-2.5">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: category.color }} />
                      <span className="text-cosmic-gray text-sm font-body">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* GDPR Rights */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-star-white tracking-wider mb-3">
            {intl.formatMessage({ id: 'pages.privacy.gdpr.title', defaultMessage: 'Your Rights (GDPR)' })}
          </h2>
          <p className="text-cosmic-gray font-body leading-relaxed mb-8 max-w-2xl">
            {intl.formatMessage({
              id: 'pages.privacy.gdpr.description',
              defaultMessage: 'OrbiTrade maintains full compliance with data protection regulations. You have the following rights over your personal data.'
            })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gdprRights.map((right, index) => (
              <div
                key={index}
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(15, 15, 20, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: right.color }} />
                  <h3 className="font-display text-sm font-bold text-star-white tracking-wide">{right.title}</h3>
                </div>
                <p className="text-cosmic-gray text-sm font-body leading-relaxed">{right.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #13f187 0%, #0a9f5a 100%)',
              color: '#000201',
            }}
          >
            {intl.formatMessage({ id: 'pages.privacy.cta.contactPrivacy', defaultMessage: 'CONTACT PRIVACY' })}
          </Link>
          <Link
            href="/terms"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e8e8e8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {intl.formatMessage({ id: 'pages.privacy.cta.viewTerms', defaultMessage: 'TERMS OF SERVICE' })}
          </Link>
        </div>
      </div>
    </div>
  );
}
