'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '../components/Button';
import { useIntl } from 'react-intl';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from 'next/link';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

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
    if (ref) setReferredBy(ref);
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
        body: JSON.stringify({ name, email, password, phone, referredBy, acceptedTerms }),
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
        {/* Brand */}
        <div className="text-center mb-8">
          <div style={{ color: AMBER }} className="text-2xl font-bold tracking-widest uppercase mb-1">
            ORBITRADE
          </div>
          <div style={{ color: MUTED }} className="text-sm">
            {intl.formatMessage({ id: 'register.joinTheColony' })}{' '}
            {intl.formatMessage({ id: 'register.colony' })}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  background: step >= s ? AMBER : 'rgba(255,255,255,0.06)',
                  color: step >= s ? GRAPHITE : MUTED,
                  flexShrink: 0,
                }}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: step > s ? AMBER : 'rgba(255,255,255,0.06)',
                  }}
                />
              )}
            </React.Fragment>
          ))}
          <div style={{ color: MUTED }} className="text-xs ml-2">
            {step === 1
              ? intl.formatMessage({ id: 'register.commanderIdentity' })
              : intl.formatMessage({ id: 'register.securityCredentials' })}
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleRegister}
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="p-8 rounded-xl"
        >
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
                  {intl.formatMessage({ id: 'register.name' })}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
                  {intl.formatMessage({ id: 'register.email' })}
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
                  {intl.formatMessage({ id: 'register.phone' })}
                </label>
                <PhoneInput
                  country={'us'}
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: '100%',
                    backgroundColor: GRAPHITE,
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: TEXT,
                    padding: '12px 16px 12px 48px',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                  buttonStyle={{
                    backgroundColor: GRAPHITE,
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px 0 0 8px',
                  }}
                  dropdownStyle={{
                    backgroundColor: SURFACE,
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: TEXT,
                  }}
                />
              </div>

              <div>
                <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
                  {intl.formatMessage({ id: 'register.referredBy' })}{' '}
                  <span style={{ color: MUTED, fontWeight: 400, textTransform: 'none' }}>
                    {intl.formatMessage({ id: 'register.optional' })}
                  </span>
                </label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  placeholder="Referral code"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep(2)}
                >
                  {intl.formatMessage({ id: 'register.continueButton' })} →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
                  {intl.formatMessage({ id: 'register.password' })}
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

              <div>
                <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
                  {intl.formatMessage({ id: 'register.confirmPassword' })}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  style={inputStyle}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: AMBER }}
                />
                <label
                  htmlFor="acceptTerms"
                  style={{ color: MUTED }}
                  className="text-sm cursor-pointer select-none"
                >
                  {intl.formatMessage({ id: 'register.acceptTerms' })}{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    style={{ color: AMBER }}
                    className="hover:opacity-80 transition-opacity underline"
                  >
                    {intl.formatMessage({ id: 'register.termsAndConditions' })}
                  </Link>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← {intl.formatMessage({ id: 'register.backButton' })}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                >
                  {intl.formatMessage({ id: 'register.joinColonyButton' })}{' '}
                  {intl.formatMessage({ id: 'register.colonyButton' })}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Sign in link */}
        <div className="mt-5 text-center">
          <span style={{ color: MUTED }} className="text-sm">
            {intl.formatMessage({ id: 'register.alreadyHaveAccount' })
              ? intl.formatMessage({ id: 'register.alreadyHaveAccount' }).split('?')[0] + '? '
              : ''}
          </span>
          <Link
            href="/access"
            style={{ color: AMBER }}
            className="text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            {intl.formatMessage({ id: 'register.accessCommandCenter' })}
          </Link>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
          <span style={{ color: MUTED }} className="text-xs">
            {intl.formatMessage({ id: 'register.secureRegistration' })}
          </span>
        </div>
      </div>

      <style jsx global>{`
        .react-tel-input .form-control:focus {
          border-color: rgba(245, 165, 36, 0.4) !important;
          box-shadow: 0 0 0 2px rgba(245, 165, 36, 0.1) !important;
        }
        .react-tel-input .country-list {
          background-color: #161A21 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .react-tel-input .country-list .country:hover {
          background-color: rgba(245, 165, 36, 0.1) !important;
        }
        .react-tel-input .country-list .country.highlight {
          background-color: rgba(245, 165, 36, 0.15) !important;
        }
        .react-tel-input .country-list .country-name {
          color: #E6E8EC !important;
        }
        .react-tel-input .country-list .dial-code {
          color: #F5A524 !important;
        }
      `}</style>
    </div>
  );
}
