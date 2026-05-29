'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { TotpVerifyModal } from '../components/TotpVerifyModal';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaLoading, setMfaLoading] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(intl.formatMessage({ id: 'login.completeFields' }));
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(intl.formatMessage({ id: 'login.invalidCredentials' }));
      setIsLoading(false);
      return;
    }

    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasVerifiedTotp = factorsData?.totp?.some((f: { status: string }) => f.status === 'verified');

    if (hasVerifiedTotp) {
      setIsLoading(false);
      setShowMfaModal(true);
    } else {
      toast.success(intl.formatMessage({ id: 'login.welcomeBack' }));
      setIsLoading(false);
      router.push('/dashboard');
    }
  };

  const handleMfaVerify = async (code: string) => {
    setMfaLoading(true);
    setMfaError(null);
    try {
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const totpFactor = factorsData?.totp?.find((f: { status: string; id: string }) => f.status === 'verified');
      if (!totpFactor) throw new Error('No TOTP factor found');

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code,
      });
      if (verifyError) throw verifyError;

      toast.success(intl.formatMessage({ id: 'login.welcomeBack' }));
      router.push('/dashboard');
    } catch {
      setMfaError(intl.formatMessage({ id: '2fa.invalidCode' }));
    } finally {
      setMfaLoading(false);
    }
  };

  const handleMfaCancel = () => {
    setShowMfaModal(false);
    setMfaError(null);
    supabase.auth.signOut();
  };

  const inputCls = "w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const inputStyle = {
    background: GRAPHITE,
    border: '1px solid rgba(255,255,255,0.1)',
    color: TEXT,
  };

  return (
    <div
      style={{ background: GRAPHITE, minHeight: '100vh' }}
      className="flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            style={{ color: AMBER }}
            className="text-2xl font-bold tracking-widest uppercase mb-1"
          >
            ORBITRADE
          </div>
          <div style={{ color: MUTED }} className="text-sm">
            {intl.formatMessage({ id: 'login.commanderAccess' })}
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleLogin}
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="p-8 rounded-xl space-y-5"
        >
          <div>
            <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
              {intl.formatMessage({ id: 'login.email' })}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
              {intl.formatMessage({ id: 'login.password' })}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="••••••••••••"
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              {intl.formatMessage({ id: 'login.accessButton' })}
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/password-reset"
              style={{ color: MUTED }}
              className="text-sm hover:opacity-80 transition-opacity"
            >
              {intl.formatMessage({ id: 'login.forgotPassword' })}
            </Link>
          </div>
        </form>

        {/* Sign up link */}
        <div className="mt-5 text-center">
          <span style={{ color: MUTED }} className="text-sm">
            {intl.formatMessage({ id: 'login.noAccount' })}
            {' '}
          </span>
          <Link
            href="/enlist"
            style={{ color: AMBER }}
            className="text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            {intl.formatMessage({ id: 'login.joinColony' })}
          </Link>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22c55e' }}
          />
          <span style={{ color: MUTED }} className="text-xs">
            {intl.formatMessage({ id: 'login.secureConnection' })} · {intl.formatMessage({ id: 'login.plasminNetwork' })}
          </span>
        </div>
      </div>

      <TotpVerifyModal
        open={showMfaModal}
        onVerify={handleMfaVerify}
        onCancel={handleMfaCancel}
        loading={mfaLoading}
        error={mfaError}
      />
    </div>
  );
}
