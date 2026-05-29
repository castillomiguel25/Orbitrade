"use client";

import React, { useState } from "react";
import { Button } from "../components/Button";
import { toast } from "sonner";
import { useIntl } from 'react-intl';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(intl.formatMessage({ id: 'passwordReset.emailSent' }));
      setTimeout(() => router.push("/access"), 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '';
      toast.error(msg || intl.formatMessage({ id: 'passwordReset.emailError' }));
    } finally {
      setIsLoading(false);
    }
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
            {intl.formatMessage({ id: 'passwordReset.secureRecoveryProtocol' })}
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="p-8 rounded-xl space-y-5"
        >
          <div>
            <h2 style={{ color: TEXT }} className="text-lg font-semibold mb-1">
              {intl.formatMessage({ id: 'passwordReset.title' })}
            </h2>
            <p style={{ color: MUTED }} className="text-sm">
              {intl.formatMessage({ id: 'passwordReset.emailSent' })
                ? intl.formatMessage({ id: 'passwordReset.email' })
                : intl.formatMessage({ id: 'passwordReset.email' })}
            </p>
          </div>

          <div>
            <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
              {intl.formatMessage({ id: 'passwordReset.email' })}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              style={{ background: GRAPHITE, border: '1px solid rgba(255,255,255,0.1)', color: TEXT }}
              placeholder="you@example.com"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            {isLoading
              ? intl.formatMessage({ id: 'passwordReset.sending' })
              : intl.formatMessage({ id: 'passwordReset.submit' })}
          </Button>

          <div className="text-center pt-1">
            <Link
              href="/access"
              style={{ color: MUTED }}
              className="text-sm hover:opacity-80 transition-opacity"
            >
              ← {intl.formatMessage({ id: 'passwordReset.backToLogin' })}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
