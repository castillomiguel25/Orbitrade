"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './Button';
import { PixelIcon } from './PixelIcon';
import { useProfileStore } from '@/app/store/useProfileStore';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';

interface Plan {
  id?: string;
  title: string;
  description: string;
  // imagePath: string;
  // altText: string;
  rendimiento: number;
  monto: number;
  minPrice?: number;
  maxPrice?: number;
  duracionDias: number;
  titleKey: string;
  descriptionKey: string;
}

interface MiningModuleDetailProps {
  plan: Plan;
  onClose: () => void;
}

export function PlanDetail({ plan, onClose }: MiningModuleDetailProps) {
  const intl = useIntl();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(0);
  const [systemActive, setSystemActive] = useState(false);
  const { profile, fetchProfile } = useProfileStore();
  const [paymentSource, setPaymentSource] = useState<'sin-deposito' | 'con-deposito'>('con-deposito');
  const isDepositOnlyPlan = ['plan-17', 'plan-20', 'plan-23'].includes(String(plan?.id || ''));
  // Monto variable a invertir: mínimo el definido en el plan (plan.monto o plan.minPrice)
  const [amount, setAmount] = useState<number>(plan.minPrice || plan.monto || 0);
  const isVariablePrice = (plan.minPrice !== undefined && plan.maxPrice !== undefined);
  const isSpaceship = (plan?.id === 'spaceship') || (plan.titleKey === 'plans.spaceship.title');
  const showAmountInput = isVariablePrice || isSpaceship;

  useEffect(() => {
    // Animación de entrada simple
    setIsVisible(true);

    // Pulso energético sutil
    const pulseInterval = setInterval(() => {
      setEnergyPulse(prev => (prev + 1) % 3);
    }, 1500);

    // Activación del sistema
    const systemInterval = setInterval(() => {
      setSystemActive(prev => !prev);
    }, 3000);

    // Manejar tecla Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(systemInterval);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleInvest = async (plan: Plan) => {
    if (isSubmitting) {
      return;
    }

    // Validación mínima en el cliente
    if (typeof amount !== 'number' || isNaN(amount)) {
      toast.error(intl.formatMessage({ id: 'components.planDetail.errorInvesting' }));
      return;
    }
    if (amount < (plan.minPrice || plan.monto || 0)) {
      toast.error(intl.formatMessage({ id: 'components.planDetail.minAmountError' }, { amount: plan.minPrice || plan.monto || 0 }));
      return;
    }
    if (plan.maxPrice && amount > plan.maxPrice) {
      toast.error(`El monto máximo es ${plan.maxPrice} USDT`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/invest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, amount, paymentSource: isDepositOnlyPlan ? 'con-deposito' : paymentSource })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || intl.formatMessage({ id: 'components.planDetail.errorInvesting' }));
        return;
      }

      await fetchProfile();
      toast.success(result.message || intl.formatMessage({ id: 'components.planDetail.investmentSuccess' }));
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(intl.formatMessage({ id: 'components.planDetail.investmentError' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    setIsVisible(false);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-lg mx-4 sm:mx-0 transform transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 0, 0, 0.95), rgba(60, 0, 0, 0.95))',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 20px 4px rgba(239, 68, 68, 0.8)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)'
        }}

      >
        {/* Header Mobile-First */}
        <div
          className="relative p-4 sm:p-6 border-b"
          style={{
            background: 'linear-gradient(90deg, rgba(15, 15, 35, 0.8), rgba(30, 27, 75, 0.8))',
            borderColor: `rgba(${energyPulse === 0 ? '139, 92, 246' : energyPulse === 1 ? '6, 182, 212' : '16, 185, 129'}, 0.3)`
          }}
        >
          {/* Línea energética superior */}
          <div
            className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ boxShadow: '0 0 8px #06b6d4' }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${systemActive ? 'bg-green-400' : 'bg-gray-500'} transition-colors duration-300`}
                style={{ boxShadow: systemActive ? '0 0 8px #10b981' : 'none' }} />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-cyan-300 font-exo2">
                  {intl.formatMessage({ id: plan.titleKey, defaultMessage: plan.title })}
                </h2>
                <p className="text-xs text-gray-400 font-mono">{intl.formatMessage({ id: 'components.planDetail.spaceMiningModule' })}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 transition-colors duration-200"
              type="button"
            >
              <PixelIcon name="close" className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Astronauta y Descripción */}
          {/* <div className="text-center space-y-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <div
                className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/50"
                style={{
                  boxShadow: systemActive ?
                    '0 0 20px rgba(6, 182, 212, 0.6)' :
                    '0 0 10px rgba(6, 182, 212, 0.3)'
                }}
              >
                <Image
                  src={plan.imagePath}
                  alt={plan.altText}
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              </div>

              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black/80 rounded-full flex items-center justify-center border border-cyan-400/50">
                <div className={`w-3 h-3 rounded-full ${systemActive ? 'bg-green-400' : 'bg-gray-400'} transition-colors duration-300`} />
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed px-2">
              {intl.formatMessage({ id: plan.descriptionKey })}
            </p>
          </div> */}

          {/* Estadísticas del Módulo */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {/* Activation Cost */}
            <div
              className="bg-black/40 p-3 sm:p-4 rounded-lg border text-center"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.3)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))'
              }}
            >
              <PixelIcon name="wallet" className="text-green-400 w-5 h-5 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">{intl.formatMessage({ id: 'components.planDetail.activation' })}</p>
              <p className="text-lg sm:text-xl font-bold text-green-400">
                {amount}
              </p>
              <p className="text-xs text-green-300">USDT</p>
            </div>

            {/* Duration */}
            <div
              className="bg-black/40 p-3 sm:p-4 rounded-lg border text-center"
              style={{
                borderColor: 'rgba(124, 58, 237, 0.3)',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(79, 70, 229, 0.1))'
              }}
            >
              <PixelIcon name="clock" className="text-red-400 w-5 h-5 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">DURATION</p>
              <p className="text-lg sm:text-xl font-bold text-red-400">
                {plan.duracionDias}
              </p>
              <p className="text-xs text-red-300">{intl.formatMessage({ id: 'components.planDetail.days' })}</p>
            </div>
          </div>

          {/* Selector de Monto (Solo para planes variables) */}
          {showAmountInput && (
            <div
              className="bg-black/40 p-4 rounded-lg border space-y-3 mb-4"
              style={{
                borderColor: 'rgba(6, 182, 212, 0.3)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(2, 132, 199, 0.08))'
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <PixelIcon name="settings" className="text-cyan-400 w-4 h-4" />
                <h3 className="text-sm font-bold text-cyan-300">{intl.formatMessage({ id: 'components.planDetail.amountToInvest' })}</h3>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  min={plan.minPrice || plan.monto}
                  max={plan.maxPrice}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={isSubmitting}
                  className="w-full bg-black/60 border border-cyan-500/30 rounded-md px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Min: {plan.minPrice || plan.monto} USDT</span>
                  {plan.maxPrice && <span>Max: {plan.maxPrice} USDT</span>}
                </div>
              </div>
            </div>
          )}

          {/* SELECTOR DE MÉTODO DE PAGO - MOVIDO AQUÍ PARA MÁXIMA VISIBILIDAD */}
          <div
            className="bg-black/40 p-4 rounded-lg border space-y-3"
            style={{
              borderColor: 'rgba(139, 92, 246, 0.5)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))',
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <PixelIcon name="wallet" className="text-purple-400 w-4 h-4" />
              <h3 className="text-sm font-bold text-purple-300">¿CON QUÉ SALDO PAGARÁS?</h3>
            </div>
            <div className="relative">
              <select 
                value={isDepositOnlyPlan ? 'con-deposito' : paymentSource}
                onChange={(e) => setPaymentSource(e.target.value as any)}
                disabled={isDepositOnlyPlan || isSubmitting}
                className="w-full bg-black border-2 border-purple-500/50 rounded-md px-3 py-3 text-sm text-white font-bold font-mono focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.8rem center',
                  backgroundSize: '1.2em'
                }}
              >
                <option value="con-deposito">💰 SALDO DEPÓSITO (${(Number(profile?.trc20balance) || 0).toFixed(2)})</option>
                {!isDepositOnlyPlan && (
                  <option value="sin-deposito">🔄 REINVERSIÓN GANANCIAS (${(Number(profile?.dailyearnings) || 0).toFixed(2)})</option>
                )}
              </select>
            </div>
          </div>

          {/* Información Adicional */}
          <div
            className="bg-black/30 p-4 rounded-lg border"
            style={{
              borderColor: 'rgba(139, 92, 246, 0.2)',
              background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.6), rgba(30, 27, 75, 0.6))'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <PixelIcon name="chart" className="text-cyan-400 w-4 h-4" />
              <h3 className="text-sm font-bold text-cyan-400">{intl.formatMessage({ id: 'components.planDetail.miningProjections' })}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400">{intl.formatMessage({ id: 'components.planDetail.dailyIncome' })}</p>
                <p className="text-white font-mono">
                  {((amount * plan.rendimiento) / 100).toFixed(2)} USDT
                </p>
              </div>
              <div>
                <p className="text-gray-400">{intl.formatMessage({ id: 'components.planDetail.totalReturn' })}</p>
                <p className="text-white font-mono">
                  {((amount * plan.rendimiento) * plan.duracionDias / 100).toFixed(0)} USDT
                </p>
              </div>
            </div>
          </div>
  
          {/* Botón de Activación */}
          <Button
            onClick={() => handleInvest(plan)}
            variant="cosmic"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 font-bold text-base sm:text-lg"
            style={{
              background: systemActive ?
                'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(168, 85, 247, 0.8))' :
                'linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.6))',
              boxShadow: systemActive ?
                '0 0 20px rgba(139, 92, 246, 0.6)' :
                '0 0 10px rgba(139, 92, 246, 0.4)',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)'
            }}
          >
            <span className="text-lg">🚀</span>
            {intl.formatMessage({ id: 'components.planDetail.activateModule' })}
            <PixelIcon name="arrow-right" className="w-4 h-4" />
          </Button>

          {/* Botón para abrir página de juego con icono de mapa */}
          <div className="mt-3 flex justify-center">
            <Button
              variant="outline"
              className="px-4 py-2 text-sm font-mono tracking-wider border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
              onClick={() => { window.location.href = "/game"; }}
            >
              <span className="flex items-center gap-2">
                <span>🗺️</span>
                {intl.formatMessage({ id: 'components.planDetail.openMap' })}
              </span>
            </Button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-green-400 rounded-full" />
              <span>{intl.formatMessage({ id: 'components.planDetail.ready' })}</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full" />
              <span>{intl.formatMessage({ id: 'components.planDetail.quantumStable' })}</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full" />
              <span>{intl.formatMessage({ id: 'components.planDetail.systemsOnline' })}</span>
            </div>
          </div>
        </div>

        {/* Línea energética inferior */}
        <div
          className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"
          style={{ boxShadow: '0 0 8px #8b5cf6' }}
        />
      </div>
    </div>
  );
} 
