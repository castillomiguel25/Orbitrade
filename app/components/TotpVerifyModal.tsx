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
              className="w-full px-4 py-4 rounded-lg font-mono text-2xl text-center text-stellar-white placeholder-cosmic-gray/50 transition-all duration-300 focus:outline-none"
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
