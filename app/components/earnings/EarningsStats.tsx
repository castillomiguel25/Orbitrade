import React from 'react';
import { useIntl } from 'react-intl';

interface EarningsStatsProps {
  totalGanado: number;
  totalRetirado: number;
  totalBalance: number;
}

export const EarningsStats: React.FC<EarningsStatsProps> = ({ totalGanado, totalRetirado, totalBalance }) => {
  const intl = useIntl();

  return (
    <div className="relative space-y-4">
      {/* Total Generated Energy - Miner Green */}
      <div className="relative group">
        <div
          className="relative p-4 rounded-xl overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(245, 165, 36, 0.3)',
            boxShadow: '0 0 20px rgba(245, 165, 36, 0.1)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-500/60 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-500/60 rounded-tr" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-500/60 rounded-bl" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-500/60 rounded-br" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))',
                  border: '1px solid rgba(245, 165, 36, 0.4)',
                }}
              >
                
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-amber-400 uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.totalEnergyGenerated' })}
                </h3>
                <p className="text-[10px] font-mono text-[#7C8AA0]">
                  {intl.formatMessage({ id: 'components.earningsStats.cumulativeQuantumHarvest' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #F5A524, #7C8AA0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalGanado}
            </div>
            <div className="text-xs font-mono text-amber-400/70 mt-1">USDT</div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(245, 165, 36, 0.1)' }}>
            <div
              className="h-full rounded-full animate-pulse"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #F5A524, #7C8AA0)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #F5A524, transparent)',
              animation: 'scanHorizontal 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Extracted Energy - Cyber Cyan */}
      <div className="relative group">
        <div
          className="relative p-4 rounded-xl overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(124, 138, 160, 0.3)',
            boxShadow: '0 0 20px rgba(124, 138, 160, 0.1)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyber-cyan/60 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyber-cyan/60 rounded-tr" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyber-cyan/60 rounded-bl" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyber-cyan/60 rounded-br" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 138, 160, 0.3), rgba(124, 138, 160, 0.1))',
                  border: '1px solid rgba(124, 138, 160, 0.4)',
                }}
              >
                <span className="text-sm">💧</span>
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-[#7C8AA0] uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.extractedEnergy' })}
                </h3>
                <p className="text-[10px] font-mono text-[#7C8AA0]">
                  {intl.formatMessage({ id: 'components.earningsStats.successfulTransfersToStorage' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#7C8AA0', boxShadow: '0 0 8px #7C8AA0' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #7C8AA0, #F5A524)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalRetirado.toFixed(2)}
            </div>
            <div className="text-xs font-mono text-[#7C8AA0]/70 mt-1">
              {intl.formatMessage({ id: 'components.earningsStats.usdt' })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124, 138, 160, 0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${totalGanado > 0 ? (totalRetirado / totalGanado) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #7C8AA0, #F5A524)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #7C8AA0, transparent)',
              animation: 'scanHorizontal 3s ease-in-out infinite',
              animationDelay: '1s',
            }}
          />
        </div>
      </div>

      {/* Pending Energy - Plasma Pink */}
      <div className="relative group">
        <div
          className="relative p-4 rounded-xl overflow-hidden transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(230, 232, 236, 0.3)',
            boxShadow: '0 0 20px rgba(230, 232, 236, 0.1)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-plasma-pink/60 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-plasma-pink/60 rounded-tr" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-plasma-pink/60 rounded-bl" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-plasma-pink/60 rounded-br" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 232, 236, 0.3), rgba(230, 232, 236, 0.1))',
                  border: '1px solid rgba(230, 232, 236, 0.4)',
                }}
              >
                
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-[#E6E8EC] uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.pendingEnergy' })}
                </h3>
                <p className="text-[10px] font-mono text-[#7C8AA0]">
                  {intl.formatMessage({ id: 'components.earningsStats.awaitingExtractionProtocols' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#E6E8EC', boxShadow: '0 0 8px #E6E8EC' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #E6E8EC, #7C8AA0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalBalance.toFixed(2)}
            </div>
            <div className="text-xs font-mono text-[#E6E8EC]/70 mt-1">
              {intl.formatMessage({ id: 'components.earningsStats.usdt' })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(230, 232, 236, 0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${totalGanado > 0 ? (totalBalance / totalGanado) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #E6E8EC, #7C8AA0)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #E6E8EC, transparent)',
              animation: 'scanHorizontal 3s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
        </div>
      </div>

      {/* Energy Efficiency Status - Bio Yellow */}
      <div className="relative">
        <div
          className="relative p-3 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(245, 165, 36, 0.3)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-bio-yellow/60 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-bio-yellow/60 rounded-tr" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))',
                  border: '1px solid rgba(245, 165, 36, 0.4)',
                }}
              >
                <span className="text-xs">📊</span>
              </div>
              <div>
                <div className="text-xs font-display font-bold text-amber-400">
                  {intl.formatMessage({ id: 'components.earningsStats.energyEfficiency' })}
                </div>
                <div className="text-[10px] font-mono text-[#7C8AA0]">
                  {totalGanado > 0 ? ((totalBalance / totalGanado) * 100).toFixed(1) : 0}% {intl.formatMessage({ id: 'components.earningsStats.available' })}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div
                className="w-2 h-2 rounded-full animate-pulse mb-0.5 mx-auto"
                style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
              />
              <span className="text-amber-400 font-mono text-[10px]">
                {intl.formatMessage({ id: 'components.earningsStats.optimal' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scanHorizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
