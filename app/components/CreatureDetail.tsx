"use client";

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { PixelIcon } from './PixelIcon';
import { useProfileStore } from '@/app/store/useProfileStore';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { InvestmentPlanType } from '@/app/types/investmentPlan';

interface CreatureDetailProps {
  plan: InvestmentPlanType;
  onClose: () => void;
}

// Get rarity based on monto
const getRarity = (monto: number): { nameKey: string; color: string; glow: string } => {
  if (monto >= 5000) return { nameKey: 'components.creatureDetail.rarity.legendary', color: '#F5A524', glow: 'rgba(245, 165, 36, 0.5)' };
  if (monto >= 1000) return { nameKey: 'components.creatureDetail.rarity.epic', color: '#E6E8EC', glow: 'rgba(230, 232, 236, 0.5)' };
  if (monto >= 500) return { nameKey: 'components.creatureDetail.rarity.rare', color: '#7C8AA0', glow: 'rgba(124, 138, 160, 0.5)' };
  return { nameKey: 'components.creatureDetail.rarity.common', color: '#F5A524', glow: 'rgba(245, 165, 36, 0.5)' };
};

export function CreatureDetail({ plan, onClose }: CreatureDetailProps) {
  const intl = useIntl();
  const [isVisible, setIsVisible] = useState(false);
  const [systemActive, setSystemActive] = useState(false);
  const { profile, fetchProfile } = useProfileStore();
  const [amount, setAmount] = useState<number>(plan.minPrice || plan.monto || 0);
  const [paymentSource, setPaymentSource] = useState<'sin-deposito' | 'con-deposito'>('con-deposito');

  const isVariableAmount =
    (plan.minPrice !== undefined && plan.maxPrice !== undefined) ||
    plan?.id === 'spaceship' ||
    plan.titleKey === 'plans.spaceship.title';

  const rarity = getRarity(plan.minPrice || plan.monto || 0);

  useEffect(() => {
    setIsVisible(true);

    const systemInterval = setInterval(() => {
      setSystemActive((prev) => !prev);
    }, 3000);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearInterval(systemInterval);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleInvest = async (creature: InvestmentPlanType) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      toast.error(intl.formatMessage({ id: 'components.planDetail.errorInvesting' }));
      return;
    }

    const minAmount = creature.minPrice || creature.monto || 0;
    const maxAmount = creature.maxPrice;

    if (amount < minAmount) {
      toast.error(intl.formatMessage({ id: 'components.creatureDetail.minimumAmount' }, { amount: minAmount }));
      return;
    }

    if (maxAmount && amount > maxAmount) {
      toast.error(`Maximum amount is ${maxAmount}`);
      return;
    }

    try {
      const response = await fetch('/api/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: creature,
          amount,
          paymentSource // Enviamos el origen de fondos
        }),
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
      console.error('Error:', error);
      toast.error(intl.formatMessage({ id: 'components.planDetail.investmentError' }));
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      style={{ background: 'rgba(14, 17, 22, 0.9)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-lg mx-4 sm:mx-0 transform transition-all duration-300 rounded-xl overflow-hidden ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.98), rgba(22, 26, 33, 0.95))',
          border: `1px solid ${rarity.color}40`,
          boxShadow: `0 0 40px ${rarity.glow}`,
        }}
      >
        {/* Corner Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl z-10" style={{ borderColor: rarity.color }} />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr z-10" style={{ borderColor: rarity.color }} />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl z-10" style={{ borderColor: rarity.color }} />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br z-10" style={{ borderColor: rarity.color }} />

        {/* Header */}
        <div
          className="relative p-4 sm:p-5 border-b"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.9), rgba(22, 26, 33, 0.8))',
            borderColor: `${rarity.color}30`,
          }}
        >
          {/* Top energy line */}
          <div
            className="absolute top-0 left-6 right-6 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)`,
              boxShadow: `0 0 8px ${rarity.color}`,
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${systemActive ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor: systemActive ? rarity.color : '#6b7280',
                  boxShadow: systemActive ? `0 0 8px ${rarity.color}` : 'none',
                }}
              />
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider">
                  <span
                    className="italic"
                    style={{
                      background: `linear-gradient(135deg, ${rarity.color}, #7C8AA0)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {intl.formatMessage({ id: plan.titleKey, defaultMessage: plan.title })}
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-mono text-[#7C8AA0] uppercase tracking-wider">{intl.formatMessage({ id: 'components.creatureDetail.orbitradeCreature' })}</p>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase"
                    style={{
                      background: `${rarity.color}20`,
                      color: rarity.color,
                      border: `1px solid ${rarity.color}40`,
                    }}
                  >
                    {intl.formatMessage({ id: rarity.nameKey })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-colors duration-200"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              type="button"
            >
              <PixelIcon name="close" className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Activation Cost */}
            <div
              className="relative p-3 sm:p-4 rounded-xl text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.1), rgba(245, 165, 36, 0.05))',
                border: '1px solid rgba(245, 165, 36, 0.3)',
              }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-500/50 rounded-tl" />
              <PixelIcon name="wallet" className="text-amber-400 w-5 h-5 mx-auto mb-2" />
              <p className="text-[10px] font-mono text-amber-400/70 uppercase tracking-wider mb-1">{intl.formatMessage({ id: 'components.creatureDetail.plasmaCost' })}</p>
              <p className="text-xl font-display font-bold text-amber-400">{amount}</p>
              <p className="text-[10px] font-mono text-amber-400/60">{intl.formatMessage({ id: 'components.creatureDetail.usdt' })}</p>
            </div>

            {/* Duration */}
            <div
              className="relative p-3 sm:p-4 rounded-xl text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(230, 232, 236, 0.1), rgba(230, 232, 236, 0.05))',
                border: '1px solid rgba(230, 232, 236, 0.3)',
              }}
            >
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-plasma-pink/50 rounded-tl" />
              <PixelIcon name="clock" className="text-[#E6E8EC] w-5 h-5 mx-auto mb-2" />
              <p className="text-[10px] font-mono text-[#E6E8EC]/70 uppercase tracking-wider mb-1">{intl.formatMessage({ id: 'components.creatureDetail.incubation' })}</p>
              <p className="text-xl font-display font-bold text-[#E6E8EC]">{plan.duracionDias}</p>
              <p className="text-[10px] font-mono text-[#E6E8EC]/60">{intl.formatMessage({ id: 'components.creatureDetail.cycles' })}</p>
            </div>
          </div>

          {/* Selector de Monto - Variable for all plans */}
          {isVariableAmount && (
            <div
              className="relative p-4 rounded-xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(124, 138, 160, 0.08), rgba(124, 138, 160, 0.03))',
                border: '1px solid rgba(124, 138, 160, 0.3)',
              }}
            >
              <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyber-cyan/50 rounded-tl" />
              <div className="flex items-center gap-2 mb-3">
                <PixelIcon name="settings" className="text-[#7C8AA0] w-4 h-4" />
                <h3 className="text-xs font-display font-bold text-[#7C8AA0] uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.creatureDetail.plasmaInvestment' })}
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={plan.minPrice || plan.monto}
                    max={plan.maxPrice}
                    step={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 bg-deep-space/60 border border-cyber-cyan/30 rounded-lg px-3 py-2 text-[#E6E8EC] font-mono focus:outline-none focus:border-cyber-cyan transition-colors"
                  />
                </div>
                <div className="text-[10px] text-[#7C8AA0] font-mono flex justify-between">
                  <span>{intl.formatMessage({ id: 'components.creatureDetail.min' })}: {plan.minPrice || plan.monto} {intl.formatMessage({ id: 'components.creatureDetail.usdt' })}</span>
                  {plan.maxPrice && <span>Max: {plan.maxPrice} {intl.formatMessage({ id: 'components.creatureDetail.usdt' })}</span>}
                </div>
              </div>
            </div>
          )}

          {/* SELECTOR DE MÉTODO DE PAGO - INTEGRADO EN COMMAND CENTER */}
          <div
            className="relative p-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.1), rgba(245, 165, 36, 0.05))',
              border: '1px solid rgba(245, 165, 36, 0.3)',
              boxShadow: '0 0 15px rgba(245, 165, 36, 0.1)'
            }}
          >
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#F5A524]/50 rounded-tl" />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">💳</span>
              <h3 className="text-xs font-display font-bold text-[#F5A524] uppercase tracking-wider">
                MÉTODO DE PAGO
              </h3>
            </div>
            <div className="relative">
              <select
                value={paymentSource}
                onChange={(e) => setPaymentSource(e.target.value as any)}
                className="w-full bg-black/80 border-2 border-[#F5A524]/30 rounded-lg px-3 py-3 text-xs text-white font-bold font-mono focus:outline-none focus:border-[#F5A524] appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23c8ff00'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.8rem center',
                  backgroundSize: '1.2em'
                }}
              >
                <option value="con-deposito">💰 SALDO DEPÓSITO</option>
                <option value="sin-deposito">🔄 REINVERSIÓN GANANCIAS </option>
              </select>
            </div>
          </div>

          {/* Mining Projections */}
          <div
            className="relative p-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.8), rgba(22, 26, 33, 0.7))',
              border: `1px solid ${rarity.color}30`,
            }}
          >
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l rounded-tl" style={{ borderColor: `${rarity.color}50` }} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r rounded-tr" style={{ borderColor: `${rarity.color}50` }} />

            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-4" style={{ color: rarity.color }}>📊</span>
              <h3 className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: rarity.color }}>
                {intl.formatMessage({ id: 'components.creatureDetail.harvestProjections' })}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono text-[#7C8AA0] uppercase mb-1">{intl.formatMessage({ id: 'components.creatureDetail.dailyYield' })}</p>
                <p
                  className="font-mono text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${rarity.color}, #7C8AA0)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {((amount * plan.rendimiento) / 100).toFixed(2)} {intl.formatMessage({ id: 'components.creatureDetail.usdt' })}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#7C8AA0] uppercase mb-1">{intl.formatMessage({ id: 'components.creatureDetail.totalReturn' })}</p>
                <p
                  className="font-mono text-sm font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${rarity.color}, #7C8AA0)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {(((amount * plan.rendimiento) * plan.duracionDias) / 100).toFixed(0)} {intl.formatMessage({ id: 'components.creatureDetail.usdt' })}
                </p>
              </div>
            </div>
          </div>

          {/* Acquire Button */}
          <Button
            onClick={() => handleInvest(plan)}
            variant="primary"
            className="w-full flex items-center justify-center gap-3 py-4 font-display font-bold text-base sm:text-lg tracking-wider"
          >
            <span className="text-lg">🧬</span>
            <span>
              <span className="italic">{intl.formatMessage({ id: 'components.creatureDetail.acquire' })}</span> {intl.formatMessage({ id: 'components.creatureDetail.creature' })}
            </span>
            <PixelIcon name="arrow-right" className="w-4 h-4" />
          </Button>

          {/* Map Button */}
          {/* <div className="flex justify-center">
            <Button
              variant="outline"
              className="px-4 py-2 text-xs font-mono tracking-wider"
              onClick={() => {
                window.location.href = '/game';
              }}
            >
              <span className="flex items-center gap-2">
                <span>🗺️</span>
                {intl.formatMessage({ id: 'components.creatureDetail.openGalaxyMap' })}
              </span>
            </Button>
          </div> */}

          {/* Status Bar */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-[#7C8AA0]">
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#F5A524', boxShadow: '0 0 4px #F5A524' }}
              />
              <span className="text-amber-400">{intl.formatMessage({ id: 'components.creatureDetail.ready' })}</span>
            </div>
            <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#7C8AA0', boxShadow: '0 0 4px #7C8AA0', animationDelay: '0.5s' }}
              />
              <span className="text-[#7C8AA0]">{intl.formatMessage({ id: 'components.creatureDetail.quantumStable' })}</span>
            </div>
            <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#E6E8EC', boxShadow: '0 0 4px #E6E8EC', animationDelay: '1s' }}
              />
              <span className="text-[#E6E8EC]">{intl.formatMessage({ id: 'components.creatureDetail.online' })}</span>
            </div>
          </div>
        </div>

        {/* Bottom energy line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)`,
            boxShadow: `0 0 8px ${rarity.color}`,
          }}
        />
      </div>
    </div>
  );
}

// Export the old name as an alias for backwards compatibility
export { CreatureDetail as PlanDetail };
