'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { useIntl } from 'react-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from 'next/link';

export function RegistroForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const intl = useIntl();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferredBy(ref);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phone) {
      toast.error(intl.formatMessage({ id: 'register.completeFields' }));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(intl.formatMessage({ id: 'register.passwordsNotMatch' }));
      return;
    }
    if (!acceptedTerms) {
      toast.error(intl.formatMessage({ id: 'register.mustAcceptTerms' }));
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, password, phone, referredBy, acceptedTerms
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(intl.formatMessage({ id: 'register.success' }));
        router.push('/access');
      } else {
        toast.error(data.error || intl.formatMessage({ id: 'register.error' }));
      }
    } catch {
      toast.error(intl.formatMessage({ id: 'register.error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(19, 241, 135, 0.3)',
    boxShadow: 'inset 0 0 20px rgba(19, 241, 135, 0.05)',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 px-4"
      style={{
        background: 'linear-gradient(135deg, #000201 0%, #0a0a0f 50%, #0a2419 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebula effects */}
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(220, 149, 230, 0.4), transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(19, 241, 135, 0.4), transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite reverse',
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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${5 + (i * 5) % 90}%`,
              top: `${5 + (i * 6) % 90}%`,
              backgroundColor: i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#dc95e6' : '#00f5ff',
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#dc95e6' : '#00f5ff'}`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="flex items-center"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm
                    transition-all duration-300
                  `}
                  style={{
                    background: step >= s
                      ? 'linear-gradient(135deg, rgba(19, 241, 135, 0.3), rgba(0, 245, 255, 0.2))'
                      : 'rgba(10, 10, 15, 0.8)',
                    border: step >= s
                      ? '2px solid #13f187'
                      : '1px solid rgba(19, 241, 135, 0.2)',
                    color: step >= s ? '#13f187' : '#6b7280',
                    boxShadow: step >= s ? '0 0 20px rgba(19, 241, 135, 0.3)' : 'none',
                  }}
                >
                  {s === 1 ? '👤' : '🔐'}
                </div>
                {s < 2 && (
                  <div
                    className="w-full h-1 mx-2"
                    style={{
                      background: step > s
                        ? 'linear-gradient(90deg, #13f187, #00f5ff)'
                        : 'rgba(19, 241, 135, 0.1)',
                      width: '100px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-mono text-cosmic-gray">
            {step === 1 ? (
              <span><span className="italic text-plasma-pink">{intl.formatMessage({ id: 'register.step1' })}</span> {intl.formatMessage({ id: 'register.commanderIdentity' })}</span>
            ) : (
              <span><span className="italic text-plasma-pink">{intl.formatMessage({ id: 'register.step2' })}</span> {intl.formatMessage({ id: 'register.securityCredentials' })}</span>
            )}
          </p>
        </div>

        {/* Registration form */}
        <form
          onSubmit={handleRegister}
          className="relative p-8 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(19, 241, 135, 0.3)',
            boxShadow: '0 0 60px rgba(19, 241, 135, 0.15), inset 0 0 40px rgba(19, 241, 135, 0.03)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-miner-green rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-plasma-pink rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-plasma-pink rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-miner-green rounded-br" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(220, 149, 230, 0.2), rgba(19, 241, 135, 0.1))',
                  border: '1px solid rgba(220, 149, 230, 0.4)',
                  boxShadow: '0 0 25px rgba(220, 149, 230, 0.3)',
                }}
              >
                <span className="text-3xl">👾</span>
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-wider mb-2">
              <span className="text-stellar-white">{intl.formatMessage({ id: 'register.joinTheColony' })}</span>{' '}
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #dc95e6, #13f187)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {intl.formatMessage({ id: 'register.colony' })}
              </span>
            </h1>
            <p className="text-sm font-mono text-cosmic-gray">
              {intl.formatMessage({ id: 'register.title' })} • <span className="italic text-cyber-cyan">ORBITRADE</span>
            </p>
          </div>

          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.name' })}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                  style={inputStyle}
                  placeholder="Commander Alpha"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.email' })}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                  style={inputStyle}
                  placeholder="commander@orbitrade.io"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.phone' })}
                </label>
                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(19, 241, 135, 0.3)',
                    color: 'white',
                    padding: '12px 16px 12px 48px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    boxShadow: 'inset 0 0 20px rgba(19, 241, 135, 0.05)',
                  }}
                  buttonStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(19, 241, 135, 0.3)',
                    borderRadius: '8px 0 0 8px',
                  }}
                  dropdownStyle={{
                    backgroundColor: 'rgba(10, 10, 15, 0.98)',
                    border: '1px solid rgba(19, 241, 135, 0.3)',
                    color: 'white',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-plasma-pink mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.referredBy' })} <span className="text-cosmic-gray">{intl.formatMessage({ id: 'register.optional' })}</span>
                </label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                  style={{
                    ...inputStyle,
                    border: '1px solid rgba(220, 149, 230, 0.3)',
                  }}
                  placeholder="Colony code"
                />
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(2)}
                className="mt-6 font-display tracking-wider"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{intl.formatMessage({ id: 'register.continueButton' })}</span>
                  <span>→</span>
                </span>
              </Button>
            </div>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.password' })}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                  style={inputStyle}
                  placeholder="••••••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                  {intl.formatMessage({ id: 'register.confirmPassword' })}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-mono text-sm text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
                  style={inputStyle}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded cursor-pointer"
                  style={{
                    accentColor: '#13f187',
                  }}
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm font-mono text-cosmic-gray cursor-pointer select-none"
                >
                  {intl.formatMessage({ id: 'register.acceptTerms' })}{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-miner-green hover:text-cyber-cyan underline transition-colors duration-300"
                  >
                    {intl.formatMessage({ id: 'register.termsAndConditions' })}
                  </Link>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="font-display tracking-wider"
                >
                  <span>← {intl.formatMessage({ id: 'register.backButton' })}</span>
                </Button>
                <Button
                  type="submit"
                  variant="plasma"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className="font-display tracking-wider"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>🛸</span>
                    <span>
                      <span className="font-bold">{intl.formatMessage({ id: 'register.joinColonyButton' })}</span>{' '}
                      <span className="italic font-light">{intl.formatMessage({ id: 'register.colonyButton' })}</span>
                    </span>
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Login link */}
          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: '1px solid rgba(19, 241, 135, 0.15)' }}
          >
            <p className="text-sm font-mono text-cosmic-gray mb-2">
              {intl.formatMessage({ id: 'register.alreadyHaveAccount' })}
            </p>
            <Link
              href="/access"
              className="inline-flex items-center gap-2 text-sm font-display font-bold text-miner-green hover:text-cyber-cyan transition-colors duration-300"
            >
              <span>💻</span>
              <span>
                {intl.formatMessage({ id: 'register.accessCommandCenter' })}
              </span>
            </Link>
          </div>

          {/* Scan line effect */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #dc95e6, transparent)',
              animation: 'scanHorizontal 4s ease-in-out infinite',
            }}
          />
        </form>

        {/* Status indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-cosmic-gray">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#dc95e6', boxShadow: '0 0 8px #dc95e6' }}
          />
          <span>
            {intl.formatMessage({ id: 'register.secureRegistration' })} • <span className="italic text-plasma-pink">{intl.formatMessage({ id: 'login.plasminNetwork' })}</span>
          </span>
        </div>
      </div>

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

      {/* Phone input global styles */}
      <style jsx global>{`
        .react-tel-input .form-control:focus {
          border-color: rgba(19, 241, 135, 0.6) !important;
          box-shadow: 0 0 0 2px rgba(19, 241, 135, 0.15) !important;
        }

        .react-tel-input .country-list {
          background-color: rgba(10, 10, 15, 0.98) !important;
          border: 1px solid rgba(19, 241, 135, 0.3) !important;
        }

        .react-tel-input .country-list .country:hover {
          background-color: rgba(19, 241, 135, 0.15) !important;
        }

        .react-tel-input .country-list .country.highlight {
          background-color: rgba(19, 241, 135, 0.25) !important;
        }

        .react-tel-input .country-list .country-name {
          color: #e8e8e8 !important;
        }

        .react-tel-input .country-list .dial-code {
          color: #13f187 !important;
        }
      `}</style>
    </div>
  );
}
