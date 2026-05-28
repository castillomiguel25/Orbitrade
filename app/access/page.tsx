'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { TotpVerifyModal } from '../components/TotpVerifyModal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaLoading, setMfaLoading] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  // Terminal typing effect
  useEffect(() => {
    const line1 = intl.formatMessage({ id: 'login.terminal.line1' });
    const line2 = intl.formatMessage({ id: 'login.terminal.line2' });
    const line3 = intl.formatMessage({ id: 'login.terminal.line3' });
    const text = `${line1}\n${line2}\n${line3}`;
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setTerminalText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [intl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(intl.formatMessage({ id: 'login.completeFields' }));
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(intl.formatMessage({ id: 'login.invalidCredentials' }));
      setIsLoading(false);
      return;
    }

    // Check if MFA is required
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const hasVerifiedTotp = factorsData?.totp?.some((f: { status: string }) => f.status === 'verified');

    if (hasVerifiedTotp) {
      setIsLoading(false);
      setShowMfaModal(true);
    } else {
      toast.success(intl.formatMessage({ id: 'login.welcomeBack' }));
      setIsLoading(false);
      router.push('/command-center');
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
      router.push('/command-center');
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

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000201 0%, #0a0a0f 50%, #0a2419 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebula effects */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(19, 241, 135, 0.4), transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(220, 149, 230, 0.4), transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(19, 241, 135, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(19, 241, 135, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${5 + (i * 6.5) % 90}%`,
              top: `${10 + (i * 8) % 80}%`,
              backgroundColor: i % 2 === 0 ? '#13f187' : '#dc95e6',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#13f187' : '#dc95e6'}`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Terminal header */}
        <div
          className="mb-4 p-3 rounded-t-xl font-mono text-xs text-miner-green/70"
          style={{
            background: 'rgba(10, 10, 15, 0.9)',
            borderTop: '1px solid rgba(19, 241, 135, 0.3)',
            borderLeft: '1px solid rgba(19, 241, 135, 0.3)',
            borderRight: '1px solid rgba(19, 241, 135, 0.3)',
          }}
        >
          <pre className="whitespace-pre-wrap">{terminalText}<span className="animate-pulse">_</span></pre>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="relative p-8 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(19, 241, 135, 0.3)',
            boxShadow: '0 0 60px rgba(19, 241, 135, 0.15), inset 0 0 40px rgba(19, 241, 135, 0.03)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-miner-green rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-miner-green rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-miner-green rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-miner-green rounded-br" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.2), rgba(0, 245, 255, 0.1))',
                  border: '1px solid rgba(19, 241, 135, 0.4)',
                  boxShadow: '0 0 20px rgba(19, 241, 135, 0.3)',
                }}
              >
                <span className="text-2xl">💻</span>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-wider mb-2">
              <span
                className="italic font-light"
                style={{
                  background: 'linear-gradient(135deg, #13f187, #00f5ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ORBITRADE
              </span>
            </h1>
            <p className="text-sm font-mono text-cosmic-gray">
              {intl.formatMessage({ id: 'login.title' })} • <span className="italic text-plasma-pink">{intl.formatMessage({ id: 'login.commanderAccess' })}</span>
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                {intl.formatMessage({ id: 'login.email' })}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(19, 241, 135, 0.3)',
                  boxShadow: 'inset 0 0 20px rgba(19, 241, 135, 0.05)',
                }}
                placeholder="commander@orbitrade.io"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                {intl.formatMessage({ id: 'login.password' })}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(19, 241, 135, 0.3)',
                  boxShadow: 'inset 0 0 20px rgba(19, 241, 135, 0.05)',
                }}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-8 space-y-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="font-display tracking-wider"
            >
              <span className="flex items-center justify-center gap-2">
                <span>💻</span>
                <span>
                  <span className="font-bold">{intl.formatMessage({ id: 'login.accessButton' })}</span>{' '}
                </span>
              </span>
            </Button>

            <div className="text-center">
              <Link
                href="/password-reset"
                className="text-sm font-mono text-cosmic-gray hover:text-plasma-pink transition-colors duration-300"
              >
                {intl.formatMessage({ id: 'login.forgotPassword' })}
              </Link>
            </div>
          </div>

          {/* Register link */}
          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: '1px solid rgba(19, 241, 135, 0.15)' }}
          >
            <p className="text-sm font-mono text-cosmic-gray mb-2">
              {intl.formatMessage({ id: 'login.noAccount' })}
            </p>
            <Link
              href="/enlist"
              className="inline-flex items-center gap-2 text-sm font-display font-bold text-cyber-cyan hover:text-miner-green transition-colors duration-300"
            >
              <span>👾</span>
              <span>
                {intl.formatMessage({ id: 'login.joinColony' })}
              </span>
            </Link>
          </div>

          {/* Scan line effect */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #13f187, transparent)',
              animation: 'scanHorizontal 4s ease-in-out infinite',
            }}
          />
        </form>

        {/* Status indicator */}
        <div
          className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-cosmic-gray"
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187' }}
          />
          <span>{intl.formatMessage({ id: 'login.secureConnection' })} • <span className="italic text-miner-green">{intl.formatMessage({ id: 'login.plasminNetwork' })}</span></span>
        </div>
      </div>

      {/* 2FA Verification Modal */}
      <TotpVerifyModal
        open={showMfaModal}
        onVerify={handleMfaVerify}
        onCancel={handleMfaCancel}
        loading={mfaLoading}
        error={mfaError}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes scanHorizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
