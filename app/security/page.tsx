'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

const PROTOCOLS = [
  { key: 'quantumEncryption',        icon: '🔒' },
  { key: 'biometricAuthentication',  icon: '🛡️' },
  { key: 'fleetMonitoring',          icon: '📊' },
  { key: 'cargoProtection',          icon: '🔑' },
];

const BEST_PRACTICES = [
  { key: 'secureAccount' },
  { key: 'safeCommunication' },
  { key: 'extractionSecurity' },
];

const METRICS = [
  { key: 'uptimeSecurity',  value: '99.9%',   descKey: 'uptimeDescription' },
  { key: 'breachesYtd',     value: '0',       descKey: 'breachesDescription' },
  { key: 'responseTime',    value: '< 1h',    descKey: 'responseDescription' },
  { key: 'monitoring',      value: '24/7',    descKey: 'monitoringDescription' },
];

export default function SecurityPage() {
  const intl = useIntl();
  const t = (id: string, values?: Record<string, string>) => intl.formatMessage({ id }, values);

  return (
    <div className="min-h-screen" style={{ background: '#0E1116' }}>
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7C8AA0] mb-8">
          <Link href="/" className="hover:text-amber-400 transition-colors">Orbitrade</Link>
          <span>/</span>
          <span className="text-[#E6E8EC]">{t('pages.security.breadcrumb')}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#E6E8EC] mb-2">
            {t('pages.security.header.title')}
          </h1>
          <p className="text-[#7C8AA0] text-sm mt-2 leading-relaxed">
            {t('pages.security.subtitle')}
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {METRICS.map(({ key, value, descKey }) => (
            <div
              key={key}
              className="rounded-xl p-4 text-center border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <p className="text-2xl font-bold text-amber-400 mb-1">{value}</p>
              <p className="text-[10px] font-semibold text-[#E6E8EC] uppercase tracking-wider mb-0.5">
                {t(`pages.security.metrics.${key}`)}
              </p>
              <p className="text-[10px] text-[#7C8AA0]">
                {t(`pages.security.metrics.${descKey}`)}
              </p>
            </div>
          ))}
        </div>

        {/* Security protocols */}
        <h2 className="text-base font-semibold text-[#E6E8EC] mb-4">
          {t('pages.security.protocols.title')}
        </h2>
        <div className="space-y-4 mb-10">
          {PROTOCOLS.map(({ key, icon }) => (
            <div
              key={key}
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[#E6E8EC] mb-1">
                    {t(`pages.security.protocols.${key}.title`)}
                  </h3>
                  <p className="text-sm text-[#7C8AA0]">
                    {t(`pages.security.protocols.${key}.description`)}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5 ml-9">
                {[0, 1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2 text-xs text-[#7C8AA0]">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                    {t(`pages.security.protocols.${key}.features.${n}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Best practices */}
        <h2 className="text-base font-semibold text-[#E6E8EC] mb-4">
          {t('pages.security.bestPractices.title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {BEST_PRACTICES.map(({ key }) => (
            <div
              key={key}
              className="rounded-xl p-4 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <h3 className="text-xs font-semibold text-[#E6E8EC] mb-1">
                {t(`pages.security.bestPractices.${key}.title`)}
              </h3>
              <p className="text-xs text-[#7C8AA0] mb-3">
                {t(`pages.security.bestPractices.${key}.description`)}
              </p>
              <ul className="space-y-1.5">
                {[0, 1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2 text-xs text-[#7C8AA0]">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                    {t(`pages.security.bestPractices.${key}.measures.${n}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Report incident */}
        <div
          className="rounded-xl p-5 border mb-8"
          style={{
            background: 'rgba(245,165,36,0.04)',
            border: '1px solid rgba(245,165,36,0.16)',
            borderLeft: '4px solid #F5A524',
          }}
        >
          <h2 className="text-sm font-semibold text-amber-400 mb-3">
            {t('pages.security.emergency.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-4">
            <div>
              <p className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-2">
                {t('pages.security.emergency.incidents.title')}
              </p>
              <ul className="space-y-1.5">
                {['unauthorizedAccess', 'compromisedKeys', 'phishing'].map((key) => (
                  <li key={key} className="flex items-start gap-2 text-xs text-[#7C8AA0]">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                    {t(`pages.security.emergency.incidents.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-2">
                {t('pages.security.emergency.actions.title')}
              </p>
              <ul className="space-y-1.5">
                {['lockdown', 'encryption', 'forensic'].map((key) => (
                  <li key={key} className="flex items-start gap-2 text-xs text-[#7C8AA0]">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                    {t(`pages.security.emergency.actions.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a
            href="mailto:contact@orbitrade.io"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            {t('pages.security.emergency.reportIncident')} →
          </a>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-5 text-sm border-t pt-6" style={{ borderColor: 'rgba(124,138,160,0.12)' }}>
          <Link href="/terms" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('footer.terms')}
          </Link>
          <Link href="/contact" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('footer.contact')}
          </Link>
        </div>
      </div>
    </div>
  );
}
