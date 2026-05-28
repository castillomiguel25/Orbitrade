"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';
import Modal from '@/app/components/Modal';
import { useUserStore } from '@/app/store/useUserStore';
import { useDeposits } from '@/app/hooks/useDeposits';
import { useWithdrawals } from '@/app/hooks/useWithdrawals';

export default function DepositsPage() {
  const { user } = useUserStore();
  const intl = useIntl();

  const { fetchDeposits, validateAndInvest } = useDeposits(user);
  // Usamos useWithdrawals solo para mostrar el saldo en el encabezado
  const { balanceDisponible, balanceDisponibleUSDT } = useWithdrawals();

  const [montoDeposito, setMontoDeposito] = useState('');
  const [glowEffect, setGlowEffect] = useState(false);
  const [manualTxid, setManualTxid] = useState("");
  const [manualError, setManualError] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  const walletAddress = process.env.NEXT_PUBLIC_WALLET;
  if (!walletAddress) throw new Error('❌ DESTINATION_WALLET no está definida');

  const handleManualTxidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError("");
    
    if (!montoDeposito || Number(montoDeposito) <= 0) {
      setManualError(intl.formatMessage({ id: 'pages.deposits.invalidAmount' }));
      return;
    }

    if (!/^[a-fA-F0-9]{64}$/.test(manualTxid)) {
      setManualError(intl.formatMessage({ id: 'pages.deposits.manualError' }));
      return;
    }

    validateAndInvest({
      montoDeposito,
      cerrarModal: () => {}, // No modal to close
      txid: manualTxid,
    });
    setManualTxid("");
    setMontoDeposito("");
  };

  const copiarWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setGlowEffect(true);
    setTimeout(() => setGlowEffect(false), 1000);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black tracking-wider text-white">
                DEPOSITS
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-1">{intl.formatMessage({ id: 'pages.deposits.resourceTransfer' })}</p>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 bg-white/5"
            >
              <div className="text-center">
                <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.deposits.available' })}</div>
                <div className="text-lg font-mono font-bold text-white">${balanceDisponibleUSDT.toFixed(2)}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.deposits.plasma' })}</div>
                <div className="text-lg font-mono font-bold text-white">{balanceDisponible.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Deposit Section */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                  <span className="text-lg grayscale">⬇️</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-sm">Deposits</h2>
                  <p className="text-gray-500 font-mono text-[9px] uppercase">{intl.formatMessage({ id: 'pages.deposits.fuelLoading' })}</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            </div>

            <div className="p-4 space-y-4">
              {/* Network Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl text-center border border-white/10 bg-white/5">
                  <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.deposits.networkBox' })}</div>
                  <div className="font-mono font-bold text-white text-sm">TRC-20</div>
                </div>
                <div className="p-3 rounded-xl text-center border border-white/10 bg-white/5">
                  <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.deposits.currency' })}</div>
                  <div className="font-mono font-bold text-white text-sm">USDT</div>
                </div>
              </div>

              {/* Action */}
              <form onSubmit={handleManualTxidSubmit} className="space-y-6 pt-2">
                
                {/* 1. Amount Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">1</div>
                    <label className="text-sm font-mono text-gray-400 font-bold uppercase">
                      {intl.formatMessage({ id: 'pages.deposits.select' })} {intl.formatMessage({ id: 'pages.deposits.amount' })}
                    </label>
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={montoDeposito}
                    onChange={e => setMontoDeposito(e.target.value)}
                    placeholder="0.00 USDT"
                    className="w-full rounded-xl p-4 text-white font-mono text-xl text-center focus:outline-none transition-all bg-black border border-white/20 focus:border-white"
                    required
                  />
                </div>

                {/* 2. Wallet Copy */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">2</div>
                    <label className="text-sm font-mono text-gray-400 font-bold uppercase">
                      {intl.formatMessage({ id: 'components.depositStep.walletAddress' })}
                    </label>
                  </div>
                  
                  <div className={`relative transition-all duration-300 ${glowEffect ? 'scale-[1.02]' : ''}`}>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-black border border-white/20">
                       <div className="flex-1 font-mono text-xs text-white truncate select-all">
                         {walletAddress}
                       </div>
                       <Button
                        type="button"
                        onClick={copiarWallet}
                        className="px-3 py-1.5 text-xs whitespace-nowrap bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {glowEffect ? intl.formatMessage({ id: 'pages.deposits.copied' }) : intl.formatMessage({ id: 'pages.deposits.copy' })}
                      </Button>
                    </div>
                  </div>
                   <div className="text-[10px] text-center text-gray-500 font-mono">
                     {intl.formatMessage({ id: 'pages.deposits.networkLabel' })} <span className="text-white font-bold">TRC-20 (USDT)</span>
                   </div>
                </div>

                {/* 3. Transaction Verification */}
                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">3</div>
                    <label className="text-sm font-mono text-gray-400 font-bold uppercase">
                      {intl.formatMessage({ id: 'pages.deposits.verify' })} {intl.formatMessage({ id: 'pages.deposits.transaction' })}
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      value={manualTxid}
                      onChange={(e) => setManualTxid(e.target.value.trim())}
                      placeholder={intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' })}
                      className="w-full rounded-xl p-4 text-white font-mono text-sm text-center focus:outline-none focus:ring-1 focus:ring-white placeholder:text-gray-600 bg-black border border-white/20"
                      required
                    />
                  </div>
                </div>

                {/* Error & Submit */}
                {manualError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                    <span className="text-red-400 font-mono text-xs">{manualError}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg font-bold bg-white text-black hover:bg-gray-200 transition-all rounded-xl shadow-lg shadow-white/10"
                  disabled={!montoDeposito || !manualTxid}
                >
                  {intl.formatMessage({ id: 'pages.deposits.validateTxid' })}
                </Button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}