"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';
import { useWithdrawals } from '@/app/hooks/useWithdrawals';
import { supabase } from '@/app/utils/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export default function CommanderPage() {
  const intl = useIntl();
  const {
    claveActual,
    setClaveActual,
    nuevaClave,
    setNuevaClave,
    confirmarClave,
    setConfirmarClave,
    configurarClave,
  } = useWithdrawals();

  // 2FA State
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
      const verifiedTotp = data.totp.find((f: { status: string; id: string }) => f.status === 'verified');
      setMfaEnabled(!!verifiedTotp);
      if (verifiedTotp) {
        setFactorId(verifiedTotp.id);
      }
    } catch {
      setMfaEnabled(false);
    } finally {
      setMfaLoading(false);
    }
  }, []);

  useEffect(() => {
    checkMfaStatus();
  }, [checkMfaStatus]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Google Authenticator',
      });
      if (error) throw error;
      setTotpUri(data.totp.uri);
      setFactorId(data.id);
    } catch {
      toast.error(intl.formatMessage({ id: '2fa.error' }));
      setEnrolling(false);
    }
  };

  const handleVerifyEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode.length !== 6) return;
    setVerifyLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

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
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disableCode.length !== 6) return;
    setVerifyLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: disableCode,
      });
      if (verifyError) throw verifyError;

      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
      if (unenrollError) throw unenrollError;

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
  };

  const cancelEnroll = () => {
    setEnrolling(false);
    setTotpUri('');
    setVerifyCode('');
    if (factorId && !mfaEnabled) {
      supabase.auth.mfa.unenroll({ factorId });
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-[#0E1116]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #0d1117 0%, #000000 70%)' }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(245, 165, 36, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black tracking-wider">
                <span className="text-white">Security</span>{' '}
                <span className="text-[#E6E8EC]">Center</span>
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-1">
                 {intl.formatMessage({ id: 'pages.profile.commanderBio' })} - Security
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto space-y-8">
          {/* Withdrawal Key Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-white text-lg">🔑</span>
                    <span className="text-white font-mono text-sm tracking-wider">
                      {intl.formatMessage({ id: 'components.withdrawKeyModal.currentKey' })}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-white/10"></div>
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={claveActual}
                    onChange={(e) => setClaveActual(e.target.value)}
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                    placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.enterCurrentKey' })}
                  />
                  <div className="text-gray-400 font-mono text-xs text-center">
                    {intl.formatMessage({ id: 'components.withdrawKeyModal.authVerificationRequired' })}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-white text-lg">🆕</span>
                    <span className="text-white font-mono text-sm tracking-wider">
                      {intl.formatMessage({ id: 'components.withdrawKeyModal.newKey' })}
                    </span>
                  </div>
                  <div className="w-full h-[1px] bg-white/10"></div>
                </div>
                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={nuevaClave}
                      onChange={(e) => setNuevaClave(e.target.value)}
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                      placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.enterNewKey' })}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={confirmarClave}
                      onChange={(e) => setConfirmarClave(e.target.value)}
                      className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                      placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.confirmNewKey' })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {nuevaClave && (
              <div className="relative">
                <div className="relative bg-black rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <span className="text-white font-mono text-sm">⚡</span>
                    </div>
                    <div>
                      <div className="text-gray-400 font-mono text-xs">
                        {intl.formatMessage(
                          { id: 'components.withdrawKeyModal.codeLengthStatus' },
                          {
                            length: nuevaClave.length,
                            status: nuevaClave.length >= 8
                              ? intl.formatMessage({ id: 'components.withdrawKeyModal.secure' })
                              : intl.formatMessage({ id: 'components.withdrawKeyModal.weak' })
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={configurarClave}
              disabled={!nuevaClave || !confirmarClave}
              className={`w-full py-3 font-mono tracking-wider ${!nuevaClave || !confirmarClave ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-gray-200'} rounded-xl transition-colors font-bold`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">💾</span>
                <span className="font-bold">
                  {intl.formatMessage({ id: 'components.withdrawKeyModal.configureKey' })}
                </span>
              </div>
            </Button>
          </div>

          {/* 2FA Section */}
          <div className="relative bg-black rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-white text-lg">🔐</span>
                <span className="text-white font-mono text-sm tracking-wider">
                  {intl.formatMessage({ id: '2fa.title' })}
                </span>
              </div>
              <div className="w-full h-[1px] bg-white/10 mb-2"></div>
              <p className="text-gray-400 font-mono text-xs">
                {intl.formatMessage({ id: '2fa.subtitle' })}
              </p>
            </div>

            {mfaLoading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : !mfaEnabled && !enrolling ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                      <span className="text-red-400 font-mono text-xs">✕</span>
                    </div>
                    <span className="text-gray-400 font-mono text-sm">
                      {intl.formatMessage({ id: '2fa.disabled' })}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleEnroll}
                  className="w-full py-3 font-mono tracking-wider bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl transition-colors font-bold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold">{intl.formatMessage({ id: '2fa.enable' })}</span>
                  </div>
                </Button>
              </div>
            ) : enrolling && totpUri ? (
              <form onSubmit={handleVerifyEnrollment} className="space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl">
                    <QRCodeSVG value={totpUri} size={200} />
                  </div>
                </div>
                <p className="text-center text-gray-400 font-mono text-xs">
                  {intl.formatMessage({ id: '2fa.scanQrCode' })}
                </p>
                <div>
                  <label className="block text-xs font-mono text-amber-400 mb-2 tracking-wider uppercase">
                    {intl.formatMessage({ id: '2fa.enterCode' })}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-black border border-white/20 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-amber-500 font-mono text-2xl text-center tracking-[0.5em]"
                    placeholder={intl.formatMessage({ id: '2fa.codePlaceholder' })}
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={cancelEnroll}
                    className="py-3 font-mono tracking-wider bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {intl.formatMessage({ id: '2fa.cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={verifyCode.length !== 6}
                    loading={verifyLoading}
                    className={`flex-1 py-3 font-mono tracking-wider rounded-xl transition-colors font-bold ${verifyCode.length === 6 ? 'bg-amber-500 text-black hover:bg-amber-500/90' : 'bg-gray-800 text-gray-500'}`}
                  >
                    {intl.formatMessage({ id: '2fa.verifyCode' })}
                  </Button>
                </div>
              </form>
            ) : mfaEnabled && !showDisable ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                      <span className="text-amber-400 font-mono text-xs">✓</span>
                    </div>
                    <span className="text-amber-400 font-mono text-sm">
                      {intl.formatMessage({ id: '2fa.enabled' })}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowDisable(true)}
                  className="w-full py-3 font-mono tracking-wider bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-bold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold">{intl.formatMessage({ id: '2fa.disable' })}</span>
                  </div>
                </Button>
              </div>
            ) : showDisable ? (
              <form onSubmit={handleDisable} className="space-y-4">
                <p className="text-center text-gray-400 font-mono text-xs">
                  {intl.formatMessage({ id: '2fa.confirmDisable' })}
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full bg-black border border-white/20 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-red-400 font-mono text-2xl text-center tracking-[0.5em]"
                  placeholder={intl.formatMessage({ id: '2fa.codePlaceholder' })}
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => { setShowDisable(false); setDisableCode(''); }}
                    className="py-3 font-mono tracking-wider bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {intl.formatMessage({ id: '2fa.cancel' })}
                  </Button>
                  <Button
                    type="submit"
                    disabled={disableCode.length !== 6}
                    loading={verifyLoading}
                    className={`flex-1 py-3 font-mono tracking-wider rounded-xl transition-colors font-bold ${disableCode.length === 6 ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-800 text-gray-500'}`}
                  >
                    {intl.formatMessage({ id: '2fa.disable' })}
                  </Button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
