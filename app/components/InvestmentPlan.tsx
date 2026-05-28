"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { useIntl } from 'react-intl';

interface MiningModuleProps {
  title?: string;
  description?: string;
  imagePath: string;
  altText: string;
  rendimiento: number; 
  monto: number;
  minPrice?: number;
  maxPrice?: number;
  duracionDias: number;
  titleKey: string;
  descriptionKey: string;
  onClick: () => void;
}

export function InvestmentPlan({ 
  title, 
  description, 
  imagePath, 
  altText, 
  rendimiento,
  monto,
  minPrice,
  maxPrice,
  duracionDias,
  titleKey, 
  descriptionKey, 
  onClick 
}: MiningModuleProps) {
  const intl = useIntl();
  const [hover, setHover] = useState(false);
  const [scanning, setScanning] = useState(false);

  React.useEffect(() => {
    // Efecto de escaneo aleatorio
    const interval = setInterval(() => {
      setScanning(true);
      setTimeout(() => setScanning(false), 1500);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="relative overflow-hidden transition-all duration-500 transform group cursor-pointer"
      style={{ 
        clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px), 0 20px)",
        background: hover ? 
          "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))" :
          "linear-gradient(135deg, rgba(15, 15, 35, 0.8), rgba(20, 20, 45, 0.9), rgba(25, 25, 55, 0.8))",
        boxShadow: hover ? 
          "0 0 40px rgba(124, 58, 237, 0.8), 0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)" : 
          "0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.05)",
        transform: hover ? "translateY(-8px) scale(1.02)" : "translateY(0px) scale(1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(124, 58, 237, 0.3)"
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {/* Esquinas tecnológicas */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400/80"></div>
      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-cyan-400/80"></div>
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-cyan-400/80"></div>
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-cyan-400/80"></div>

      {/* Línea de energía superior */}
      <div 
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"
        style={{
          boxShadow: "0 0 10px 2px rgba(124, 58, 237, 0.6)",
          opacity: hover ? 1 : 0.7,
          transition: "all 0.3s ease"
        }}
      />

      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div 
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ 
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)"
          }}
        />
        <span className="text-xs font-mono text-green-400 tracking-wider">{intl.formatMessage({ id: 'components.investmentPlan.ready' })}</span>
      </div>

      {/* Scanline effect */}
      {scanning && (
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            animation: 'matrix-scan 1.5s ease-in-out',
            boxShadow: "0 0 20px 5px rgba(6, 182, 212, 0.8)"
          }}
        />
      )}
      
      <div className="p-6 relative z-10">
        <div className="flex justify-center mb-6">
          <div 
            className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden transform transition-all duration-500"
            style={{ 
              boxShadow: hover ? 
                "0 0 30px rgba(124, 58, 237, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)" : 
                "0 0 20px rgba(124, 58, 237, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)",
              transform: hover ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
              border: "2px solid rgba(124, 58, 237, 0.5)"
            }}
          >
            <Image 
              src={imagePath} 
              alt={altText} 
              fill
              unoptimized={true}
              className="object-contain"
            />

            {/* Holographic overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/20 to-cyan-900/30 opacity-60 group-hover:opacity-80 transition-opacity"
              style={{
                background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)"
              }}
            />
            
            {/* Rotating border */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                background: "linear-gradient(45deg, transparent, rgba(124, 58, 237, 0.5), transparent, rgba(6, 182, 212, 0.5)) border-box",
                animation: hover ? "spin 3s linear infinite" : "none"
              }}
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h3 
            className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-blue-300 to-cyan-300 font-exo2 tracking-wider"
            style={{ 
              textShadow: hover ? "0 0 15px rgba(124, 58, 237, 0.8)" : "0 0 10px rgba(124, 58, 237, 0.5)"
            }}
          >
            {intl.formatMessage({ id: titleKey })}
          </h3>
          <p className="text-sm text-gray-300 font-mono leading-relaxed">
            {intl.formatMessage({ id: descriptionKey })}
          </p>
        </div>

        {/* Mining stats */}
        <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-red-500/20">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-mono">MINING RATE</p>
              <p 
                className="text-lg font-bold text-cyan-400 font-exo2"
                style={{ textShadow: "0 0 10px rgba(6, 182, 212, 0.6)" }}
              >
                {rendimiento}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-mono">{intl.formatMessage({ id: 'components.investmentPlan.activation' })}</p>
              <p 
                className="text-lg font-bold text-red-400 font-exo2"
                style={{ textShadow: "0 0 10px rgba(124, 58, 237, 0.6)" }}
              >
                {minPrice ? `${minPrice} - ${maxPrice}` : monto} USDT
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="cosmic" 
          className="w-full transform transition-all duration-300 font-bold tracking-wider"
          style={{ 
            clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
            transform: hover ? "translateY(-2px)" : "translateY(0)",
          }}
          glowing={hover}
          onClick={onClick}
        >
          <span className="flex items-center justify-center gap-2">
            <span>🚀</span>
            {intl.formatMessage({ id: 'components.investmentPlan.viewDetails' })}
          </span>
        </Button>
      </div>

      {/* Decorative side panels */}
      <div 
        className="absolute left-0 top-1/4 w-1 h-12 bg-gradient-to-b from-red-500/50 to-cyan-500/50"
        style={{ 
          boxShadow: "0 0 10px 2px rgba(124, 58, 237, 0.4)",
          opacity: hover ? 1 : 0.6
        }}
      />
      <div 
        className="absolute right-0 top-1/2 w-1 h-12 bg-gradient-to-b from-blue-500/50 to-red-500/50"
        style={{ 
          boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.4)",
          opacity: hover ? 1 : 0.6
        }}
      />

      {/* Holographic grid overlay */}
      <div 
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px),
            linear-gradient(180deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
} 