"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { PixelIcon } from './PixelIcon';
import { useRouter } from 'next/navigation';
import { useIntl } from 'react-intl';

interface MiningModuleCarouselProps {
  plans: Array<{
    title: string;
    description: string;
    imagePath: string;
    altText: string;
    rendimiento: number;
    monto: number;
    titleKey: string;
    descriptionKey: string;
  }>;
  onSelectPlan: (plan: any) => void;
}

type Profile = {
  name: string;
};

type Deposit = {
  plan_nombre: string;
};

export function PlanCarousel({ plans, onSelectPlan }: MiningModuleCarouselProps) {
  const router = useRouter();
  const intl = useIntl();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [glowEffect, setGlowEffect] = useState(false);
  const [scanEffect, setScanEffect] = useState(false);
  const [user, setUser] = useState({
    name: "",
  });
  const [name, setName] = useState(user.name);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
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
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/profiles");
        const result: { profiles?: Profile[]; error?: string } = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Error al cargar el perfil");
        }

        const profile = result.profiles?.[0];
        if (!profile) {
          throw new Error("Perfil no encontrado");
        }

        const updatedUser = {
          name: profile.name || "Pilot",
        };
        setUser(updatedUser);  
        setName(updatedUser.name);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await fetch("/api/deposits");
        const data = await res.json();
        if (res.ok && data.deposits) {
          setDeposits(data.deposits);
        }
      } catch (error) {
        console.error("Error al cargar los módulos activos:", error);
      }
    };

    fetchDeposits();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % plans.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + plans.length) % plans.length);
  };

  const currentPlan = plans[currentIndex];
  const isPlanActive = deposits.some(deposit => deposit.plan_nombre === intl.formatMessage({ id: currentPlan.titleKey }));

  const handlePlanAction = () => {
    if (!isPlanActive) {
      router.push('/deposits');
    } else {
      onSelectPlan(currentPlan);
    }
  };

  return (
    <div className="w-full py-8">
      <div 
        className="relative backdrop-blur-lg p-8 mx-auto max-w-lg overflow-hidden"
        style={{
          clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
          background: "linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(31, 31, 31, 0.9))",
          boxShadow: glowEffect ? 
            "0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)" : 
            "0 0 30px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.03)",
          border: "2px solid rgba(239, 68, 68, 0.4)",
        }}
      >
        {/* Esquinas tecnológicas */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500/80"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500/80"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500/80"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500/80"></div>
      
        {/* Línea de energía superior */}
        <div 
          className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"
          style={{
            boxShadow: "0 0 15px 3px rgba(239, 68, 68, 0.6)",
            opacity: glowEffect ? 1 : 0.8,
          }}
        />
      
        {/* Efecto de escaneo */}
        {scanEffect && (
          <div 
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent"
            style={{
              animation: 'matrix-scan 1.5s ease-in-out',
              boxShadow: "0 0 20px 5px rgba(239, 68, 68, 0.8)"
            }}
          />
        )}
      
        {/* Sistema de status */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
            <span className="text-xs font-mono text-red-400 tracking-wider">{intl.formatMessage({ id: 'components.planCarousel.active' })}</span>
          </div>
        </div>
        
        {/* Header de bienvenida */}
        <div className="mb-8 text-center relative">
          <h2 
            className="text-2xl md:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-red-400 to-red-500 font-exo2 tracking-wider"
            style={{ 
              textShadow: glowEffect ? "0 0 20px rgba(239, 68, 68, 0.8)" : "0 0 15px rgba(239, 68, 68, 0.5)"
            }}
          >
            🚀 {intl.formatMessage({ id: 'components.planCarousel.welcome' })}, {name.toUpperCase()}
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mt-3"
               style={{ boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)" }} />
        </div>
        
        {/* Información del módulo espacial */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center mb-6 relative">
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden border-2 transform transition-all duration-500"
              style={{ 
                borderColor: isPlanActive ? 
                  (glowEffect ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.6)") :
                  (glowEffect ? "rgba(249, 115, 22, 0.8)" : "rgba(249, 115, 22, 0.6)"),
                boxShadow: isPlanActive ?
                  (glowEffect ? "0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.4)" : "0 0 20px rgba(16, 185, 129, 0.6)") :
                  (glowEffect ? "0 0 30px rgba(249, 115, 22, 0.8), 0 0 60px rgba(249, 115, 22, 0.4)" : "0 0 20px rgba(249, 115, 22, 0.6)"),
                transform: glowEffect ? "scale(1.05)" : "scale(1)"
              }}
            >
              <Image 
                src={currentPlan.imagePath} 
                alt={currentPlan.altText}
                fill
                unoptimized={true}
                className="object-cover"
              />
              
              {/* Overlay holográfico */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/20 to-cyan-900/30 opacity-60"
                style={{
                  background: "radial-gradient(circle at center, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)"
                }}
              />
            </div>
            
            <div className="ml-6">
              <h3 
                className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-blue-300 to-cyan-300 font-exo2 tracking-wider"
                style={{ 
                  textShadow: glowEffect ? "0 0 15px rgba(124, 58, 237, 0.8)" : "0 0 10px rgba(124, 58, 237, 0.5)"
                }}
              >
                {intl.formatMessage({ id: currentPlan.titleKey })}
              </h3>
              
              <div 
                className={`px-4 py-2 inline-block rounded-lg text-sm font-mono font-bold tracking-wider border-2 transition-all duration-300 ${
                  isPlanActive 
                    ? `bg-green-900/20 text-green-300 border-green-400/60 ${glowEffect ? 'shadow-lg shadow-green-400/40' : ''}` 
                    : `bg-orange-900/20 text-orange-300 border-orange-400/60 ${glowEffect ? 'shadow-lg shadow-orange-400/40' : ''}`
                }`}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)"
                }}
              >
                {isPlanActive ? 
                  `🟢 ${intl.formatMessage({ id: 'components.planCarousel.activePlan' })}` : 
                  `🟠 ${intl.formatMessage({ id: 'components.planCarousel.inactivePlan' })}`
                }
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-center mb-6 font-mono leading-relaxed">
            {intl.formatMessage({ id: currentPlan.descriptionKey })}
          </p>
        </div>
        
        {/* Panel de estadísticas de minería */}
        <div 
          className="p-6 rounded-lg text-center mb-8 relative overflow-hidden"
          style={{ 
            background: "linear-gradient(135deg, rgba(0,0,0,0.4), rgba(124, 58, 237, 0.1), rgba(59, 130, 246, 0.1))",
            border: "1px solid rgba(124, 58, 237, 0.4)",
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)"
          }}
        >
          {/* Grid holográfico */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px),
                linear-gradient(180deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10">
            <p className="text-gray-400 mb-2 font-mono text-sm tracking-wider">⚡ {intl.formatMessage({ id: 'components.planCarousel.miningPerformance' })}</p>
            <p 
              className="text-4xl font-bold text-white font-exo2 tracking-wider mb-2" 
              style={{ 
                textShadow: glowEffect ? "0 0 20px rgba(255, 255, 255, 0.8)" : "0 0 15px rgba(255, 255, 255, 0.5)"
              }}
            >
              {currentPlan.rendimiento}
              <span className="text-amber-400 text-2xl ml-1">%</span>
            </p>
<p className="text-sm text-gray-400 font-mono">
                              🔋 {intl.formatMessage({ id: 'components.planCarousel.activationCost' })}: {(currentPlan.monto).toFixed(2)} USDT
                            </p>
          </div>
        </div>
        
        {/* Controles de navegación */}
        <div className="flex justify-between items-center">
          <Button 
            onClick={prevSlide}
            variant="secondary"
            className="flex items-center justify-center py-3 px-6 font-bold tracking-wider"
            style={{ 
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)"
            }}
          >
            <PixelIcon name="arrow-left" className="w-4 h-4 mr-2" />
            <span className="cursor-pointer">{intl.formatMessage({ id: 'components.planCarousel.prev' })}</span>
          </Button>
          
          <Button 
            className={`py-3 px-8 font-bold tracking-wider ${
              isPlanActive
                ? 'bg-gradient-to-r from-red-700 via-blue-700 to-cyan-700 hover:from-red-600 hover:via-blue-600 hover:to-cyan-600'
                : 'bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-700 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600'
            }`}
            style={{ 
              clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)"
            }}
            onClick={handlePlanAction}
            glowing
          >
            <span className="cursor-pointer flex items-center gap-2">
              {isPlanActive ? 
                <>🔍 {intl.formatMessage({ id: 'components.planCarousel.viewDetails' })}</> : 
                <>🚀 {intl.formatMessage({ id: 'components.planCarousel.activatePlan' })}</>
              }
            </span>
          </Button>
          
          <Button 
            onClick={nextSlide}
            variant="secondary"
            className="flex items-center justify-center py-3 px-6 font-bold tracking-wider"
            style={{ 
              clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)"
            }}
          >
            <span className="cursor-pointer">{intl.formatMessage({ id: 'components.planCarousel.next' })}</span>
            <PixelIcon name="arrow-right" className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Indicadores de módulos */}
      <div className="flex justify-center mt-6 space-x-3">
        {plans.map((_, index) => (
          <div 
            key={index} 
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-3 bg-gradient-to-r from-red-500 to-cyan-500' 
                : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
            }`}
            style={{
              boxShadow: index === currentIndex ? "0 0 15px rgba(124, 58, 237, 0.6)" : "none",
              cursor: "pointer"
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}