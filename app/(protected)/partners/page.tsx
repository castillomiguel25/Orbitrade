"use client";

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useProfileStore } from '@/app/store/useProfileStore';
import { Referral } from '@/app/types/referral';

const LEVEL_RATES: Record<number, number> = { 1: 6, 2: 3, 3: 1 };

export default function PartnersPage() {
  const intl = useIntl();
  const { profile } = useProfileStore();

  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.referralcode && typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/enlist?ref=${profile.referralcode}`);
    }
  }, [profile?.referralcode]);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/referrals', { credentials: 'include', cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setReferrals(Array.isArray(data?.referrals) ? data.referrals : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
    const onFocus = () => fetchReferrals();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchReferrals]);

  function handleCopy() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const totalEarned = referrals.reduce((acc, r) => {
    const n = parseFloat(r.totalGanado);
    if (isNaN(n)) return acc;
    const rate = LEVEL_RATES[r.nivel] ?? 0;
    return acc + n * (rate / 100);
  }, 0);

  const totalCount = referrals.length;
  const activeCount = referrals.filter(r => r.depositoActivo).length;

  const byLevel: Record<number, Referral[]> = { 1: [], 2: [], 3: [] };
  referrals.forEach(r => {
    if (byLevel[r.nivel]) byLevel[r.nivel].push(r);
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E6E8EC]">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:py-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">
            {intl.formatMessage({ id: 'pages.partners.pageTitle' })}
          </h1>
          <p className="text-xs text-[#7C8AA0] mt-0.5">
            {intl.formatMessage({ id: 'pages.partners.pageSubtitle' })}
          </p>
        </div>

        {/* Referral link box */}
        <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider">
            {intl.formatMessage({ id: 'pages.partners.yourLink' })}
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 bg-[#0E1116] border border-[#2A2F3A] rounded-lg px-3 py-2 text-xs text-[#E6E8EC] font-mono truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                copied
                  ? 'bg-[#1A2A15] text-[#4CAF50] border border-[#2E5B25]'
                  : 'bg-[#F5A524] text-[#0E1116] hover:bg-[#D48E1A]'
              }`}
            >
              {copied
                ? intl.formatMessage({ id: 'pages.partners.copied' })
                : intl.formatMessage({ id: 'pages.partners.copy' })}
            </button>
          </div>
          {profile?.referralcode && (
            <p className="text-xs text-[#7C8AA0]">
              {intl.formatMessage({ id: 'pages.partners.yourCode' })}:{' '}
              <span className="text-[#F5A524] font-mono font-medium">{profile.referralcode}</span>
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl px-3 py-4 text-center">
            <p className="text-lg font-bold text-[#E6E8EC] font-mono">{totalCount}</p>
            <p className="text-xs text-[#7C8AA0] mt-0.5">
              {intl.formatMessage({ id: 'pages.partners.totalPartners' })}
            </p>
          </div>
          <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl px-3 py-4 text-center">
            <p className="text-lg font-bold text-[#F5A524] font-mono">{activeCount}</p>
            <p className="text-xs text-[#7C8AA0] mt-0.5">
              {intl.formatMessage({ id: 'pages.partners.activePartners' })}
            </p>
          </div>
          <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl px-3 py-4 text-center">
            <p className="text-lg font-bold text-[#E6E8EC] font-mono">
              {totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-[#7C8AA0] mt-0.5">
              {intl.formatMessage({ id: 'pages.partners.totalEarned' })} USDT
            </p>
          </div>
        </div>

        {/* Commission levels */}
        <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl p-4">
          <p className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider mb-3">
            {intl.formatMessage({ id: 'pages.partners.networkTitle' })}
          </p>
          <div className="space-y-2">
            {[1, 2, 3].map(lvl => (
              <div key={lvl} className="flex items-center gap-3 py-2 border-b border-[#1E2430] last:border-0">
                <div className="w-8 h-8 rounded-lg bg-[#F5A524]/10 border border-[#F5A524]/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#F5A524]">{lvl}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#E6E8EC]">
                    {intl.formatMessage({ id: `pages.partners.level${lvl}Title` })}
                    <span className="ml-2 text-[#F5A524] font-mono">{LEVEL_RATES[lvl]}%</span>
                  </p>
                  <p className="text-xs text-[#7C8AA0] truncate">
                    {intl.formatMessage({ id: `pages.partners.level${lvl}Desc` })}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#7C8AA0] shrink-0">
                  {byLevel[lvl].length} / {byLevel[lvl].filter(r => r.depositoActivo).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner list */}
        <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl p-4">
          <p className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider mb-3">
            {intl.formatMessage({ id: 'pages.partners.partnersTitle' })}
          </p>

          {loading ? (
            <p className="text-sm text-[#7C8AA0] py-4 text-center">
              {intl.formatMessage({ id: 'pages.partners.loading' })}
            </p>
          ) : referrals.length === 0 ? (
            <p className="text-sm text-[#7C8AA0] py-4 text-center">
              {intl.formatMessage({ id: 'pages.partners.noPartners' })}
            </p>
          ) : (
            <div className="space-y-1.5">
              {referrals.map(r => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[#0E1116] border border-[#1E2430]"
                >
                  <div className="w-6 h-6 rounded-md bg-[#F5A524]/10 border border-[#F5A524]/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#F5A524]">{r.nivel}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#E6E8EC] truncate">{r.nombre}</p>
                    <p className="text-xs text-[#7C8AA0]">{formatDate(r.fecha)}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      r.depositoActivo
                        ? 'text-[#4CAF50] bg-[#1A2A15] border-[#2E5B25]'
                        : 'text-[#7C8AA0] bg-[#161A21] border-[#2A2F3A]'
                    }`}
                  >
                    {r.depositoActivo
                      ? intl.formatMessage({ id: 'pages.partners.active' })
                      : intl.formatMessage({ id: 'pages.partners.inactive' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-[#161A21] border border-[#2A2F3A] rounded-xl p-4">
          <p className="text-xs font-medium text-[#7C8AA0] uppercase tracking-wider mb-3">
            {intl.formatMessage({ id: 'pages.partners.howItWorks' })}
          </p>
          <div className="space-y-3">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5A524]/10 border border-[#F5A524]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#F5A524]">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#E6E8EC]">
                    {intl.formatMessage({ id: `pages.partners.step${step}Title` })}
                  </p>
                  <p className="text-xs text-[#7C8AA0] mt-0.5">
                    {intl.formatMessage({ id: `pages.partners.step${step}Desc` })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
