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
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(19, 241, 135, 0.3)',
            boxShadow: '0 0 20px rgba(19, 241, 135, 0.1)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-miner-green/60 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-miner-green/60 rounded-tr" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-miner-green/60 rounded-bl" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-miner-green/60 rounded-br" />

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.3), rgba(19, 241, 135, 0.1))',
                  border: '1px solid rgba(19, 241, 135, 0.4)',
                }}
              >
                <span className="text-sm">⚡</span>
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-miner-green uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.totalEnergyGenerated' })}
                </h3>
                <p className="text-[10px] font-mono text-cosmic-gray">
                  {intl.formatMessage({ id: 'components.earningsStats.cumulativeQuantumHarvest' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #13f187, #00f5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalGanado}
            </div>
            <div className="text-xs font-mono text-miner-green/70 mt-1">USDT</div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(19, 241, 135, 0.1)' }}>
            <div
              className="h-full rounded-full animate-pulse"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #13f187, #00f5ff)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #13f187, transparent)',
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
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)',
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
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.3), rgba(0, 245, 255, 0.1))',
                  border: '1px solid rgba(0, 245, 255, 0.4)',
                }}
              >
                <span className="text-sm">💧</span>
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-cyber-cyan uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.extractedEnergy' })}
                </h3>
                <p className="text-[10px] font-mono text-cosmic-gray">
                  {intl.formatMessage({ id: 'components.earningsStats.successfulTransfersToStorage' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #13f187)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalRetirado.toFixed(2)}
            </div>
            <div className="text-xs font-mono text-cyber-cyan/70 mt-1">
              {intl.formatMessage({ id: 'components.earningsStats.usdt' })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0, 245, 255, 0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${totalGanado > 0 ? (totalRetirado / totalGanado) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #00f5ff, #13f187)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
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
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(220, 149, 230, 0.3)',
            boxShadow: '0 0 20px rgba(220, 149, 230, 0.1)',
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
                  background: 'linear-gradient(135deg, rgba(220, 149, 230, 0.3), rgba(220, 149, 230, 0.1))',
                  border: '1px solid rgba(220, 149, 230, 0.4)',
                }}
              >
                <span className="text-sm">🔮</span>
              </div>
              <div>
                <h3 className="text-xs font-display font-bold text-plasma-pink uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsStats.pendingEnergy' })}
                </h3>
                <p className="text-[10px] font-mono text-cosmic-gray">
                  {intl.formatMessage({ id: 'components.earningsStats.awaitingExtractionProtocols' })}
                </p>
              </div>
            </div>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#dc95e6', boxShadow: '0 0 8px #dc95e6' }}
            />
          </div>

          {/* Value */}
          <div className="text-center py-2">
            <div
              className="text-3xl font-display font-bold"
              style={{
                background: 'linear-gradient(135deg, #dc95e6, #00f5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {totalBalance.toFixed(2)}
            </div>
            <div className="text-xs font-mono text-plasma-pink/70 mt-1">
              {intl.formatMessage({ id: 'components.earningsStats.usdt' })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(220, 149, 230, 0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${totalGanado > 0 ? (totalBalance / totalGanado) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #dc95e6, #00f5ff)',
              }}
            />
          </div>

          {/* Scan line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #dc95e6, transparent)',
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
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
            border: '1px solid rgba(200, 255, 0, 0.3)',
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
                  background: 'linear-gradient(135deg, rgba(200, 255, 0, 0.3), rgba(200, 255, 0, 0.1))',
                  border: '1px solid rgba(200, 255, 0, 0.4)',
                }}
              >
                <span className="text-xs">📊</span>
              </div>
              <div>
                <div className="text-xs font-display font-bold text-bio-yellow">
                  {intl.formatMessage({ id: 'components.earningsStats.energyEfficiency' })}
                </div>
                <div className="text-[10px] font-mono text-cosmic-gray">
                  {totalGanado > 0 ? ((totalBalance / totalGanado) * 100).toFixed(1) : 0}% {intl.formatMessage({ id: 'components.earningsStats.available' })}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div
                className="w-2 h-2 rounded-full animate-pulse mb-0.5 mx-auto"
                style={{ backgroundColor: '#c8ff00', boxShadow: '0 0 8px #c8ff00' }}
              />
              <span className="text-bio-yellow font-mono text-[10px]">
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
