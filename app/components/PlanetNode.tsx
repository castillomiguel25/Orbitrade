"use client";

import React, { useState, useEffect } from 'react';
import { PixelIcon } from './PixelIcon';

interface SpaceNodeProps {
  title: string;
  description: string;
  value: number | string;
  icon: string;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'cyan' | 'pink';
  isActive?: boolean;
  isConnected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PlanetNode({
  title,
  description,
  value,
  icon,
  color = 'blue',
  isActive = false,
  isConnected = false,
  onClick,
  className = ''
}: SpaceNodeProps) {
  const [hover, setHover] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [dataFlow, setDataFlow] = useState(false);

  useEffect(() => {
    // Pulso de energía intermitente
    const pulseInterval = setInterval(() => {
      setEnergyPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  useEffect(() => {
    // Efecto de escaneo para nodos activos
    if (isActive) {
      const scanInterval = setInterval(() => {
        setScanning(true);
        setTimeout(() => setScanning(false), 1500);
      }, 5000);

      return () => clearInterval(scanInterval);
    }
  }, [isActive]);

  useEffect(() => {
    // Flujo de datos para nodos conectados
    if (isConnected) {
      const dataInterval = setInterval(() => {
        setDataFlow(true);
        setTimeout(() => setDataFlow(false), 2000);
      }, 3000);

      return () => clearInterval(dataInterval);
    }
  }, [isConnected]);

  const getColorScheme = () => {
    const schemes = {
      blue: {
        border: 'border-blue-500/40',
        bg: 'bg-blue-900/20',
        text: 'text-blue-400',
        glow: 'rgba(59, 130, 246, 0.6)',
        accent: 'rgba(59, 130, 246, 0.8)'
      },
      purple: {
        border: 'border-red-500/40',
        bg: 'bg-red-900/20',
        text: 'text-red-400',
        glow: 'rgba(124, 58, 237, 0.6)',
        accent: 'rgba(124, 58, 237, 0.8)'
      },
      green: {
        border: 'border-green-500/40',
        bg: 'bg-green-900/20',
        text: 'text-green-400',
        glow: 'rgba(16, 185, 129, 0.6)',
        accent: 'rgba(16, 185, 129, 0.8)'
      },
      orange: {
        border: 'border-orange-500/40',
        bg: 'bg-orange-900/20',
        text: 'text-orange-400',
        glow: 'rgba(249, 115, 22, 0.6)',
        accent: 'rgba(249, 115, 22, 0.8)'
      },
      cyan: {
        border: 'border-cyan-500/40',
        bg: 'bg-cyan-900/20',
        text: 'text-cyan-400',
        glow: 'rgba(6, 182, 212, 0.6)',
        accent: 'rgba(6, 182, 212, 0.8)'
      },
      pink: {
        border: 'border-pink-500/40',
        bg: 'bg-pink-900/20',
        text: 'text-pink-400',
        glow: 'rgba(236, 72, 153, 0.6)',
        accent: 'rgba(236, 72, 153, 0.8)'
      }
    };
    
    return schemes[color];
  };

  const colorScheme = getColorScheme();

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Conexión de red cuántica */}
      {isConnected && (
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-green-400/60 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
          {dataFlow && (
            <div 
              className="absolute inset-0 rounded-full border-2 border-green-400/60"
              style={{
                animation: 'energyWave 2s ease-out'
              }}
            />
          )}
        </div>
      )}

      {/* Nodo espacial principal */}
      <div 
        className={`relative p-6 rounded-2xl backdrop-blur-lg border-2 transition-all duration-500 overflow-hidden ${
          colorScheme.border
        } ${colorScheme.bg}`}
        style={{
          clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
          boxShadow: hover || isActive ? 
            `0 0 40px ${colorScheme.glow}, 0 0 80px ${colorScheme.glow}40, inset 0 0 20px rgba(255, 255, 255, 0.1)` : 
            `0 0 20px ${colorScheme.glow}, inset 0 0 10px rgba(255, 255, 255, 0.05)`,
          transform: hover ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
          background: energyPulse ? 
            `linear-gradient(135deg, ${colorScheme.bg.replace('bg-', '').replace('/20', '/30')}, rgba(0, 0, 0, 0.4))` : 
            `linear-gradient(135deg, ${colorScheme.bg.replace('bg-', '').replace('/20', '/20')}, rgba(0, 0, 0, 0.3))`
        }}
      >
        {/* Esquinas tecnológicas */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/60"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/60"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60"></div>

        {/* Línea de energía superior */}
        <div 
          className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{
            boxShadow: `0 0 10px 2px ${colorScheme.glow}`,
            opacity: energyPulse ? 1 : 0.7
          }}
        />

        {/* Efecto de escaneo para nodos activos */}
        {scanning && isActive && (
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              animation: 'matrix-scan 1.5s ease-in-out',
              boxShadow: "0 0 20px 5px rgba(6, 182, 212, 0.8)"
            }}
          />
        )}

        {/* Grid holográfico de fondo */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, ${colorScheme.glow}60 1px, transparent 1px),
              linear-gradient(180deg, ${colorScheme.glow}60 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Contenido del nodo */}
        <div className="relative z-10">
          {/* Header del nodo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Indicador de estado */}
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    isActive ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 
                    isConnected ? 'bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50' : 
                    'bg-gray-500'
                  }`}
                />
                <span className="text-xs font-mono text-gray-400 tracking-wider">
                  {isActive ? 'ACTIVE' : isConnected ? 'CONNECTED' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Icono del nodo */}
            <div 
              className={`w-12 h-12 rounded-full ${colorScheme.bg} border-2 ${colorScheme.border} flex items-center justify-center relative`}
              style={{
                boxShadow: hover ? `0 0 20px ${colorScheme.glow}` : `0 0 10px ${colorScheme.glow}`,
                animation: isActive ? "floatAnimation 6s ease-in-out infinite" : "none"
              }}
            >
              <PixelIcon 
                name={icon} 
                className={`w-6 h-6 ${colorScheme.text}`}
              />
              
              {/* Anillo orbital para nodos activos */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
                  style={{
                    animation: "spin 4s linear infinite"
                  }}
                />
              )}
            </div>
          </div>

          {/* Título del nodo */}
          <h3 
            className={`text-lg font-bold ${colorScheme.text} font-exo2 tracking-wider mb-2`}
            style={{ 
              textShadow: hover ? `0 0 15px ${colorScheme.glow}` : `0 0 10px ${colorScheme.glow}` 
            }}
          >
            {title}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-gray-400 font-mono leading-relaxed mb-4">
            {description}
          </p>

          {/* Valor/Métrica */}
          <div 
            className={`text-center p-4 rounded-lg ${colorScheme.bg} border ${colorScheme.border} relative overflow-hidden`}
            style={{
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)"
            }}
          >
            <div className="relative z-10">
              <span className="text-xs text-gray-400 font-mono tracking-wider uppercase">VALUE</span>
              <p 
                className={`text-2xl font-bold ${colorScheme.text} font-exo2 mt-1`}
                style={{ 
                  textShadow: `0 0 15px ${colorScheme.glow}` 
                }}
              >
                {value}
              </p>
            </div>

            {/* Efecto de flujo de datos */}
            {dataFlow && (
              <div 
                className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  animation: 'dataFlow 2s ease-in-out',
                  boxShadow: "0 0 10px 2px rgba(6, 182, 212, 0.8)"
                }}
              />
            )}
          </div>
        </div>

        {/* Efectos de partículas para nodos activos */}
        {isActive && energyPulse && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{ animationDelay: '0s' }}
            />
            <div 
              className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
            <div 
              className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"
              style={{ animationDelay: '1s' }}
            />
          </div>
        )}

        {/* Efecto de hover */}
        {hover && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              animation: 'scanLine 2s ease-in-out'
            }}
          />
        )}
      </div>

      {/* Líneas de conexión para nodos conectados */}
      {isConnected && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-px h-8 bg-gradient-to-b from-green-400/60 to-transparent"
            style={{
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
              animation: dataFlow ? "quantumFlicker 2s ease-in-out" : "none"
            }}
          />
        </div>
      )}
    </div>
  );
} 