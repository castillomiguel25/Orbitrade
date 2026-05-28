"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';
import '@/app/styles/dashboard.css';
import Modal from '@/app/components/Modal';
import { useUserStore } from '@/app/store/useUserStore';
import { useWithdrawals } from '@/app/hooks/useWithdrawals';
import { useSearchParams, useRouter } from 'next/navigation';

// Components
import WithdrawBanner from '@/app/components/withdrawals/WithdrawBanner';
import WithdrawHistoryTable from '@/app/components/withdrawals/WithdrawHistoryTable';
import WithdrawModal from '@/app/components/withdrawals/WithdrawModal';
import WithdrawKeyModal from '@/app/components/withdrawals/WithdrawKeyModal';

export default function RetirosRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cargo bay with withdrawals tab
    router.replace('/hangar?tab=withdrawals');
  }, [router]);

  // Loading screen while redirecting
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-red-900">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900/20 to-red-900"></div>
        
        {/* Quantum Particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(249, 115, 22, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Redirect Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative w-24 h-24 bg-red-800/50 rounded-full flex items-center justify-center border-2 border-orange-500/50">
              <span className="text-4xl animate-spin">📦</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 font-mono tracking-wider mb-4">
            REDIRECTING TO CARGO BAY
          </h1>
          
          <div className="text-orange-300 font-mono text-sm mb-6">
            Accessing Resource Extraction Station...
          </div>
          
          {/* Loading Bar */}
          <div className="w-64 mx-auto bg-red-800/50 rounded-full p-1 border border-orange-500/30">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full animate-pulse"></div>
          </div>
          
          <div className="mt-4 text-orange-200 font-mono text-xs">
            Initializing extraction protocols...
          </div>
        </div>
      </div>
    </main>
  );
} 