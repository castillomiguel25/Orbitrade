'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

const SECTIONS = [
  { key: 'fleetEnrollment',       num: '01' },
  { key: 'miningOperations',      num: '02' },
  { key: 'operatorQualification', num: '03' },
  { key: 'cosmicRisk',            num: '04' },
  { key: 'prohibitedActivities',  num: '05' },
  { key: 'liabilityProtection',   num: '06' },
  { key: 'regulationUpdate',      num: '07' },
];

export default function TermsPage() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return (
    <div className="min-h-screen" style={{ background: '#0E1116' }}>
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7C8AA0] mb-8">
          <Link href="/" className="hover:text-amber-400 transition-colors">Orbitrade</Link>
          <span>/</span>
          <span className="text-[#E6E8EC]">{t('pages.terms.fleetRegulations')}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#E6E8EC] mb-2">
            {t('pages.terms.fleetRegulations')}
          </h1>
          <p className="text-[#7C8AA0] text-sm">
            {t('pages.terms.lastUpdated')}: {t('pages.terms.stardate')}
          </p>
          <p className="text-[#7C8AA0] text-sm mt-2 leading-relaxed">
            {t('pages.terms.subtitle')}
          </p>
        </div>

        {/* Risk advisory */}
        <div
          className="rounded-xl p-5 mb-10"
          style={{
            background: 'rgba(245,165,36,0.05)',
            border: '1px solid rgba(245,165,36,0.18)',
            borderLeft: '4px solid #F5A524',
          }}
        >
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            {t('pages.terms.importantNotice.title')}
          </p>
          <p className="text-sm text-[#7C8AA0] leading-relaxed">
            {t('pages.terms.riskDescription')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map(({ key, num }) => (
            <div
              key={key}
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 px-2 py-0.5 rounded"
                  style={{ background: 'rgba(245,165,36,0.08)', color: '#F5A524', border: '1px solid rgba(245,165,36,0.2)' }}
                >
                  {num}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-[#E6E8EC] mb-1.5">
                    {t(`pages.terms.regulations.${key}.title`)}
                  </h2>
                  <p className="text-sm text-[#7C8AA0] leading-relaxed">
                    {t(`pages.terms.regulations.${key}.content`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 rounded-xl p-5 border"
          style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
        >
          <p className="text-xs font-semibold text-[#E6E8EC] uppercase tracking-wider mb-2">
            {t('pages.terms.disclaimer.title')}
          </p>
          <p className="text-xs text-[#7C8AA0] leading-relaxed">
            {t('pages.terms.disclaimer.text')}
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap gap-5 text-sm border-t pt-6" style={{ borderColor: 'rgba(124,138,160,0.12)' }}>
          <Link href="/privacy" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('pages.terms.dataVaultProtocols')}
          </Link>
          <Link href="/contact" className="text-[#7C8AA0] hover:text-amber-400 transition-colors">
            {t('pages.terms.legalInquiries')}
          </Link>
        </div>
      </div>
    </div>
  );
}
