"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIntl } from 'react-intl';
import { toast } from "sonner";
import { supabase } from '../utils/supabaseClient';
import { Button } from '../components/Button';
import Link from 'next/link';

const AMBER = '#F5A524';
const GRAPHITE = '#0E1116';
const SURFACE = '#161A21';
const MUTED = '#7C8AA0';
const TEXT = '#E6E8EC';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(intl.formatMessage({ id: 'resetPassword.passwordsNotMatch' }));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(intl.formatMessage({ id: 'resetPassword.passwordTooShort' }));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success(intl.formatMessage({ id: 'resetPassword.success' }));
      setTimeout(() => router.push("/access"), 2000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '';
      toast.error(msg || intl.formatMessage({ id: 'resetPassword.error' }));
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30";
  const inputStyle = { background: GRAPHITE, border: '1px solid rgba(255,255,255,0.1)', color: TEXT };

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
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          style={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.06)' }}
          className="p-8 rounded-xl space-y-5"
        >
          <div>
            <h2 style={{ color: TEXT }} className="text-lg font-semibold mb-1">
              {intl.formatMessage({ id: 'resetPassword.title' })}
            </h2>
          </div>

          <div>
            <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
              {intl.formatMessage({ id: 'resetPassword.newPassword' })}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="••••••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label style={{ color: MUTED }} className="block text-xs font-medium tracking-wider uppercase mb-2">
              {intl.formatMessage({ id: 'resetPassword.confirmPassword' })}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              style={inputStyle}
              placeholder="••••••••••••"
              required
              minLength={6}
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
              ? intl.formatMessage({ id: 'resetPassword.updating' })
              : intl.formatMessage({ id: 'resetPassword.submit' })}
          </Button>

          <div className="text-center pt-1">
            <Link
              href="/access"
              style={{ color: MUTED }}
              className="text-sm hover:opacity-80 transition-opacity"
            >
              ← {intl.formatMessage({ id: 'resetPassword.backToLogin' })}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
