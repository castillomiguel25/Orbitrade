'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

const PROTOCOLS = [
  'DATA_ACQUISITION_PROTOCOLS',
  'INFORMATION_PROCESSING_MATRIX',
  'QUANTUM_ENCRYPTION_SHIELDS',
  'DATA_TRANSMISSION_RESTRICTIONS',
  'BEHAVIORAL_TRACKING_SYSTEMS',
  'OPERATOR_ACCESS_RIGHTS',
  'DATA_RETENTION_CYCLES',
  'COMMUNICATION_CHANNELS',
];

const DATA_CATEGORIES = [
  'BIOMETRIC_DATA',
  'FINANCIAL_MATRICES',
  'TECHNICAL_TELEMETRY',
];

const GDPR_RIGHTS = [
  'ACCESS_PROTOCOLS',
  'MODIFICATION_RIGHTS',
  'DELETION_PROCEDURES',
  'PORTABILITY_SYSTEMS',
];

export default function Privacy() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <div className="min-h-screen" style={{ background: '#0E1116' }}>
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7C8AA0] mb-8">
          <Link href="/" className="hover:text-amber-400 transition-colors">Orbitrade</Link>
          <span>/</span>
          <span className="text-[#E6E8EC]">{t('pages.privacy.breadcrumb')}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#E6E8EC] mb-2">
            {t('pages.privacy.header.title')}
          </h1>
          <p className="text-[#7C8AA0] text-sm">{t('pages.privacy.header.status')}</p>
          <p className="text-[#7C8AA0] text-sm mt-2 leading-relaxed">
            {t('pages.privacy.subtitle')}
          </p>
        </div>

        {/* Protocols */}
        <div className="space-y-4 mb-10">
          {PROTOCOLS.map((key, i) => (
            <div
              key={key}
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                  style={{ background: 'rgba(124,138,160,0.08)', color: '#7C8AA0', border: '1px solid rgba(124,138,160,0.18)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-[#E6E8EC] mb-1.5">
                    {t(`pages.privacy.vaultProtocols.${key}.title`)}
                  </h2>
                  <p className="text-sm text-[#7C8AA0] leading-relaxed">
                    {t(`pages.privacy.vaultProtocols.${key}.content`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data categories */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-[#E6E8EC] mb-4">
            {t('pages.privacy.dataTypes.title')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {DATA_CATEGORIES.map((key) => (
              <div
                key={key}
                className="rounded-xl p-4 border"
                style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
              >
                <p className="text-xs font-semibold text-amber-400 mb-3">
                  {t(`pages.privacy.dataCategories.${key}.title`)}
                </p>
                <ul className="space-y-1.5">
                  {[0, 1, 2, 3].map((n) => (
                    <li key={n} className="flex items-start gap-2 text-xs text-[#7C8AA0]">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">·</span>
                      {t(`pages.privacy.dataCategories.${key}.items.${n}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* GDPR rights */}
        <div className="mb-10">
          <h2 className="text-base font-semibold text-[#E6E8EC] mb-1">
            {t('pages.privacy.gdpr.title')}
          </h2>
          <p className="text-sm text-[#7C8AA0] mb-4">
            {t('pages.privacy.gdpr.description')}
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {GDPR_RIGHTS.map((key) => (
              <div
                key={key}
                className="rounded-xl p-4 border"
                style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
              >
                <p className="text-xs font-semibold text-[#E6E8EC] mb-1">
                  {t(`pages.privacy.gdpr.${key}.title`)}
                </p>
                <p className="text-xs text-[#7C8AA0] leading-relaxed">
                  {t(`pages.privacy.gdpr.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-xl p-5 border mb-8"
          style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
        >
          <p className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-2">
            {t('pages.privacy.disclaimer.title')}
          </p>
          <p className="text-xs text-[#7C8AA0] leading-relaxed mb-1">
            {t('pages.privacy.disclaimer.text')}
          </p>
          <p className="text-xs text-[#7C8AA0]">{t('pages.privacy.disclaimer.dpo')}</p>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-5 text-sm border-t pt-6" style={{ borderColor: 'rgba(124,138,160,0.12)' }}>
          <Link href="/terms" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('pages.privacy.cta.viewTerms')}
          </Link>
          <Link href="/contact" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('pages.privacy.cta.contactPrivacy')}
          </Link>
        </div>
      </div>
    </div>
  );
}
