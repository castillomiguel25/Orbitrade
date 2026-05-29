import React from 'react';
import { InvestmentPlanType } from '@/app/types/investmentPlan';

interface CreatureModuleProps {
  plan: InvestmentPlanType;
  index: number;
  isActive: boolean;
  onClick: () => void;
  intl: ReturnType<typeof import('react-intl').useIntl>;
}

// Get rarity based on investment amount
const getRarity = (monto: number): { name: string; color: string; glow: string } => {
  if (monto >= 150) {
    return { name: 'LEGENDARY', color: '#F5A524', glow: 'rgba(245, 165, 36, 0.7)' };
  } else if (monto >= 100) {
    return { name: 'EPIC', color: '#E6E8EC', glow: 'rgba(230, 232, 236, 0.7)' };
  } else if (monto >= 50) {
    return { name: 'RARE', color: '#7C8AA0', glow: 'rgba(124, 138, 160, 0.7)' };
  }
  return { name: 'COMMON', color: '#F5A524', glow: 'rgba(245, 165, 36, 0.7)' };
};

export const CreatureModule: React.FC<CreatureModuleProps> = ({
  plan,
  isActive,
  onClick,
  intl,
}) => {
  const rarity = getRarity(plan.minPrice || plan.monto || 0);

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-[1.03] z-20' : 'hover:scale-[1.02]'
      }`}
      onClick={onClick}
    >
      {/* Main Card - Full Bleed Image Design */}
      <div
        className="relative rounded-2xl overflow-hidden aspect-[3/4] min-h-[380px]"
        style={{
          border: `2px solid ${isActive ? rarity.color : `${rarity.color}40`}`,
          boxShadow: isActive
            ? `0 0 60px ${rarity.glow}, 0 25px 50px rgba(0,0,0,0.5)`
            : `0 8px 32px rgba(0,0,0,0.4)`,
        }}
      >
        {/* FULL BLEED CREATURE IMAGE */}
        <div className="absolute inset-0">
          <img
            src={plan.imagePath}
            alt={plan.altText}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        </div>

        {/* Dark Gradient Overlay - Bottom Heavy */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              0deg,
              rgba(14, 17, 22, 0.98) 0%,
              rgba(14, 17, 22, 0.85) 20%,
              rgba(22, 26, 33, 0.4) 50%,
              transparent 70%
            )`,
          }}
        />

        {/* Top Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center top, transparent 50%, rgba(14, 17, 22, 0.6) 100%)',
          }}
        />

        {/* Rarity Badge - Top Right */}
        <div
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg"
          style={{
            background: `${rarity.color}30`,
            border: `1px solid ${rarity.color}`,
            backdropFilter: 'blur(8px)',
            boxShadow: isActive ? `0 0 20px ${rarity.glow}` : 'none',
          }}
        >
          <span
            className="text-[11px] font-mono font-black uppercase tracking-widest"
            style={{
              color: rarity.color,
              textShadow: `0 0 10px ${rarity.color}`,
            }}
          >
            {rarity.name}
          </span>
        </div>

        {/* Active Pulse Ring */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-32 h-32 rounded-full"
              style={{
                border: `2px solid ${rarity.color}50`,
                animation: 'pulseGrow 2s ease-out infinite',
              }}
            />
          </div>
        )}

        {/* Info Panel - Bottom Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          {/* Creature Name */}
          <h3 className="mb-4">
            <span
              className="text-2xl font-display font-black tracking-wide block"
              style={{
                color: '#ffffff',
                textShadow: `0 0 30px ${rarity.glow}, 0 2px 4px rgba(0,0,0,0.8)`,
              }}
            >
              {plan.title}
            </span>
          </h3>

          {/* Stats Row */}
          <div className="flex gap-3 mb-4">
            {/* Plasma Cost */}
            <div
              className="flex-1 text-center py-2.5 rounded-xl"
              style={{
                background: 'rgba(14, 17, 22, 0.6)',
                border: `1px solid ${rarity.color}40`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Plasma
              </div>
              <div
                className="font-mono text-lg font-bold"
                style={{ color: rarity.color }}
              >
                {plan.minPrice ? `${plan.minPrice} - ${plan.maxPrice}` : plan.monto}
              </div>
            </div>

            {/* Daily Yield */}
            <div
              className="flex-1 text-center py-2.5 rounded-xl"
              style={{
                background: 'rgba(14, 17, 22, 0.6)',
                border: '1px solid rgba(245, 165, 36, 0.4)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                Daily
              </div>
              <div className="font-mono text-lg font-bold text-amber-400">
                +{plan.rendimiento}%
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div
            className="flex items-center justify-center gap-2 py-2 rounded-lg"
            style={{
              background: isActive ? `${rarity.color}15` : 'rgba(14, 17, 22, 0.4)',
              border: `1px solid ${isActive ? rarity.color : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${isActive ? 'animate-pulse' : ''}`}
              style={{
                backgroundColor: isActive ? rarity.color : '#4b5563',
                boxShadow: isActive ? `0 0 12px ${rarity.color}` : 'none',
              }}
            />
            <span
              className="text-xs font-mono font-bold uppercase tracking-widest"
              style={{ color: isActive ? rarity.color : '#6b7280' }}
            >
              {isActive
                ? intl.formatMessage({ id: 'pages.dashboard.active' })
                : intl.formatMessage({ id: 'pages.dashboard.standby' })}
            </span>
          </div>
        </div>

        {/* Corner Accents */}
        <div
          className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 rounded-tl-lg z-10"
          style={{ borderColor: isActive ? rarity.color : `${rarity.color}60` }}
        />
        <div
          className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 rounded-tr-lg z-10 opacity-0"
        />
        <div
          className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 rounded-bl-lg z-10"
          style={{ borderColor: isActive ? rarity.color : `${rarity.color}60` }}
        />
        <div
          className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 rounded-br-lg z-10"
          style={{ borderColor: isActive ? rarity.color : `${rarity.color}60` }}
        />

        {/* Scanning Line Effect */}
        {isActive && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <div
              className="absolute left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${rarity.color}, transparent)`,
                boxShadow: `0 0 20px ${rarity.color}`,
                animation: 'scanDown 3s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Glow Border on Active */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 40px ${rarity.color}30`,
            }}
          />
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulseGrow {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes scanDown {
          0% { top: 0%; }
          50% { top: 100%; }
          50.01% { top: 0%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

// Export the old name as an alias for backwards compatibility
export { CreatureModule as AstronautModule };
