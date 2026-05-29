"use client";

import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useProfileStore } from '@/app/store/useProfileStore';
import { supabase } from '@/app/utils/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function AccountPage() {
  const intl = useIntl();
  const { profile, fetchProfile } = useProfileStore();

  // Profile
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch('/api/profileUpdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error();
      await fetchProfile();
      toast.success(intl.formatMessage({ id: 'pages.account.profileSaved' }));
    } catch {
      toast.error(intl.formatMessage({ id: 'notifications.error.generic' }));
    } finally {
      setSavingProfile(false);
    }
  }

  // Withdrawal key
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [savingKey, setSavingKey] = useState(false);

  async function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    if (newKey !== confirmKey) {
      toast.error(intl.formatMessage({ id: 'notifications.error.passwordMismatch' }));
      return;
    }
    setSavingKey(true);
    try {
      const res = await fetch('/api/withdrawalkey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaClave: newKey.trim() }),
      });
      if (!res.ok) throw new Error();
      setNewKey('');
      setConfirmKey('');
      await fetchProfile();
      toast.success(intl.formatMessage({ id: 'notifications.success.withdrawalKeyConfigured' }));
    } catch {
      toast.error(intl.formatMessage({ id: 'notifications.error.savingPassword' }));
    } finally {
      setSavingKey(false);
    }
  }

  // 2FA
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [totpUri, setTotpUri] = useState('');
  const [factorId, setFactorId] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [showDisable, setShowDisable] = useState(false);

  const checkMfaStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const verified = data.totp.find((f: { status: string; id: string }) => f.status === 'verified');
      setMfaEnabled(!!verified);
      if (verified) setFactorId(verified.id);
    } catch {
      setMfaEnabled(false);
    } finally {
      setMfaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    checkMfaStatus();
  }, [fetchProfile, checkMfaStatus]);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator',
      });
      if (error) throw error;
      setTotpUri(data.totp.uri);
      setFactorId(data.id);
    } catch {
      toast.error(intl.formatMessage({ id: '2fa.error' }));
      setEnrolling(false);
    }
  }

  async function handleVerifyEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (verifyCode.length !== 6) return;
    setVerifyLoading(true);
    try {
      const { data: challenge, error: ce } = await supabase.auth.mfa.challenge({ factorId });
      if (ce) throw ce;
      const { error: ve } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code: verifyCode });
      if (ve) throw ve;
      setMfaEnabled(true);
      setEnrolling(false);
      setTotpUri('');
      setVerifyCode('');
      toast.success(intl.formatMessage({ id: '2fa.setupSuccess' }));
    } catch {
      toast.error(intl.formatMessage({ id: '2fa.invalidCode' }));
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleDisable(e: React.FormEvent) {
    e.preventDefault();
    if (disableCode.length !== 6) return;
    setVerifyLoading(true);
    try {
      const { data: challenge, error: ce } = await supabase.auth.mfa.challenge({ factorId });
      if (ce) throw ce;
      const { error: ve } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code: disableCode });
      if (ve) throw ve;
      const { error: ue } = await supabase.auth.mfa.unenroll({ factorId });
      if (ue) throw ue;
      setMfaEnabled(false);
      setFactorId('');
      setShowDisable(false);
      setDisableCode('');
      toast.success(intl.formatMessage({ id: '2fa.disableSuccess' }));
    } catch {
      toast.error(intl.formatMessage({ id: '2fa.invalidCode' }));
    } finally {
      setVerifyLoading(false);
    }
  }

  function cancelEnroll() {
    if (factorId && !mfaEnabled) supabase.auth.mfa.unenroll({ factorId });
    setEnrolling(false);
    setTotpUri('');
    setVerifyCode('');
  }

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E6E8EC]">
      <div className="max-w-xl mx-auto px-4 py-6 pb-24 md:py-8 space-y-6">

        <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">
          {intl.formatMessage({ id: 'pages.account.pageTitle' })}
        </h1>

        {/* Profile section */}
        <section className="rounded-xl p-5 space-y-4" style={{ background: '#161A21', border: '1px solid #2A2F3A' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#F5A524' }}>
            {intl.formatMessage({ id: 'pages.account.profileTitle' })}
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#7C8AA0' }}>
                {intl.formatMessage({ id: 'pages.account.nameLabel' })}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={intl.formatMessage({ id: 'pages.account.namePlaceholder' })}
                className="w-full rounded-lg px-3 py-2.5 text-sm font-mono outline-none"
                style={{ background: '#0E1116', border: '1px solid #2A2F3A', color: '#E6E8EC' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#7C8AA0' }}>
                {intl.formatMessage({ id: 'pages.account.emailLabel' })}
              </label>
              <input
                type="email"
                value={profile?.email ?? ''}
                readOnly
                className="w-full rounded-lg px-3 py-2.5 text-sm font-mono outline-none cursor-default"
                style={{ background: '#0E1116', border: '1px solid #2A2F3A', color: '#7C8AA0' }}
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: '#F5A524', color: '#0E1116', opacity: savingProfile ? 0.7 : 1 }}
            >
              {intl.formatMessage({ id: 'pages.account.saveProfile' })}
            </button>
          </form>
        </section>

        {/* Withdrawal key section */}
        <section className="rounded-xl p-5 space-y-4" style={{ background: '#161A21', border: '1px solid #2A2F3A' }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#F5A524' }}>
            {intl.formatMessage({ id: 'pages.account.withdrawalKeyTitle' })}
          </h2>
          <form onSubmit={handleSaveKey} className="space-y-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: '#7C8AA0' }}>
                {intl.formatMessage({ id: 'pages.account.newKeyLabel' })}
              </label>
              <input
                type="password"
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder={intl.formatMessage({ id: 'pages.account.newKeyPlaceholder' })}
                className="w-full rounded-lg px-3 py-2.5 text-sm font-mono outline-none"
                style={{ background: '#0E1116', border: '1px solid #2A2F3A', color: '#E6E8EC' }}
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmKey}
                onChange={e => setConfirmKey(e.target.value)}
                placeholder={intl.formatMessage({ id: 'pages.account.confirmKeyPlaceholder' })}
                className="w-full rounded-lg px-3 py-2.5 text-sm font-mono outline-none"
                style={{ background: '#0E1116', border: '1px solid #2A2F3A', color: '#E6E8EC' }}
              />
            </div>
            {newKey && (
              <p className="text-xs" style={{ color: newKey.length >= 8 ? '#22c55e' : '#ef4444' }}>
                {newKey.length >= 8
                  ? intl.formatMessage({ id: 'pages.account.keyStrengthSecure' })
                  : intl.formatMessage({ id: 'pages.account.keyStrengthWeak' })}
              </p>
            )}
            <button
              type="submit"
              disabled={savingKey || !newKey || !confirmKey}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{
                background: newKey && confirmKey ? '#F5A524' : '#2A2F3A',
                color: newKey && confirmKey ? '#0E1116' : '#7C8AA0',
                opacity: savingKey ? 0.7 : 1,
              }}
            >
              {intl.formatMessage({ id: 'pages.account.saveKey' })}
            </button>
          </form>
        </section>

        {/* 2FA section */}
        <section className="rounded-xl p-5 space-y-4" style={{ background: '#161A21', border: '1px solid #2A2F3A' }}>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#F5A524' }}>
              {intl.formatMessage({ id: 'pages.account.twoFaTitle' })}
            </h2>
            <p className="text-xs mt-1" style={{ color: '#7C8AA0' }}>
              {intl.formatMessage({ id: 'pages.account.twoFaSubtitle' })}
            </p>
          </div>

          {mfaLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#F5A524', borderTopColor: 'transparent' }} />
            </div>
          ) : !mfaEnabled && !enrolling ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#7C8AA0' }}>
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {intl.formatMessage({ id: 'pages.account.twoFaDisabled' })}
              </div>
              <button
                onClick={handleEnroll}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: '#F5A524', color: '#0E1116' }}
              >
                {intl.formatMessage({ id: 'pages.account.twoFaEnable' })}
              </button>
            </div>
          ) : enrolling && totpUri ? (
            <form onSubmit={handleVerifyEnrollment} className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-xl p-3" style={{ background: '#fff' }}>
                  <QRCodeSVG value={totpUri} size={180} />
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: '#7C8AA0' }}>
                {intl.formatMessage({ id: 'pages.account.twoFaScanQr' })}
              </p>
              <div>
                <label className="block text-xs mb-1" style={{ color: '#7C8AA0' }}>
                  {intl.formatMessage({ id: 'pages.account.twoFaEnterCode' })}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  autoFocus
                  className="w-full rounded-lg px-3 py-3 text-2xl text-center font-mono tracking-[0.5em] outline-none"
                  style={{ background: '#0E1116', border: '1px solid #2A2F3A', color: '#E6E8EC' }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelEnroll}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                  style={{ background: '#2A2F3A', color: '#7C8AA0' }}
                >
                  {intl.formatMessage({ id: 'pages.account.twoFaCancel' })}
                </button>
                <button
                  type="submit"
                  disabled={verifyCode.length !== 6 || verifyLoading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    background: verifyCode.length === 6 ? '#F5A524' : '#2A2F3A',
                    color: verifyCode.length === 6 ? '#0E1116' : '#7C8AA0',
                  }}
                >
                  {intl.formatMessage({ id: 'pages.account.twoFaVerify' })}
                </button>
              </div>
            </form>
          ) : mfaEnabled && !showDisable ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#22c55e' }}>
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                {intl.formatMessage({ id: 'pages.account.twoFaEnabled' })}
              </div>
              <button
                onClick={() => setShowDisable(true)}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                {intl.formatMessage({ id: 'pages.account.twoFaDisable' })}
              </button>
            </div>
          ) : showDisable ? (
            <form onSubmit={handleDisable} className="space-y-4">
              <p className="text-xs text-center" style={{ color: '#7C8AA0' }}>
                {intl.formatMessage({ id: 'pages.account.twoFaConfirmDisable' })}
              </p>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={disableCode}
                onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                className="w-full rounded-lg px-3 py-3 text-2xl text-center font-mono tracking-[0.5em] outline-none"
                style={{ background: '#0E1116', border: '1px solid rgba(239,68,68,0.4)', color: '#E6E8EC' }}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowDisable(false); setDisableCode(''); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                  style={{ background: '#2A2F3A', color: '#7C8AA0' }}
                >
                  {intl.formatMessage({ id: 'pages.account.twoFaCancel' })}
                </button>
                <button
                  type="submit"
                  disabled={disableCode.length !== 6 || verifyLoading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    background: disableCode.length === 6 ? '#ef4444' : '#2A2F3A',
                    color: disableCode.length === 6 ? '#fff' : '#7C8AA0',
                  }}
                >
                  {intl.formatMessage({ id: 'pages.account.twoFaDisable' })}
                </button>
              </div>
            </form>
          ) : null}
        </section>

      </div>
    </div>
  );
}
