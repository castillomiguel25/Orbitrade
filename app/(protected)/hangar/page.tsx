"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';
import Modal from '@/app/components/Modal';
import { useUserStore } from '@/app/store/useUserStore';
import { useDeposits } from '@/app/hooks/useDeposits';
import { useWithdrawals } from '@/app/hooks/useWithdrawals';

// Deposit components
import { DepositStep } from '@/app/components/deposits/DepositStep';

// Withdrawal components
import WithdrawModal from '@/app/components/withdrawals/WithdrawModal';
import WithdrawKeyModal from '@/app/components/withdrawals/WithdrawKeyModal';

export default function Hangar() {
  const { user } = useUserStore();
  const intl = useIntl();

  // Deposits hooks and state
  const { fetchDeposits, validateAndInvest, showManualTxidInput, setShowManualTxidInput } = useDeposits(user);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);
  const [montoDeposito, setMontoDeposito] = useState('');
  const [glowEffect, setGlowEffect] = useState(false);
  const [manualTxid, setManualTxid] = useState("");
  const [manualError, setManualError] = useState("");

  // Withdrawals hooks and state
  const {
    withdrawal_key,
    montoRetiro,
    setMontoRetiro,
    claveRetiro,
    setClaveRetiro,
    wallet,
    setWallet,
    redSeleccionada,
    modalAbierto: modalRetiroAbierto,
    modalConfiguracion,
    claveActual,
    setClaveActual,
    nuevaClave,
    setNuevaClave,
    confirmarClave,
    setConfirmarClave,
    balanceDisponible,
    balanceDisponibleUSDT,
    abrirModal: abrirModalRetiro,
    cerrarModal: cerrarModalRetiro,
    abrirModalConfiguracion,
    cerrarModalConfiguracion,
    seleccionarRed,
    calcularMontoFinal,
    configurarClave,
    solicitarRetiro,
    limiteMinimo,
    comisionRetiro,
    currentWeekCount,
  } = useWithdrawals();

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Deposits functions
  const walletAddress = process.env.NEXT_PUBLIC_WALLET;
  if (!walletAddress) throw new Error('❌ DESTINATION_WALLET no está definida');

  const handleManualTxidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError("");
    if (!/^[a-fA-F0-9]{64}$/.test(manualTxid)) {
      setManualError(intl.formatMessage({ id: 'pages.deposits.manualError' }));
      return;
    }
    validateAndInvest({
      montoDeposito,
      cerrarModal,
      txid: manualTxid,
    });
    setShowManualTxidInput(false);
    setManualTxid("");
  };

  const abrirModal = () => {
    setModalAbierto(true);
    setPasoActual(1);
    setMontoDeposito('');
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const siguientePaso = () => {
    if (pasoActual < 3) {
      const nextPaso = pasoActual + 1;
      setPasoActual(nextPaso);
      if (nextPaso === 3) setShowManualTxidInput(true);
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const copiarWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setGlowEffect(true);
    setTimeout(() => setGlowEffect(false), 1000);
  };

  // Weekly fee calculation
  const getWeeklyFee = () => {
    const fees = [10, 13, 15, 18, 20];
    return fees[Math.min(currentWeekCount, 4)];
  };

  const renderDepositStepContent = () => {
    switch (pasoActual) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                {intl.formatMessage({ id: 'pages.hangar.selectAmount' })}
              </h3>
            </div>
            <input
              type="number"
              min="1"
              step="any"
              value={montoDeposito}
              onChange={e => setMontoDeposito(e.target.value)}
              placeholder="0.00 USDT"
              className="w-full rounded-xl p-4 text-white font-mono text-xl text-center focus:outline-none"
              style={{ background: 'rgba(0, 0, 0, 0.6)', border: '2px solid rgba(19, 241, 135, 0.3)' }}
              required
            />
          </div>
        );
      case 2:
        return <DepositStep walletAddress={walletAddress} copiarWallet={copiarWallet} glowEffect={glowEffect} amount={montoDeposito} />;
      case 3:
        return (
          <form onSubmit={handleManualTxidSubmit} className="space-y-5">
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                {intl.formatMessage({ id: 'pages.deposits.verify' })} Transaction
              </h3>
            </div>
            <input
              value={manualTxid}
              onChange={(e) => setManualTxid(e.target.value.trim())}
              placeholder={intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' })}
              className="w-full rounded-xl p-4 text-plasma-pink font-mono text-sm text-center focus:outline-none"
              style={{ background: 'rgba(0, 0, 0, 0.6)', border: '2px solid rgba(220, 149, 230, 0.3)' }}
            />
            {manualError && <div className="text-center text-red-400 font-mono text-sm">{manualError}</div>}
            <Button variant="plasma" type="submit" className="w-full">
              {intl.formatMessage({ id: 'pages.deposits.validateTxid' })}
            </Button>
          </form>
        );
      default:
        return null;
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

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-black tracking-wider">
                <span className="text-white">{intl.formatMessage({ id: 'pages.hangar.title' })}</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #13f187, #00f5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {intl.formatMessage({ id: 'pages.hangar.titleHighlight' })}
                </span>
              </h1>
              <p className="text-gray-500 font-mono text-xs mt-1">{intl.formatMessage({ id: 'pages.hangar.subtitle' })}</p>
            </div>
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(19, 241, 135, 0.2)' }}
            >
              <div className="text-center">
                <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.available' })}</div>
                <div className="text-lg font-mono font-bold text-miner-green">${balanceDisponibleUSDT.toFixed(2)}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.plasma' })}</div>
                <div className="text-lg font-mono font-bold text-plasma-pink">{balanceDisponible.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout - Both Active */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* DOCK IN */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(19, 241, 135, 0.3)' }}>
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(19, 241, 135, 0.15)', border: '1px solid rgba(19, 241, 135, 0.4)' }}>
                  <span className="text-lg">⬇️</span>
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-sm">{intl.formatMessage({ id: 'pages.hangar.dockIn' })} <span className="text-miner-green">IN</span></h2>
                  <p className="text-gray-500 font-mono text-[9px] uppercase">{intl.formatMessage({ id: 'pages.deposits.fuelLoading' })}</p>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187' }} />
            </div>

            <div className="p-4 space-y-4">
              {/* Network Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(19, 241, 135, 0.08)', border: '1px solid rgba(19, 241, 135, 0.2)' }}>
                  <div className="text-[9px] font-mono text-gray-500 uppercase">Network</div>
                  <div className="font-mono font-bold text-miner-green text-sm">TRC-20</div>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                  <div className="text-[9px] font-mono text-gray-500 uppercase">Currency</div>
                  <div className="font-mono font-bold text-cyber-cyan text-sm">USDT</div>
                </div>
              </div>

              {/* Action */}
              <Button onClick={abrirModal} variant="primary" className="w-full py-3">
                <span className="flex items-center justify-center gap-2">
                  <span>⚡</span>
                  <span>{intl.formatMessage({ id: 'pages.deposits.initiateFuelLoading' })}</span>
                </span>
              </Button>
            </div>
          </div>

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
              {/* Weekly Fee Info */}

              {/* Balance */}
              <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(220, 149, 230, 0.2)' }}>
                <div className="text-[9px] font-mono text-gray-500 uppercase mb-1">{intl.formatMessage({ id: 'pages.withdrawals.available' })}</div>
                <div className="text-2xl font-mono font-bold text-plasma-pink">${balanceDisponibleUSDT.toFixed(2)}</div>
              </div>

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

              {/* Security */}
              <div className="p-3 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(200, 255, 0, 0.2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">{intl.formatMessage({ id: 'pages.hangar.securityPin' })}</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: withdrawal_key ? '#13f187' : '#c8ff00' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: withdrawal_key ? '#13f187' : '#c8ff00' }} />
                    {withdrawal_key ? intl.formatMessage({ id: 'pages.hangar.configured' }) : intl.formatMessage({ id: 'pages.hangar.notSet' })}
                  </span>
                </div>
                <button
                  onClick={abrirModalConfiguracion}
                  className="w-full py-2 rounded-lg font-mono text-[10px] transition-all"
                  style={{ background: 'rgba(200, 255, 0, 0.1)', border: '1px solid rgba(200, 255, 0, 0.3)', color: '#c8ff00' }}
                >
                  {withdrawal_key ? `🔐 ${intl.formatMessage({ id: 'pages.hangar.changePin' })}` : `⚙️ ${intl.formatMessage({ id: 'pages.hangar.setPin' })}`}
                </button>
              </div>

              {/* Withdraw Button */}
              <Button
                onClick={abrirModalRetiro}
                variant="plasma"
                className="w-full py-3"
                disabled={!withdrawal_key || balanceDisponibleUSDT < limiteMinimo}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🚀</span>
                  <span>{intl.formatMessage({ id: 'pages.withdrawals.withdraw' })}</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={modalAbierto} onClose={cerrarModal} title={intl.formatMessage({ id: 'pages.hangar.resourceTransfer' })} maxWidth="lg">
        <div className="p-5">
          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: step <= pasoActual ? 'rgba(19, 241, 135, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: step <= pasoActual ? '2px solid #13f187' : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span className="text-base">{step === 1 ? '💰' : step === 2 ? '📤' : '✅'}</span>
                  </div>
                  {step < 3 && <div className="w-6 h-0.5 mx-1" style={{ background: step < pasoActual ? '#13f187' : 'rgba(255, 255, 255, 0.1)' }} />}
                </div>
              ))}
            </div>
          </div>
          <div className="min-h-[180px]">{renderDepositStepContent()}</div>
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/10">
            <Button onClick={pasoAnterior} disabled={pasoActual === 1} variant="secondary" className="px-4 py-2 text-sm">← {intl.formatMessage({ id: 'pages.hangar.back' })}</Button>
            <span className="font-mono text-[10px] text-gray-500">{pasoActual}/3</span>
            {pasoActual < 3 && (
              <Button onClick={siguientePaso} disabled={pasoActual === 1 && !montoDeposito} variant="primary" className="px-4 py-2 text-sm">{intl.formatMessage({ id: 'pages.hangar.next' })} →</Button>
            )}
            {pasoActual === 3 && <div className="w-16" />}
          </div>
        </div>
      </Modal>

      {/* Withdrawal Modals */}
      <WithdrawModal
        isOpen={modalRetiroAbierto}
        onClose={cerrarModalRetiro}
        montoRetiro={montoRetiro}
        setMontoRetiro={setMontoRetiro}
        wallet={wallet}
        setWallet={setWallet}
        redSeleccionada={redSeleccionada}
        seleccionarRed={seleccionarRed}
        claveRetiro={claveRetiro}
        setClaveRetiro={setClaveRetiro}
        balanceDisponible={balanceDisponible}
        balanceDisponibleUSDT={balanceDisponibleUSDT}
        comisionRetiro={comisionRetiro}
        calcularMontoFinal={calcularMontoFinal}
        solicitarRetiro={solicitarRetiro}
      />

      <WithdrawKeyModal
        isOpen={modalConfiguracion}
        onClose={cerrarModalConfiguracion}
        claveActual={claveActual}
        setClaveActual={setClaveActual}
        nuevaClave={nuevaClave}
        setNuevaClave={setNuevaClave}
        confirmarClave={confirmarClave}
        setConfirmarClave={setConfirmarClave}
        configurarClave={configurarClave}
      />
    </div>
  );}

