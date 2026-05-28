"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import { EarningsHistoryTable } from '@/app/components/earnings/EarningsHistoryTable';
import { useEarnings } from '@/app/hooks/useEarnings';
import { useProfileStore } from '@/app/store/useProfileStore';
import { useIntl } from 'react-intl';

export default function PlasmaCore() {
  const { profile } = useProfileStore();
  const {
    tiempoRestante,
    puedeReclamar,
    claimEarnings,
    mostrarFelicitacion,
    gananciaActual,
    tiempo,
    tiempoRestanteHumano,
    historialGanancias,
    totalGanado,
    totalRetirado,
    totalBalance,
  } = useEarnings();
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [vortexIntensity, setVortexIntensity] = useState(0);

  // Calculate progress percentage
  const progressPercent = tiempoRestante > 0 ? ((86400 - tiempoRestante) / 86400) * 100 : 100;

  // Animate vortex intensity
  useEffect(() => {
    const interval = setInterval(() => {
      setVortexIntensity(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      claimEarnings();
      setIsModalOpen(false);
      setIsExtracting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-void-black">
      {/* Deep Space Background */}
      <div className="absolute inset-0">
        {/* Dark gradient base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, #0a0a15 0%, #000000 70%)',
          }}
        />

        {/* Star field */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: '#ffffff',
              opacity: 0.3 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Distant nebula glow */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(220, 149, 230, 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8">
        {/* Minimal Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-black tracking-wider">
                <span className="text-white">{intl.formatMessage({ id: 'pages.plasmaCore.title' })}</span>{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #dc95e6, #00f5ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {intl.formatMessage({ id: 'pages.plasmaCore.titleHighlight' })}
                </span>
              </h1>
              <p className="text-gray-500 font-mono text-sm mt-1">
                {intl.formatMessage({ id: 'pages.plasmaCore.subtitle' })}
              </p>
            </div>

            {/* Status Pill */}
            <div
              className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                background: puedeReclamar ? 'rgba(19, 241, 135, 0.15)' : 'rgba(200, 255, 0, 0.1)',
                border: `1px solid ${puedeReclamar ? '#13f187' : '#c8ff00'}50`,
              }}
            >
              <div
                className={`w-3 h-3 rounded-full ${puedeReclamar ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor: puedeReclamar ? '#13f187' : '#c8ff00',
                  boxShadow: `0 0 15px ${puedeReclamar ? '#13f187' : '#c8ff00'}`,
                }}
              />
              <span
                className="font-mono text-sm font-bold uppercase tracking-wider"
                style={{ color: puedeReclamar ? '#13f187' : '#c8ff00' }}
              >
                {puedeReclamar ? intl.formatMessage({ id: 'pages.plasmaCore.readyToHarvest' }) : intl.formatMessage({ id: 'pages.plasmaCore.accumulating' })}
              </span>
            </div>
          </div>
        </header>

        {/* Main Void Siphon Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Void Visualization - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[16/10]"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 10, 21, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
                border: '1px solid rgba(220, 149, 230, 0.2)',
              }}
            >
              {/* The Void - Central Element */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer energy rings */}
                <div
                  className="absolute w-[90%] h-[90%] rounded-full"
                  style={{
                    border: '1px solid rgba(220, 149, 230, 0.1)',
                    transform: `rotate(${vortexIntensity}deg)`,
                  }}
                />
                <div
                  className="absolute w-[75%] h-[75%] rounded-full"
                  style={{
                    border: '1px solid rgba(0, 245, 255, 0.15)',
                    transform: `rotate(${-vortexIntensity * 1.5}deg)`,
                  }}
                />
                <div
                  className="absolute w-[60%] h-[60%] rounded-full"
                  style={{
                    border: '1px solid rgba(19, 241, 135, 0.2)',
                    transform: `rotate(${vortexIntensity * 2}deg)`,
                  }}
                />

                {/* Spiraling energy particles */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 + vortexIntensity * 2) * Math.PI / 180;
                  const radius = 30 + (i % 3) * 15;
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `calc(50% + ${Math.cos(angle) * radius}%)`,
                        top: `calc(50% + ${Math.sin(angle) * radius}%)`,
                        background: i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#dc95e6' : '#00f5ff',
                        boxShadow: `0 0 15px ${i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#dc95e6' : '#00f5ff'}`,
                        opacity: 0.6 + Math.sin(vortexIntensity * 0.1 + i) * 0.4,
                      }}
                    />
                  );
                })}

                {/* Central Void/Black Hole */}
                <div
                  className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full cursor-pointer transition-all duration-500"
                  onClick={() => puedeReclamar && setIsModalOpen(true)}
                  style={{
                    background: puedeReclamar
                      ? `conic-gradient(from ${vortexIntensity}deg, #13f187, #00f5ff, #dc95e6, #c8ff00, #13f187)`
                      : `conic-gradient(from ${vortexIntensity}deg, #1a1a2e, #16213e, #0f3460, #1a1a2e)`,
                    padding: '4px',
                    boxShadow: puedeReclamar
                      ? '0 0 80px rgba(19, 241, 135, 0.5), 0 0 120px rgba(220, 149, 230, 0.3)'
                      : '0 0 40px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {/* Inner void */}
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #0a0a15 0%, #000000 100%)',
                    }}
                  >
                    {puedeReclamar ? (
                      <div className="text-center">
                        <div className="text-5xl lg:text-6xl mb-2">⚡</div>
                        <div className="font-mono text-miner-green text-lg font-bold">
                          {intl.formatMessage({ id: 'pages.plasmaCore.extract' })}
                        </div>
                        <div className="font-mono text-gray-400 text-xs mt-1">
                          {intl.formatMessage({ id: 'pages.plasmaCore.tapToSiphon' })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="font-mono text-3xl lg:text-4xl font-black text-white mb-1">
                          {tiempo.horas}:{tiempo.minutos}
                        </div>
                        <div className="font-mono text-gray-500 text-sm">
                          :{tiempo.segundos}
                        </div>
                        <div className="font-mono text-gray-600 text-xs mt-2">
                          {intl.formatMessage({ id: 'pages.plasmaCore.riftForming' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accretion disk effect when ready */}
                {puedeReclamar && (
                  <div
                    className="absolute w-72 h-72 lg:w-96 lg:h-96 rounded-full pointer-events-none"
                    style={{
                      background: `conic-gradient(from ${vortexIntensity * 3}deg, transparent, rgba(19, 241, 135, 0.3), transparent, rgba(220, 149, 230, 0.3), transparent)`,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              {/* Progress Arc at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                    {intl.formatMessage({ id: 'pages.plasmaCore.quantumProgress' })}
                  </span>
                  <span className="font-mono text-sm font-bold" style={{ color: puedeReclamar ? '#13f187' : '#c8ff00' }}>
                    {progressPercent.toFixed(1)}%
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPercent}%`,
                      background: puedeReclamar
                        ? 'linear-gradient(90deg, #13f187, #00f5ff, #dc95e6)'
                        : 'linear-gradient(90deg, #c8ff00, #f59e0b)',
                    }}
                  />
                </div>
              </div>

              {/* Corner data displays */}
              <div className="absolute top-4 left-4 font-mono text-xs">
                <div className="text-gray-600">{intl.formatMessage({ id: 'pages.plasmaCore.sector' })}</div>
                <div className="text-plasma-pink font-bold">{intl.formatMessage({ id: 'pages.plasmaCore.moduleX7' })}</div>
              </div>
              <div className="absolute top-4 right-4 font-mono text-xs text-right">
                <div className="text-gray-600">{intl.formatMessage({ id: 'pages.plasmaCore.status' })}</div>
                <div style={{ color: puedeReclamar ? '#13f187' : '#c8ff00' }} className="font-bold">
                  {puedeReclamar ? intl.formatMessage({ id: 'pages.plasmaCore.harvestable' }) : intl.formatMessage({ id: 'pages.plasmaCore.generating' })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Energy Reserves */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 10, 21, 0.9), rgba(0, 0, 0, 0.95))',
                border: '1px solid rgba(19, 241, 135, 0.2)',
              }}
            >
              <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">
                GANANCIA DIARIA
              </h3>
              <div className="font-mono text-3xl font-black text-white">
                ${(profile?.dailyearnings ?? 0).toFixed(2)}
              </div>
            </div>

            {/* Next Harvest Info */}
            {!puedeReclamar && (
              <div
                className="p-4 rounded-xl text-center"
                style={{
                  background: 'rgba(200, 255, 0, 0.05)',
                  border: '1px solid rgba(200, 255, 0, 0.2)',
                }}
              >
                <div className="font-mono text-xs text-gray-500 uppercase mb-1">{intl.formatMessage({ id: 'pages.plasmaCore.nextHarvestIn' })}</div>
                <div className="font-mono text-xl font-bold text-bio-yellow">
                  {tiempoRestante > 0 ? `${tiempo.horas}:${tiempo.minutos}:${tiempo.segundos}` : tiempoRestanteHumano}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extraction History */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 21, 0.9), rgba(0, 0, 0, 0.95))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="font-display font-bold text-lg">
              <span className="text-white">{intl.formatMessage({ id: 'pages.plasmaCore.harvestHistory' })}</span>{' '}
              <span className="text-plasma-pink">{intl.formatMessage({ id: 'pages.plasmaCore.history' })}</span>
            </h3>
          </div>
          <div className="p-6">
            <EarningsHistoryTable historialGanancias={historialGanancias} />
          </div>
        </div>
      </div>

      {/* Extraction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isExtracting && setIsModalOpen(false)}
        title={intl.formatMessage({ id: 'pages.plasmaCore.voidExtraction' })}
        maxWidth="sm"
      >
        <div className="p-6 text-center">
          {isExtracting ? (
            <div className="py-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #13f187, #00f5ff, #dc95e6, #c8ff00, #13f187)',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ background: '#000' }}
                >
                  <span className="text-4xl">🌀</span>
                </div>
              </div>
              <div className="font-mono text-miner-green text-lg">
                {intl.formatMessage({ id: 'pages.plasmaCore.siphoning' })}
              </div>
            </div>
          ) : mostrarFelicitacion ? (
            <div className="py-8">
              <div className="text-6xl mb-4">⚡</div>
              <div className="text-2xl font-display font-bold text-miner-green mb-2">
                {intl.formatMessage({ id: 'pages.plasmaCore.extractionComplete' })}
              </div>
              <div className="text-3xl font-mono font-black text-white">
                +{gananciaActual} USDT
              </div>
              <div className="text-gray-500 font-mono text-sm mt-2">
                {intl.formatMessage({ id: 'pages.plasmaCore.energyTransferred' })}
              </div>
            </div>
          ) : (
            <>
              <div className="text-6xl mb-6">🕳️</div>
              <h3 className="text-xl font-display font-bold mb-2">
                <span className="text-white">{intl.formatMessage({ id: 'pages.plasmaCore.voidExtraction' }).split(' ')[0]}</span>{' '}
                <span className="text-plasma-pink">{intl.formatMessage({ id: 'pages.plasmaCore.voidExtraction' }).split(' ')[1]}</span>
              </h3>
              <p className="text-gray-400 font-mono text-sm mb-6">
                {intl.formatMessage({ id: 'pages.plasmaCore.riftCharged' })}
              </p>

              <Button
                variant="primary"
                className="w-full py-4 text-lg"
                onClick={handleExtract}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⚡</span>
                  <span>{intl.formatMessage({ id: 'pages.plasmaCore.extractNow' })}</span>
                </span>
              </Button>

              <p className="text-gray-600 font-mono text-xs mt-4">
                {intl.formatMessage({ id: 'pages.plasmaCore.energyAdded' })}
              </p>
            </>
          )}
        </div>
      </Modal>

      {/* Success Overlay */}
      {mostrarFelicitacion && !isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center animate-pulse">
            <div className="text-8xl mb-4">⚡</div>
            <div className="text-3xl font-display font-black text-miner-green mb-2">
              {intl.formatMessage({ id: 'pages.plasmaCore.voidHarvested' })}
            </div>
            <div className="text-5xl font-mono font-black text-white">
              +{gananciaActual} USDT
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
