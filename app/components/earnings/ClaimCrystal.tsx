import React from 'react';
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import Modal from '@/app/components/Modal';
import { useState } from 'react';

interface ClaimCrystalProps {
  puedeReclamar: boolean;
  animacionActiva: boolean;
  claimEarnings: () => void;
  rotacionCristal: number;
  acumuladorClicks: number;
  mostrarFelicitacion: boolean;
  gananciaActual: string;
  tiempo: { horas: string; minutos: string; segundos: string };
  tiempoRestante: number;
  tiempoRestanteHumano: string;
  planActivo: { nombre: string; rendimiento: string; imagen: string };
}

export const ClaimCrystal: React.FC<ClaimCrystalProps> = ({
  puedeReclamar,
  animacionActiva,
  claimEarnings,
  rotacionCristal,
  acumuladorClicks,
  mostrarFelicitacion,
  gananciaActual,
  tiempo,
  tiempoRestante,
  tiempoRestanteHumano,
  planActivo,
}) => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatFlying, setIsCatFlying] = useState(false);

  return (
    <div className="relative">
      {/* Main Reactor Console */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: '1px solid rgba(230, 232, 236, 0.3)',
          boxShadow: '0 0 40px rgba(230, 232, 236, 0.15)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-plasma-pink rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-plasma-pink rounded-br" />

        {/* Console Header */}
        <div
          className="relative p-6 border-b"
          style={{
            background: 'linear-gradient(135deg, rgba(230, 232, 236, 0.1), rgba(245, 165, 36, 0.05))',
            borderColor: 'rgba(230, 232, 236, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 232, 236, 0.3), rgba(245, 165, 36, 0.2))',
                  border: '1px solid rgba(230, 232, 236, 0.4)',
                  boxShadow: '0 0 20px rgba(230, 232, 236, 0.3)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #E6E8EC, #F5A524)',
                    boxShadow: '0 0 15px rgba(230, 232, 236, 0.6)',
                  }}
                />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold tracking-wider">
                  <span
                    className="italic"
                    style={{
                      background: 'linear-gradient(135deg, #E6E8EC, #F5A524)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Plasma
                  </span>{' '}
                  <span className="text-[#E6E8EC] font-light">Reactor</span>
                </h2>
                <p className="text-[#7C8AA0] font-mono text-sm">
                  {intl.formatMessage({ id: 'components.claimCrystal.molecularEnergyConversion' })}
                </p>
              </div>
            </div>

            {/* Reactor Status */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: puedeReclamar ? '#F5A524' : '#f59e0b',
                    boxShadow: `0 0 8px ${puedeReclamar ? '#F5A524' : '#f59e0b'}`,
                  }}
                />
                <span
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: puedeReclamar ? '#F5A524' : '#f59e0b' }}
                >
                  {puedeReclamar
                    ? intl.formatMessage({ id: 'components.claimCrystal.ready' })
                    : intl.formatMessage({ id: 'components.claimCrystal.charging' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#7C8AA0', boxShadow: '0 0 8px #7C8AA0' }}
                />
                <span className="text-[#7C8AA0] font-mono text-xs uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.claimCrystal.stable' })}
                </span>
              </div>
            </div>
          </div>

          {/* Scanning Bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #E6E8EC, transparent)',
              animation: 'scanHorizontal 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Main Reactor Chamber */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Quantum Reactor Core */}
            <div className="relative flex-shrink-0">
              <div className="w-56 h-56 lg:w-64 lg:h-64 relative">
                {/* Outer Reactor Rings */}
                <div
                  className="mobile-anim absolute inset-0 rounded-full animate-spin"
                  style={{
                    border: '2px solid rgba(230, 232, 236, 0.3)',
                    animationDuration: '20s',
                  }}
                />
                <div
                  className="mobile-anim absolute inset-4 rounded-full animate-spin"
                  style={{
                    border: '2px solid rgba(245, 165, 36, 0.3)',
                    animationDuration: '15s',
                    animationDirection: 'reverse',
                  }}
                />
                <div
                  className="mobile-anim absolute inset-8 rounded-full animate-spin"
                  style={{
                    border: '2px solid rgba(124, 138, 160, 0.3)',
                    animationDuration: '10s',
                  }}
                />

                {/* Energy Particles */}
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="mobile-anim absolute w-2 h-2 rounded-full"
                    style={{
                      top: `${50 + 35 * Math.sin((i * 45 + rotacionCristal) * Math.PI / 180)}%`,
                      left: `${50 + 35 * Math.cos((i * 45 + rotacionCristal) * Math.PI / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                      background: i % 3 === 0 ? '#F5A524' : i % 3 === 1 ? '#E6E8EC' : '#7C8AA0',
                      boxShadow: `0 0 10px ${i % 3 === 0 ? '#F5A524' : i % 3 === 1 ? '#E6E8EC' : '#7C8AA0'}`,
                      animation: `quantumPulse ${2 + i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}

                {/* Central Reactor Core */}
                <div
                  className="absolute inset-12 rounded-full cursor-pointer transition-all duration-300 overflow-hidden"
                  onClick={() => { if (puedeReclamar) setIsModalOpen(true); }}
                  style={{
                    background: puedeReclamar
                      ? 'radial-gradient(circle, rgba(245, 165, 36, 0.8) 0%, rgba(230, 232, 236, 0.6) 50%, rgba(124, 138, 160, 0.4) 100%)'
                      : 'radial-gradient(circle, rgba(245, 165, 36, 0.3) 0%, rgba(230, 232, 236, 0.2) 50%, rgba(124, 138, 160, 0.1) 100%)',
                    transform: `rotate(${rotacionCristal}deg) scale(${puedeReclamar ? 1.05 : 0.95})`,
                    boxShadow: puedeReclamar
                      ? '0 0 50px 15px rgba(245, 165, 36, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)'
                      : '0 0 25px 8px rgba(245, 165, 36, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)',
                    filter: puedeReclamar ? 'brightness(1.2)' : 'brightness(0.7)',
                  }}
                >
                  {/* Reactor Core Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {puedeReclamar ? (
                        <div className="space-y-2">
                          <div className="font-mono text-base font-bold text-white">
                            {acumuladorClicks > 0 ? (
                              <div className="space-y-1">
                                <div className="text-xs">{intl.formatMessage({ id: 'components.claimCrystal.charging' })}</div>
                                <div className="text-amber-400">{acumuladorClicks}/10</div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="text-xs">{intl.formatMessage({ id: 'components.claimCrystal.harvest' })}</div>
                                <div className="text-amber-400">{intl.formatMessage({ id: 'components.claimCrystal.ready' })}</div>
                              </div>
                            )}
                          </div>
                          <div
                            className="w-10 h-1 rounded-full mx-auto animate-pulse"
                            style={{ background: 'linear-gradient(90deg, #F5A524, #E6E8EC, #7C8AA0)' }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-white/70 font-mono text-xs">
                            {intl.formatMessage({ id: 'components.claimCrystal.recharging' })}
                          </div>
                          <div className="text-amber-400 font-mono text-lg font-bold">
                            {tiempo.horas}:{tiempo.minutos}
                          </div>
                          <div className="text-amber-400/70 font-mono text-xs">
                            {tiempo.segundos}s
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Energy Waves */}
                  {puedeReclamar && (
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full border-2 border-amber-500/50 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-plasma-pink/50 animate-ping" style={{ animationDelay: '0.5s' }} />
                      <div className="absolute inset-4 rounded-full border-2 border-cyber-cyan/50 animate-ping" style={{ animationDelay: '1s' }} />
                    </div>
                  )}
                </div>

                {/* Modal for Claiming Energy */}
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => { setIsModalOpen(false); setIsCatFlying(false); }}
                  title={intl.formatMessage({ id: 'components.claimCrystal.quantumEnergyHarvest' })}
                  maxWidth="md"
                >
                  <div className="flex flex-col items-center justify-center p-6 relative">
                    {/* Floating Cat Image */}
                    <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                      <img
                        src="/gato.jpeg"
                        alt="Floating Cat"
                        className={`mobile-anim absolute left-1/2 top-1/2 w-40 h-40 object-contain rounded-full animate-floating-gato ${isCatFlying ? 'cat-flyaway' : ''}`}
                        style={{
                          boxShadow: '0 0 40px rgba(245, 165, 36, 0.4)',
                          border: '3px solid rgba(245, 165, 36, 0.5)',
                        }}
                      />
                    </div>

                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-display font-bold mb-2">
                        <span
                          className="italic"
                          style={{
                            background: 'linear-gradient(135deg, #F5A524, #E6E8EC)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          Harvest
                        </span>{' '}
                        <span className="text-[#E6E8EC] font-light">Energy</span>
                      </h3>
                      <p className="text-[#7C8AA0] font-mono text-sm">
                        {intl.formatMessage({ id: 'components.claimCrystal.initiateQuantumEnergy' })}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      className="w-full py-3 font-mono text-lg tracking-wider mb-3"
                      onClick={() => {
                        setIsCatFlying(true);
                        setTimeout(() => {
                          claimEarnings();
                          setIsModalOpen(false);
                          setIsCatFlying(false);
                        }, 700);
                      }}
                      disabled={isCatFlying}
                    >
                      {intl.formatMessage({ id: 'components.claimCrystal.harvestNow' })}
                    </Button>

                    <p className="text-[#7C8AA0] font-mono text-xs text-center">
                      {intl.formatMessage({ id: 'components.claimCrystal.convertAccumulatedEnergy' })}
                    </p>
                  </div>
                </Modal>

                {/* Success Animation */}
                {mostrarFelicitacion && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="text-center animate-pulse">
                      <div
                        className="text-2xl font-display font-bold mb-2"
                        style={{
                          background: 'linear-gradient(135deg, #F5A524, #F5A524)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {intl.formatMessage({ id: 'components.claimCrystal.energyHarvested' })}
                      </div>
                      <div className="text-xl font-bold text-amber-400 font-mono">
                        +{gananciaActual} USDT
                      </div>
                      <div className="text-[#7C8AA0] font-mono text-sm mt-2">
                        {intl.formatMessage({ id: 'components.claimCrystal.molecularConversionSuccessful' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel */}
            <div className="flex-1 space-y-4 w-full">
              {/* Reactor Status Display */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${puedeReclamar ? 'rgba(245, 165, 36, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                }}
              >
                <div className="text-center mb-3">
                  <h3 className="text-lg font-display font-bold">
                    {puedeReclamar ? (
                      <>
                        <span className="text-amber-400 italic">Energy</span>{' '}
                        <span className="text-[#E6E8EC] font-light">Ready</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-400 italic">Reactor</span>{' '}
                        <span className="text-[#E6E8EC] font-light">Recharging</span>
                      </>
                    )}
                  </h3>

                  {!puedeReclamar && (
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-amber-400 font-mono mb-2">
                        {tiempoRestante > 0
                          ? `${tiempo.horas}:${tiempo.minutos}:${tiempo.segundos}`
                          : tiempoRestanteHumano}
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(245, 158, 11, 0.2)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${((86400 - tiempoRestante) / 86400) * 100}%`,
                            background: 'linear-gradient(90deg, #f59e0b, #F5A524)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#7C8AA0] text-center font-mono">
                  {puedeReclamar
                    ? intl.formatMessage({ id: 'components.claimCrystal.quantumEnergyConversionReady' })
                    : intl.formatMessage({ id: 'components.claimCrystal.molecularStabilizationInProgress' })}
                </p>
              </div>

              {/* Extraction Controls */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(245, 165, 36, 0.3)',
                }}
              >
                <h4 className="text-base font-display font-bold mb-3">
                  <span className="text-amber-400 italic">Extraction</span>{' '}
                  <span className="text-[#E6E8EC] font-light">Controls</span>
                </h4>

                <Link href="/withdrawals" className="block">
                  <Button
                    variant="primary"
                    className="w-full py-3 font-mono tracking-wider"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🔓</span>
                      <span>{intl.formatMessage({ id: 'components.claimCrystal.extractHarvestedEnergy' })}</span>
                    </div>
                  </Button>
                </Link>

                <p className="text-[#7C8AA0] font-mono text-xs text-center mt-2">
                  {intl.formatMessage({ id: 'components.claimCrystal.convertQuantumEnergy' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes quantumPulse {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-30%, -20%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -30%) scale(1.2);
          }
        }
        @keyframes scanHorizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes floating-gato {
          0% {
            transform: translate(-50%, -60%) scale(1) rotate(-5deg);
            filter: drop-shadow(0 8px 32px rgba(245, 165, 36, 0.5));
          }
          50% {
            transform: translate(-50%, -40%) scale(1.05) rotate(5deg);
            filter: drop-shadow(0 16px 48px rgba(230, 232, 236, 0.5));
          }
          100% {
            transform: translate(-50%, -60%) scale(1) rotate(-5deg);
            filter: drop-shadow(0 8px 32px rgba(245, 165, 36, 0.5));
          }
        }
        .animate-floating-gato {
          animation: floating-gato 4s ease-in-out infinite;
        }
        @keyframes catFlyaway {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(-5deg);
          }
          100% {
            opacity: 0;
            transform: translate(150%, -200%) scale(0.2) rotate(-45deg);
          }
        }
        .cat-flyaway {
          animation: catFlyaway 0.7s cubic-bezier(0.4, 0.8, 0.7, 1) forwards !important;
        }
      `}</style>
    </div>
  );
};
