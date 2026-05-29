import React from 'react';
import { Plan } from '@/app/modules/plans';

interface InstallationCardProps {
  plan: Plan;
  index: number;
  isActive: boolean;
  onClick: () => void;
  intl: ReturnType<typeof import('react-intl').useIntl>;
}

export const CreatureModule: React.FC<InstallationCardProps> = ({
  plan,
  isActive,
  onClick,
  intl,
}) => {
  const accent = plan.tier === 'industrial' ? '#F5A524' : '#7C8AA0';
  const accentAlpha = plan.tier === 'industrial' ? 'rgba(245,165,36,0.55)' : 'rgba(124,138,160,0.55)';

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-[1.02] z-20' : 'hover:scale-[1.01]'
      }`}
      onClick={onClick}
    >
      <div
        className="relative rounded-xl overflow-hidden aspect-[3/4] min-h-[360px]"
        style={{
          border: `1.5px solid ${isActive ? accent : `${accent}35`}`,
          boxShadow: isActive
            ? `0 0 40px ${accentAlpha}, 0 16px 40px rgba(0,0,0,0.5)`
            : `0 4px 24px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Full-bleed installation image */}
        <div className="absolute inset-0">
          <img
            src={plan.imagePath}
            alt={plan.tier === 'industrial' ? 'Industrial installation' : 'Entry installation'}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg,
              rgba(14,17,22,0.97) 0%,
              rgba(14,17,22,0.78) 28%,
              rgba(22,26,33,0.28) 55%,
              transparent 75%)`,
          }}
        />

        {/* Tier badge */}
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
            {plan.tier === 'industrial' ? 'Industrial' : 'Entry'}
          </span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl-md z-10"
          style={{ borderColor: isActive ? accent : `${accent}45` }} />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl-md z-10"
          style={{ borderColor: isActive ? accent : `${accent}45` }} />

        {/* Info panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-xl font-semibold text-[#E6E8EC] mb-3 tracking-wide">
            {intl.formatMessage({ id: plan.titleKey })}
          </h3>

          <div className="flex gap-2.5 mb-3">
            <div
              className="flex-1 text-center py-2 rounded-lg"
              style={{
                background: 'rgba(14,17,22,0.65)',
                border: `1px solid ${accent}28`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="text-[9px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-0.5">
                {intl.formatMessage({ id: 'pages.dashboard.minAmount' })}
              </div>
              <div className="text-sm font-semibold" style={{ color: accent }}>
                ${plan.minPrice}–${plan.maxPrice}
              </div>
            </div>

            <div
              className="flex-1 text-center py-2 rounded-lg"
              style={{
                background: 'rgba(14,17,22,0.65)',
                border: '1px solid rgba(245,165,36,0.28)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="text-[9px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-0.5">
                {intl.formatMessage({ id: 'pages.dashboard.dailyYield' })}
              </div>
              <div className="text-sm font-semibold text-amber-400">
                +{plan.rendimiento}%
              </div>
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 py-1.5 rounded-lg"
            style={{
              background: isActive ? `${accent}10` : 'rgba(14,17,22,0.4)',
              border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${isActive ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: isActive ? accent : '#374151' }}
            />
            <span className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: isActive ? accent : '#6b7280' }}>
              {isActive
                ? intl.formatMessage({ id: 'pages.dashboard.active' })
                : intl.formatMessage({ id: 'pages.dashboard.standby' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreatureModule as AstronautModule };
