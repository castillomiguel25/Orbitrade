"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIntl } from 'react-intl';
import { toast } from "sonner";
import { supabase } from '../utils/supabaseClient';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      throw error;
    }
  };

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
      await handleResetPassword();
      toast.success(intl.formatMessage({ id: 'resetPassword.success' }));
      setTimeout(() => {
        router.push("/access");
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || intl.formatMessage({ id: 'resetPassword.error' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-indigo-950">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-8 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-red-300 text-center">
            {intl.formatMessage({ id: 'resetPassword.title' })}
          </h1>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder={intl.formatMessage({ id: 'resetPassword.newPassword' })}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />

            <input
              type="password"
              placeholder={intl.formatMessage({ id: 'resetPassword.confirmPassword' })}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-700 to-red-700 hover:from-blue-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? intl.formatMessage({ id: 'resetPassword.updating' }) : intl.formatMessage({ id: 'resetPassword.submit' })}
          </button>

          <div className="text-center">
            <a href="/access" className="text-sm text-blue-400 hover:underline">
              {intl.formatMessage({ id: 'resetPassword.backToLogin' })}
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}