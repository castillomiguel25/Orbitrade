"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

export default function ReferidosRedirect() {
  const router = useRouter();
  const intl = useIntl();

  useEffect(() => {
    // Redirect to profile with referrals tab
    router.replace('/commander?tab=referrals');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0728] via-[#1a0b4a] to-[#0f0728]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cyan-300 font-medium">{intl.formatMessage({ id: 'pages.armada.redirecting' })}</p>
      </div>
    </div>
  );
} 