"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { PixelIcon } from './PixelIcon';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

interface EnergyRedemptionModalProps {
  onClose: () => void;
  userTickets: number;
  onRedemption: (tickets: number) => void;
}

export function RedeemTicketsModal({ onClose, userTickets, onRedemption }: EnergyRedemptionModalProps) {
  const intl = useIntl();
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);
  const [scanEffect, setScanEffect] = useState(false);
  const [energyPulsing, setEnergyPulsing] = useState(false);

  const energyPackages = [
    { tickets: 1, reward: 1, title: "MICRO CORE", color: "blue", icon: "⚡" },
    { tickets: 5, reward: 6, title: "NANO CORE", color: "cyan", icon: "🔋" },
    { tickets: 10, reward: 15, title: "QUANTUM CORE", color: "purple", icon: "🌟" },
    { tickets: 25, reward: 40, title: "STELLAR CORE", color: "orange", icon: "☄️" },
    { tickets: 50, reward: 100, title: "GALACTIC CORE", color: "green", icon: "🌌" }
  ];

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setAnimateIn(true), 50);
    
    // Efecto de brillo intermitente
    const interval = setInterval(() => {
      setGlowEffect(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Efecto de escaneo periódico
    const scanInterval = setInterval(() => {
      setScanEffect(true);
      setTimeout(() => setScanEffect(false), 1500);
    }, 4000);
    
    return () => clearInterval(scanInterval);
  }, []);

  useEffect(() => {
    // Efecto de pulsación energética
    const pulseInterval = setInterval(() => {
      setEnergyPulsing(prev => !prev);
    }, 1500);
    
    return () => clearInterval(pulseInterval);
  }, []);

  const handleRedeem = async () => {
    if (selectedTickets > userTickets) {
      toast.error(intl.formatMessage({ id: 'components.redeemTicketsModal.notEnoughTickets' }));
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickets: selectedTickets,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(intl.formatMessage({ id: 'components.redeemTicketsModal.redeemSuccess' }));
        onRedemption(selectedTickets);
        onClose();
      } else {
        throw new Error(data.error || intl.formatMessage({ id: 'components.redeemTicketsModal.redeemError' }));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : intl.formatMessage({ id: 'components.redeemTicketsModal.redeemError' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPackage = energyPackages.find(pkg => pkg.tickets === selectedTickets);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
      style={{
        backdropFilter: "blur(15px)"
      }}
    >
      <div 
        className={`relative bg-black/70 backdrop-blur-xl overflow-hidden w-full max-w-2xl transform transition-all duration-700 border-2 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{
          clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          background: "linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(30, 27, 75, 0.95), rgba(20, 17, 55, 0.95))",
          boxShadow: glowEffect ? 
            "0 0 80px rgba(124, 58, 237, 0.8), 0 0 160px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.1)" : 
            "0 0 50px rgba(124, 58, 237, 0.6), 0 0 100px rgba(59, 130, 246, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(124, 58, 237, 0.5)"
        }}
      >
        {/* Esquinas tecnológicas */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80"></div>

        {/* Líneas de energía */}
        <div 
          className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          style={{
            boxShadow: "0 0 20px 4px rgba(124, 58, 237, 0.6)",
            opacity: energyPulsing ? 1 : 0.8
          }}
        />
        <div 
          className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            boxShadow: "0 0 20px 4px rgba(6, 182, 212, 0.6)",
            opacity: energyPulsing ? 1 : 0.8
          }}
        />

        {/* Efecto de escaneo */}
        {scanEffect && (
          <div 
            className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              animation: 'matrix-scan 1.5s ease-in-out',
              boxShadow: "0 0 30px 8px rgba(6, 182, 212, 0.8)"
            }}
          />
        )}

        {/* Header */}
        <div 
          className="p-6 flex items-center justify-between bg-black/50 border-b border-purple-500/30 relative"
          style={{
            background: "linear-gradient(135deg, rgba(15, 15, 35, 0.9), rgba(30, 27, 75, 0.9))"
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div>
              <h2 
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 font-exo2 tracking-wider"
                style={{ textShadow: "0 0 15px rgba(124, 58, 237, 0.6)" }}
              >
                ⚡ ENERGY CORE STATION
              </h2>
              <p className="text-xs text-gray-400 font-mono tracking-wider mt-1">QUANTUM ENERGY EXCHANGE</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 transition-all duration-300 group"
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)"
            }}
          >
            <PixelIcon name="close" className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </button>
        </div>

        <div className="p-8 relative">
          {/* Grid holográfico de fondo */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px),
                linear-gradient(180deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />

          {/* Panel de tickets disponibles */}
          <div 
            className="mb-8 p-6 rounded-lg border relative overflow-hidden"
            style={{
              clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
              borderColor: "rgba(16, 185, 129, 0.4)"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-green-400/60 relative"
                  style={{
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
                    boxShadow: energyPulsing ? "0 0 30px rgba(16, 185, 129, 0.8)" : "0 0 20px rgba(16, 185, 129, 0.6)"
                  }}
                >
                  <span className="text-2xl">🎫</span>
                  {energyPulsing && (
                    <div className="absolute inset-0 rounded-full border-2 border-green-400/40 animate-ping"></div>
                  )}
                </div>
                <div>
                  <h3 
                    className="text-lg font-bold text-green-400 font-exo2 tracking-wider"
                    style={{ textShadow: "0 0 10px rgba(16, 185, 129, 0.6)" }}
                  >
                    {intl.formatMessage({ id: 'components.redeemTicketsModal.availableTickets' })}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono">STORED ENERGY UNITS</p>
                </div>
              </div>
              <div className="text-right">
                <p 
                  className="text-3xl font-bold text-green-400 font-exo2"
                  style={{ textShadow: "0 0 15px rgba(16, 185, 129, 0.8)" }}
                >
                  {userTickets}
                </p>
                <p className="text-xs text-gray-400 font-mono">TICKETS</p>
              </div>
            </div>
          </div>

          {/* Selector de paquetes de energía */}
          <div className="mb-8">
            <h3 
              className="text-lg font-bold text-purple-300 mb-6 font-exo2 tracking-wider text-center"
              style={{ textShadow: "0 0 10px rgba(124, 58, 237, 0.6)" }}
            >
              ⚡ SELECT ENERGY CORE PACKAGE
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energyPackages.map((pkg) => {
                const isSelected = selectedTickets === pkg.tickets;
                const isAvailable = userTickets >= pkg.tickets;
                
                return (
                  <button
                    key={pkg.tickets}
                    onClick={() => isAvailable && setSelectedTickets(pkg.tickets)}
                    disabled={!isAvailable}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 relative overflow-hidden ${
                      isSelected 
                        ? 'border-red-400 bg-red-900/30' 
                        : isAvailable 
                          ? 'border-gray-600 bg-gray-900/20 hover:border-red-500/50 hover:bg-red-900/10' 
                          : 'border-gray-800 bg-gray-900/10 opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
                      boxShadow: isSelected ? "0 0 20px rgba(124, 58, 237, 0.6)" : "none"
                    }}
                  >
                    {/* Esquinas de selección */}
                    {isSelected && (
                      <>
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80"></div>
                      </>
                    )}

                    <div className="text-center">
                      <div className="text-2xl mb-2">{pkg.icon}</div>
                      <p 
                        className="text-sm font-bold text-white font-exo2 tracking-wider mb-1"
                        style={{ textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" }}
                      >
                        {pkg.title}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mb-2">
                        {pkg.tickets} TICKETS → {pkg.reward} USDT
                      </p>
                      <div className="text-xs text-red-400 font-mono">
                        {((pkg.reward / pkg.tickets) * 100 - 100).toFixed(0)}% BONUS
                      </div>
                    </div>

                    {/* Efecto de selección */}
                    {isSelected && (
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                        style={{
                          animation: 'pulse 2s ease-in-out infinite'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel de confirmación */}
          {selectedPackage && (
            <div 
              className="mb-8 p-6 rounded-lg border relative overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(79, 70, 229, 0.1))",
                borderColor: "rgba(124, 58, 237, 0.4)"
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 
                  className="text-lg font-bold text-red-300 font-exo2 tracking-wider"
                  style={{ textShadow: "0 0 10px rgba(124, 58, 237, 0.6)" }}
                >
                  🔮 EXCHANGE PREVIEW
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400 font-mono">PROCESSING</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-sm text-gray-400 font-mono mb-1">EXCHANGE</p>
                  <p 
                    className="text-2xl font-bold text-red-400 font-exo2"
                    style={{ textShadow: "0 0 10px rgba(239, 68, 68, 0.6)" }}
                  >
                    -{selectedPackage.tickets} 🎫
                  </p>
                </div>
                
                <div className="text-2xl text-red-400 animate-pulse">⚡</div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-400 font-mono mb-1">RECEIVE</p>
                  <p 
                    className="text-2xl font-bold text-green-400 font-exo2"
                    style={{ textShadow: "0 0 10px rgba(16, 185, 129, 0.6)" }}
                  >
                    +{selectedPackage.reward} USDT
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button 
              onClick={onClose}
              variant="secondary"
              className="flex-1 py-4 font-bold tracking-wider"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)"
              }}
            >
              <PixelIcon name="arrow-left" className="w-5 h-5 mr-2" />
              {intl.formatMessage({ id: 'components.redeemTicketsModal.cancel' })}
            </Button>
            
            <Button 
              onClick={handleRedeem}
              disabled={isProcessing || selectedTickets > userTickets}
              variant="cosmic"
              className="flex-2 py-4 font-bold tracking-wider text-lg"
              glowing={!isProcessing}
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)"
              }}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  {intl.formatMessage({ id: 'components.redeemTicketsModal.processing' })}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  {intl.formatMessage({ id: 'components.redeemTicketsModal.exchangeEnergy' })}
                  <PixelIcon name="arrow-up" className="w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Efectos de partículas energéticas */}
        {energyPulsing && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"
              style={{ animationDelay: '0s' }}
            />
            <div 
              className="absolute top-3/4 right-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
            <div 
              className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style={{ animationDelay: '1s' }}
            />
            <div 
              className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping"
              style={{ animationDelay: '1.5s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
} 