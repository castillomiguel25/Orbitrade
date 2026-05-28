"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/Button';
import { PixelIcon } from '@/app/components/PixelIcon';
import { useIntl } from 'react-intl';
import { useWithdrawals } from '@/app/hooks/useWithdrawals';
import WithdrawHistoryTable from '@/app/components/withdrawals/WithdrawHistoryTable';

export default function WithdrawalsPage() {
  const intl = useIntl();

  const {
    withdrawal_key,
    montoRetiro,
    setMontoRetiro,
    claveRetiro,
    setClaveRetiro,
    wallet,
    setWallet,
    redSeleccionada,
    balanceDisponible,
    balanceDisponibleUSDT,
    historialRetiros,
    flujoDisponible,
    seleccionarRed,
    calcularMontoFinal,
    solicitarRetiro,
    limiteMinimo,
    comisionRetiro,
    currentWeekCount,
  } = useWithdrawals();

  // Weekly fee calculation
  const getWeeklyFee = () => {
    return comisionRetiro;
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

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black tracking-wider">
                <span className="text-white">Withdrawals</span>{' '}
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-1">Resource transfer</p>
            </div>
          </div>
        </header>

        {/* Withdrawal Section */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* DOCK OUT */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(220, 149, 230, 0.3)' }}>
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220, 149, 230, 0.15)', border: '1px solid rgba(220, 149, 230, 0.4)' }}>
                  <span className="text-lg">⬆️</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-sm">Withdraw <span className="text-plasma-pink">{intl.formatMessage({ id: 'pages.hangar.dockOut' })}</span></h2>
                  <p className="text-gray-500 font-mono text-[9px] uppercase">{intl.formatMessage({ id: 'pages.deposits.resourceExtraction' })}</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#dc95e6', boxShadow: '0 0 8px #dc95e6' }} />
            </div>

            <div className="p-4 space-y-4">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="text-[8px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.min' })}</div>
                  <div className="font-mono text-xs font-bold text-white">${limiteMinimo}</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="text-[8px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.fee' })}</div>
                  <div className="font-mono text-xs font-bold text-white">{getWeeklyFee()}%</div>
                </div>
                <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div className="text-[8px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.time' })}</div>
                  <div className="font-mono text-xs font-bold text-white">24-48h</div>
                </div>
              </div>

              {/* Embedded Withdrawal Form */}
              <div className="space-y-6 pt-4">
                {/* Energy Extraction Configuration */}
                <div className="space-y-6">
                  {/* Extraction Amount */}
                  <div className="relative">
                    <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-white text-lg">🔋</span>
                          <span className="text-white font-mono text-sm tracking-wider">
                            {intl.formatMessage({ id: 'components.withdrawModal.energyExtractionAmount' })}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-white/10"></div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="number"
                            value={montoRetiro}
                            onChange={(e) => setMontoRetiro(e.target.value)}
                            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-lg tracking-wider"
                            placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterExtractionAmount' })}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-xl border border-white/10 bg-white/5">
                            <div className="text-gray-400 font-mono text-xs tracking-widest mb-1">
                              {intl.formatMessage({ id: 'components.withdrawModal.available' })}
                            </div>
                            <div className="text-white font-mono text-xl font-bold">
                              {(balanceDisponibleUSDT ?? 0).toLocaleString('es-ES')} USDT
                            </div>
                          </div>

                           <div className="text-center p-3 rounded-xl border border-white/10 bg-white/5">
                            <div className="text-gray-400 font-mono text-xs tracking-widest mb-1">
                              FLUJO
                            </div>
                            <div className="text-white font-mono text-xl font-bold">
                              {(flujoDisponible ?? 0).toLocaleString('es-ES')} USDT
                            </div>
                          </div>
                          {montoRetiro && (
                            <div className="text-center p-3 rounded-xl border border-white/10 bg-white/5">
                              <div className="text-gray-400 font-mono text-xs tracking-widest mb-1">
                                {intl.formatMessage({ id: 'components.withdrawModal.youReceive' })}
                              </div>
                              <div className="text-white font-mono text-sm font-bold">{calcularMontoFinal()} USDT</div>
                            </div>
                          )}
                        </div>

                        {montoRetiro && (
                          <div className="rounded-xl p-3 border border-white/10 bg-white/5">
                            <div className="text-gray-400 font-mono text-xs text-center">
                              {intl.formatMessage(
                                { id: 'components.withdrawModal.quantumExtractionFee' },
                                { fee: comisionRetiro, amount: calcularMontoFinal() }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantum Network */}
                  <div className="relative">
                    <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-white text-lg">🌐</span>
                          <span className="text-white font-mono text-sm tracking-wider">
                            {intl.formatMessage({ id: 'components.withdrawModal.network' })}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-white/10"></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {['BEP20', 'Arbitrum One'].map((network) => (
                          <button
                            key={network}
                            onClick={() => seleccionarRed(network)}
                            className={`p-3 rounded-xl border font-mono text-sm transition-all ${
                              redSeleccionada === network
                                ? 'bg-white text-black border-white font-bold'
                                : 'bg-black text-gray-400 border-white/20 hover:border-white/50'
                            }`}
                          >
                            {network}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>


                  {/* Destination Coordinates */}
                  <div className="relative">
                    <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-white text-lg">🗒️</span>
                          <span className="text-white font-mono text-sm tracking-wider">
                            {intl.formatMessage({ id: 'components.withdrawModal.destinationCoordinates' })}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-white/10"></div>
                      </div>

                      <textarea
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider resize-none"
                        placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterDestinationWallet' })}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Security Authorization */}
                  <div className="relative">
                    <div className="relative bg-black rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-white text-lg">🔐</span>
                          <span className="text-white font-mono text-sm tracking-wider">
                            {intl.formatMessage({ id: 'components.withdrawModal.securityAuthorization' })}
                          </span>
                        </div>
                        <div className="w-full h-[1px] bg-white/10"></div>
                      </div>

                      <input
                        type="password"
                        value={claveRetiro}
                        onChange={(e) => setClaveRetiro(e.target.value)}
                        className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                        placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterExtractionKey' })}
                      />
                    </div>
                  </div>

                  {/* Extraction Protocol */}
                  <div className="relative">
                    <div className="relative bg-black rounded-2xl p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                          <PixelIcon name="clock" className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-white font-mono text-sm font-bold">
                            {intl.formatMessage({ id: 'components.withdrawModal.extractionProtocol' })}
                          </div>
                          <div className="text-gray-400 font-mono text-xs">
                            {intl.formatMessage({ id: 'components.withdrawModal.processingTime' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning Flow Penalty */}
                  <div className="relative">
                    <div className="relative bg-red-900/20 rounded-2xl p-4 border border-red-500/30">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">⚠️</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-red-400 font-mono text-xs font-bold leading-relaxed">
                            {intl.formatMessage({ id: 'pages.withdrawals.warning.flowPenalty' })}
                          </div>
                          <div className="text-red-400/80 font-mono text-[10px] font-bold border-t border-red-500/20 pt-2 space-y-1">
                            <div className="text-[9px] opacity-70 uppercase">
                              {intl.formatMessage({ id: 'pages.withdrawals.weeklyFeeStructure' })}
                            </div>
                            <div className="flex justify-between">
                              {intl.formatMessage({ id: 'pages.withdrawals.feeRates' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={solicitarRetiro}
                    disabled={!montoRetiro || !wallet || !claveRetiro}
                    className={`w-full py-3 font-mono tracking-wider ${!montoRetiro || !wallet || !claveRetiro ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-gray-200'} rounded-xl transition-colors font-bold`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">⚡</span>
                      <span className="font-bold">
                        {intl.formatMessage({ id: 'components.withdrawModal.initiateExtraction' })}
                      </span>
                    </div>
                  </Button>
                </div>
              </div>


            </div>
          </div>

          {/* History */}
          {historialRetiros.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
              <div className="p-4 border-b border-white/10">
                <h3 className="font-display font-bold text-sm">
                  <span className="text-white">{intl.formatMessage({ id: 'pages.hangar.extractionTitle' })}</span>{' '}
                  <span className="text-cyber-cyan">{intl.formatMessage({ id: 'pages.hangar.historyTitle' })}</span>
                </h3>
              </div>
              <div className="p-4">
                <WithdrawHistoryTable historialRetiros={historialRetiros} />
              </div>
            </div>
          )}
        </div>
      </div>



    </div>
  );
}
