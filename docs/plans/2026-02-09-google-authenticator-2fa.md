# Google Authenticator (TOTP 2FA) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional Google Authenticator (TOTP) two-factor authentication that users can enable from the Security Center page and must verify during login.

**Architecture:** Use Supabase's built-in MFA support (`supabase.auth.mfa.*` API). Users enroll via the Security Center (`/commander`), which generates a TOTP secret and displays a QR code using `qrcode.react` (already installed). During login, if MFA is enrolled, users are prompted for a 6-digit TOTP code before session is granted. A new `app/components/TotpVerifyModal.tsx` handles the code input. The login page checks the MFA challenge after `signInWithPassword`.

**Tech Stack:** Supabase MFA API, qrcode.react, React, Next.js 16 App Router, react-intl, Zustand, Sonner

---

### Task 1: Add i18n Translation Keys for 2FA (All 4 Languages)

**Files:**
- Modify: `app/i18n/messages/en.ts`
- Modify: `app/i18n/messages/es.ts`
- Modify: `app/i18n/messages/it.ts`
- Modify: `app/i18n/messages/pt.ts`

**Step 1: Add English keys**

In `app/i18n/messages/en.ts`, add these keys (near the login/register keys section):

```typescript
"2fa.title": "Two-Factor Authentication",
"2fa.subtitle": "Protect your account with Google Authenticator",
"2fa.enable": "Enable 2FA",
"2fa.disable": "Disable 2FA",
"2fa.enabled": "2FA Enabled",
"2fa.disabled": "2FA Disabled",
"2fa.scanQrCode": "Scan this QR code with Google Authenticator",
"2fa.enterCode": "Enter the 6-digit code from your authenticator app",
"2fa.verifyCode": "Verify Code",
"2fa.codePlaceholder": "000000",
"2fa.invalidCode": "Invalid verification code. Please try again.",
"2fa.setupSuccess": "Two-factor authentication enabled successfully!",
"2fa.disableSuccess": "Two-factor authentication disabled.",
"2fa.verificationRequired": "Enter your authenticator code to continue",
"2fa.cancel": "Cancel",
"2fa.backupWarning": "Save your recovery codes. You will need them if you lose access to your authenticator app.",
"2fa.confirmDisable": "Enter your authenticator code to disable 2FA",
"2fa.error": "Error setting up 2FA. Please try again.",
```

**Step 2: Add Spanish keys**

In `app/i18n/messages/es.ts`:

```typescript
"2fa.title": "Autenticación de Dos Factores",
"2fa.subtitle": "Protege tu cuenta con Google Authenticator",
"2fa.enable": "Activar 2FA",
"2fa.disable": "Desactivar 2FA",
"2fa.enabled": "2FA Activado",
"2fa.disabled": "2FA Desactivado",
"2fa.scanQrCode": "Escanea este código QR con Google Authenticator",
"2fa.enterCode": "Ingresa el código de 6 dígitos de tu app de autenticación",
"2fa.verifyCode": "Verificar Código",
"2fa.codePlaceholder": "000000",
"2fa.invalidCode": "Código de verificación inválido. Inténtalo de nuevo.",
"2fa.setupSuccess": "¡Autenticación de dos factores activada exitosamente!",
"2fa.disableSuccess": "Autenticación de dos factores desactivada.",
"2fa.verificationRequired": "Ingresa el código de tu autenticador para continuar",
"2fa.cancel": "Cancelar",
"2fa.backupWarning": "Guarda tus códigos de recuperación. Los necesitarás si pierdes acceso a tu app de autenticación.",
"2fa.confirmDisable": "Ingresa tu código de autenticador para desactivar 2FA",
"2fa.error": "Error al configurar 2FA. Inténtalo de nuevo.",
```

**Step 3: Add Italian keys**

In `app/i18n/messages/it.ts`:

```typescript
"2fa.title": "Autenticazione a Due Fattori",
"2fa.subtitle": "Proteggi il tuo account con Google Authenticator",
"2fa.enable": "Attiva 2FA",
"2fa.disable": "Disattiva 2FA",
"2fa.enabled": "2FA Attivato",
"2fa.disabled": "2FA Disattivato",
"2fa.scanQrCode": "Scansiona questo codice QR con Google Authenticator",
"2fa.enterCode": "Inserisci il codice a 6 cifre dalla tua app di autenticazione",
"2fa.verifyCode": "Verifica Codice",
"2fa.codePlaceholder": "000000",
"2fa.invalidCode": "Codice di verifica non valido. Riprova.",
"2fa.setupSuccess": "Autenticazione a due fattori attivata con successo!",
"2fa.disableSuccess": "Autenticazione a due fattori disattivata.",
"2fa.verificationRequired": "Inserisci il codice del tuo autenticatore per continuare",
"2fa.cancel": "Annulla",
"2fa.backupWarning": "Salva i tuoi codici di recupero. Ne avrai bisogno se perdi l'accesso alla tua app di autenticazione.",
"2fa.confirmDisable": "Inserisci il codice del tuo autenticatore per disattivare 2FA",
"2fa.error": "Errore nella configurazione 2FA. Riprova.",
```

**Step 4: Add Portuguese keys**

In `app/i18n/messages/pt.ts`:

```typescript
"2fa.title": "Autenticação de Dois Fatores",
"2fa.subtitle": "Proteja sua conta com Google Authenticator",
"2fa.enable": "Ativar 2FA",
"2fa.disable": "Desativar 2FA",
"2fa.enabled": "2FA Ativado",
"2fa.disabled": "2FA Desativado",
"2fa.scanQrCode": "Escaneie este código QR com o Google Authenticator",
"2fa.enterCode": "Digite o código de 6 dígitos do seu app de autenticação",
"2fa.verifyCode": "Verificar Código",
"2fa.codePlaceholder": "000000",
"2fa.invalidCode": "Código de verificação inválido. Tente novamente.",
"2fa.setupSuccess": "Autenticação de dois fatores ativada com sucesso!",
"2fa.disableSuccess": "Autenticação de dois fatores desativada.",
"2fa.verificationRequired": "Digite o código do seu autenticador para continuar",
"2fa.cancel": "Cancelar",
"2fa.backupWarning": "Salve seus códigos de recuperação. Você precisará deles se perder acesso ao seu app de autenticação.",
"2fa.confirmDisable": "Digite o código do seu autenticador para desativar 2FA",
"2fa.error": "Erro ao configurar 2FA. Tente novamente.",
```

**Step 5: Commit**

```bash
git add app/i18n/messages/en.ts app/i18n/messages/es.ts app/i18n/messages/it.ts app/i18n/messages/pt.ts
git commit -m "feat(i18n): add 2FA translation keys for all languages"
```

---

### Task 2: Create TOTP Verify Modal Component

**Files:**
- Create: `app/components/TotpVerifyModal.tsx`

**Step 1: Create the component**

Create `app/components/TotpVerifyModal.tsx`:

```tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button } from './Button';

interface TotpVerifyModalProps {
  open: boolean;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export function TotpVerifyModal({ open, onVerify, onCancel, loading = false, error = null }: TotpVerifyModalProps) {
  const intl = useIntl();
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-sm mx-4 p-8 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.98), rgba(10, 36, 25, 0.95))',
          border: '1px solid rgba(19, 241, 135, 0.3)',
          boxShadow: '0 0 60px rgba(19, 241, 135, 0.15)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-miner-green rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-miner-green rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-miner-green rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-miner-green rounded-br" />

        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.2), rgba(0, 245, 255, 0.1))',
              border: '1px solid rgba(19, 241, 135, 0.4)',
              boxShadow: '0 0 25px rgba(19, 241, 135, 0.3)',
            }}
          >
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-lg font-display font-bold text-stellar-white tracking-wider mb-2">
            {intl.formatMessage({ id: '2fa.title' })}
          </h2>
          <p className="text-sm font-mono text-cosmic-gray">
            {intl.formatMessage({ id: '2fa.verificationRequired' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-4 rounded-lg font-mono text-2xl text-center text-stellar-white placeholder-cosmic-gray/50 tracking-[0.5em] transition-all duration-300 focus:outline-none"
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(19, 241, 135, 0.3)',
                boxShadow: 'inset 0 0 20px rgba(19, 241, 135, 0.05)',
                letterSpacing: '0.5em',
              }}
              placeholder={intl.formatMessage({ id: '2fa.codePlaceholder' })}
            />
          </div>

          {error && (
            <p className="text-sm font-mono text-red-400 text-center">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onCancel}
              className="font-display tracking-wider"
            >
              {intl.formatMessage({ id: '2fa.cancel' })}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={code.length !== 6}
              className="font-display tracking-wider"
            >
              {intl.formatMessage({ id: '2fa.verifyCode' })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add app/components/TotpVerifyModal.tsx
git commit -m "feat(2fa): create TOTP verification modal component"
```

---

### Task 3: Add 2FA Enrollment Section to Security Center Page

**Files:**
- Modify: `app/(protected)/commander/page.tsx`

**Step 1: Replace the entire commander page**

Replace the contents of `app/(protected)/commander/page.tsx` with the following. The key changes are:
- Import `supabase` from `supabaseClient.ts`
- Import `QRCodeSVG` from `qrcode.react`
- Import `TotpVerifyModal`
- Add state for MFA enrollment flow
- Add `useEffect` to check if MFA is already enrolled
- Add the 2FA enrollment UI section below the existing Security Center form

```tsx
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

  // Check MFA enrollment status on mount
  const checkMfaStatus = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const verifiedTotp = data.totp.find((f) => f.status === 'verified');
      setMfaEnabled(!!verifiedTotp);
      if (verifiedTotp) {
        setFactorId(verifiedTotp.id);
      }
    } catch {
      // If MFA API fails, assume not enabled
      setMfaEnabled(false);
    } finally {
      setMfaLoading(false);
    }
  }, []);

  useEffect(() => {
    checkMfaStatus();
  }, [checkMfaStatus]);

  // Start MFA enrollment
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

  // Verify enrollment with TOTP code
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

  // Disable MFA (unenroll the factor)
  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disableCode.length !== 6) return;
    setVerifyLoading(true);
    try {
      // Verify with a challenge first to confirm identity
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: disableCode,
      });
      if (verifyError) throw verifyError;

      // Now unenroll the factor
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
    // Unenroll the unverified factor
    if (factorId && !mfaEnabled) {
      supabase.auth.mfa.unenroll({ factorId });
    }
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-void-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, #0d1117 0%, #000000 70%)' }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(19, 241, 135, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black tracking-wider">
                <span className="text-white">Security</span>{' '}
                <span className="text-plasma-pink">Center</span>
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-1">
                 {intl.formatMessage({ id: 'pages.profile.commanderBio' })} - Security
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto space-y-8">
          {/* ─── Withdrawal Key Section (existing) ─── */}
          <div className="space-y-6">
            {/* Current Authorization */}
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

            {/* New Authorization */}
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

            {/* Code Strength Indicator */}
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

            {/* Action Buttons */}
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

          {/* ─── 2FA Section ─── */}
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
                <div className="w-6 h-6 border-2 border-miner-green border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : !mfaEnabled && !enrolling ? (
              /* Not enrolled - show enable button */
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
                  className="w-full py-3 font-mono tracking-wider bg-miner-green/20 text-miner-green hover:bg-miner-green/30 border border-miner-green/30 rounded-xl transition-colors font-bold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🛡️</span>
                    <span className="font-bold">{intl.formatMessage({ id: '2fa.enable' })}</span>
                  </div>
                </Button>
              </div>
            ) : enrolling && totpUri ? (
              /* Enrolling - show QR code + verify input */
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
                  <label className="block text-xs font-mono text-miner-green mb-2 tracking-wider uppercase">
                    {intl.formatMessage({ id: '2fa.enterCode' })}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-black border border-white/20 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-miner-green font-mono text-2xl text-center tracking-[0.5em]"
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
                    className={`flex-1 py-3 font-mono tracking-wider rounded-xl transition-colors font-bold ${verifyCode.length === 6 ? 'bg-miner-green text-black hover:bg-miner-green/90' : 'bg-gray-800 text-gray-500'}`}
                  >
                    {intl.formatMessage({ id: '2fa.verifyCode' })}
                  </Button>
                </div>
              </form>
            ) : mfaEnabled && !showDisable ? (
              /* Enrolled - show status + disable button */
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-miner-green/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-miner-green/10 rounded-full flex items-center justify-center border border-miner-green/20">
                      <span className="text-miner-green font-mono text-xs">✓</span>
                    </div>
                    <span className="text-miner-green font-mono text-sm">
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
              /* Disable confirmation - enter code to disable */
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
```

**Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add app/(protected)/commander/page.tsx
git commit -m "feat(2fa): add TOTP enrollment and management to Security Center"
```

---

### Task 4: Add MFA Verification to Login Flow

**Files:**
- Modify: `app/access/page.tsx`

**Step 1: Update the login page to handle MFA challenges**

The key change: after `signInWithPassword`, check if `data.session` is null but no error occurred — this indicates an MFA challenge is required. In that case, show the `TotpVerifyModal`.

Update `app/access/page.tsx`:

1. Add imports at the top (after existing imports):

```typescript
import { TotpVerifyModal } from '../components/TotpVerifyModal';
```

2. Add MFA-related state after the existing state variables (after line 15 `const [terminalText, setTerminalText] = useState('');`):

```typescript
const [showMfaModal, setShowMfaModal] = useState(false);
const [mfaError, setMfaError] = useState<string | null>(null);
const [mfaLoading, setMfaLoading] = useState(false);
```

3. Replace the `handleLogin` function (lines 37-55) with:

```typescript
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
  // When MFA is enrolled, signInWithPassword returns a session but with
  // an AAL1 level. We need to check if the user has MFA factors enrolled.
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const hasVerifiedTotp = factorsData?.totp?.some((f) => f.status === 'verified');

  if (hasVerifiedTotp) {
    // MFA required - show verification modal
    setIsLoading(false);
    setShowMfaModal(true);
  } else {
    // No MFA - proceed normally
    toast.success(intl.formatMessage({ id: 'login.welcomeBack' }));
    router.push('/command-center');
  }
};

const handleMfaVerify = async (code: string) => {
  setMfaLoading(true);
  setMfaError(null);
  try {
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp?.find((f) => f.status === 'verified');
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

    // MFA verified - proceed to dashboard
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
  // Sign out the partial session
  supabase.auth.signOut();
};
```

4. Add the `TotpVerifyModal` component at the end of the JSX, just before the closing `</div>` and `<style jsx>` tags (before line 285):

```tsx
{/* 2FA Verification Modal */}
<TotpVerifyModal
  open={showMfaModal}
  onVerify={handleMfaVerify}
  onCancel={handleMfaCancel}
  loading={mfaLoading}
  error={mfaError}
/>
```

**Step 2: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add app/access/page.tsx
git commit -m "feat(2fa): add MFA challenge verification to login flow"
```

---

### Task 5: Enable MFA in Supabase Dashboard (Configuration)

**No code files — Supabase dashboard configuration.**

**Step 1: Enable MFA in Supabase project**

1. Go to your Supabase Dashboard → **Authentication** → **Configuration** → **Multi-Factor Authentication**
2. Enable **TOTP (Time-based One-Time Password)**
3. Save the configuration

> **Important:** Without this step, the `supabase.auth.mfa.enroll()` calls will fail with a "MFA not enabled" error.

**Step 2: Test the enrollment flow**

1. Log in to the app
2. Go to `/commander` (Security Center)
3. Click "Enable 2FA"
4. Verify a QR code appears
5. Scan with Google Authenticator
6. Enter the 6-digit code
7. Verify success toast appears

**Step 3: Test the login flow with MFA**

1. Log out
2. Go to `/access`
3. Enter email and password
4. Verify the TOTP modal appears
5. Enter the 6-digit code from Google Authenticator
6. Verify redirect to `/command-center`

**Step 4: Test disabling MFA**

1. Go to `/commander`
2. Click "Disable 2FA"
3. Enter a valid code from Google Authenticator
4. Verify 2FA is disabled
5. Log out and log in again
6. Verify no TOTP modal appears

---

### Task 6: Manual Testing Checklist

**Step 1: Full 2FA enrollment flow**

1. Go to `/commander` → 2FA section shows "2FA Disabled" status
2. Click "Enable 2FA" → QR code appears
3. Scan QR with Google Authenticator app
4. Enter valid 6-digit code → Success toast, status changes to "2FA Enabled"
5. Cancel mid-enrollment → Returns to disabled state, unverified factor is cleaned up

**Step 2: Login with 2FA enabled**

1. Log out
2. Go to `/access`, enter credentials → TOTP modal appears
3. Enter wrong code → Error "Invalid verification code"
4. Enter correct code → Redirected to `/command-center`
5. Click "Cancel" on modal → Returns to login form, session is cleared

**Step 3: Disable 2FA**

1. Go to `/commander` → Shows "2FA Enabled"
2. Click "Disable 2FA" → Code input appears
3. Enter wrong code → Error message
4. Enter correct code → Success toast, status changes to "2FA Disabled"
5. Log out and in → No TOTP modal

**Step 4: Test all 4 languages**

1. Switch to es, it, pt
2. Verify all 2FA labels, buttons, toasts render correctly
