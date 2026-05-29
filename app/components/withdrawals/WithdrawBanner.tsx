import React from 'react';
import { Button } from '@/app/components/Button';
import { useIntl } from 'react-intl';

interface WithdrawBannerProps {
  balanceDisponible: number;
  balanceDisponibleUSDT: Number;
  limiteMinimo: number;
  withdrawalKey: string;
  comisionRetiro: number;
  abrirModal: () => void;
  abrirModalConfiguracion: () => void;
  claveActual: string;
  currentWeekCount: number;
}

const WithdrawBanner: React.FC<WithdrawBannerProps> = ({
  withdrawalKey,
  balanceDisponible,
  balanceDisponibleUSDT,
  limiteMinimo,
  comisionRetiro,
  abrirModal,
  abrirModalConfiguracion,
  claveActual,
  currentWeekCount
}) => {
  const intl = useIntl();

  return (
    <div className="relative space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(230, 232, 236, 0.3), rgba(230, 232, 236, 0.1))',
              border: '1px solid rgba(230, 232, 236, 0.4)',
              boxShadow: '0 0 15px rgba(230, 232, 236, 0.2)',
            }}
          >
            <span className="text-lg">⚡</span>
          </div>
          <h2 className="font-display text-lg font-bold tracking-wider">
            <span
              className="italic"
              style={{
                background: 'linear-gradient(135deg, #E6E8EC, #7C8AA0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Energy
            </span>{' '}
            <span className="text-[#E6E8EC] font-light">
              {intl.formatMessage({ id: 'components.withdrawBanner.energyExtractionStation' })}
            </span>
          </h2>
        </div>
        <div
          className="w-full h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #E6E8EC, transparent)' }}
        />
      </div>

      {/* Weekly Commission Notice */}
      <div
        className="relative p-4 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: '1px solid rgba(245, 165, 36, 0.3)',
        }}
      >
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-bio-yellow/50 rounded-tl" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-bio-yellow/50 rounded-tr" />

        <div className="flex items-start gap-3">
          <div
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse"
            style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
          />
          <div className="font-mono text-xs text-amber-400/90 leading-relaxed">
            <div className="font-bold mb-1.5">{intl.formatMessage({ id: 'components.withdrawBanner.commissionTitle' })}</div>
            <div className="text-amber-400/70 mb-1">
              {intl.formatMessage({ id: 'components.withdrawBanner.commissionRates' })}
            </div>
            <div className="text-[#E6E8EC]/80">
              {intl.formatMessage({ id: 'components.withdrawBanner.nextWithdrawal' })} <span className="text-amber-400 font-bold">{comisionRetiro}%</span>
              {currentWeekCount > 0 && (
                <span className="text-[#7C8AA0] ml-1">
                  {intl.formatMessage(
                    { id: 'components.withdrawBanner.withdrawalsThisWeek' },
                    { count: currentWeekCount }
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Balance Display */}
      <div
        className="relative p-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: '1px solid rgba(124, 138, 160, 0.3)',
          boxShadow: '0 0 25px rgba(124, 138, 160, 0.1)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan/60 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan/60 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan/60 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan/60 rounded-br" />

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 138, 160, 0.3), rgba(124, 138, 160, 0.1))',
              border: '1px solid rgba(124, 138, 160, 0.4)',
            }}
          >
            <span className="text-sm">🔋</span>
          </div>
          <span className="font-mono text-xs text-[#7C8AA0] uppercase tracking-wider">
            {intl.formatMessage({ id: 'components.withdrawBanner.availableEnergyReserves' })}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/usdt-logo.png" alt="USDT" className="w-10 h-10" />
          <div
            className="text-4xl font-display font-bold"
            style={{
              background: 'linear-gradient(135deg, #7C8AA0, #F5A524)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {(balanceDisponibleUSDT ?? 0).toLocaleString('es-ES')}
          </div>
        </div>

        {/* Scan line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, #7C8AA0, transparent)',
            animation: 'scanHorizontal 3s ease-in-out infinite',
          }}
        />
      </div>

      {/* Extraction Protocols Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Minimum Extract */}
        <div
          className="relative p-3 rounded-lg overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(124, 138, 160, 0.25)',
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyber-cyan/40 rounded-tl" />
          <div className="font-mono text-[10px] text-[#7C8AA0]/70 uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawBanner.minimumExtract' })}
          </div>
          <div className="font-display text-lg font-bold text-[#7C8AA0]">{limiteMinimo} USDT</div>
        </div>

        {/* Quantum Fee */}
        <div
          className="relative p-3 rounded-lg overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(230, 232, 236, 0.25)',
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-plasma-pink/40 rounded-tl" />
          <div className="font-mono text-[10px] text-[#E6E8EC]/70 uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawBanner.quantumFee' })}
          </div>
          <div className="font-display text-lg font-bold text-[#E6E8EC]">{comisionRetiro}%</div>
        </div>

        {/* Process Time */}
        <div
          className="relative p-3 rounded-lg overflow-hidden text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(245, 165, 36, 0.25)',
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-500/40 rounded-tl" />
          <div className="font-mono text-[10px] text-amber-400/70 uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawBanner.processTime' })}
          </div>
          <div className="font-display text-lg font-bold text-amber-400">24-48H</div>
        </div>
      </div>

      {/* Security Status Panel */}
      <div
        className="relative p-4 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: `1px solid ${withdrawalKey ? 'rgba(245, 165, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        }}
      >
        {/* Corner brackets */}
        <div
          className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl ${
            withdrawalKey ? 'border-amber-500/50' : 'border-red-500/50'
          }`}
        />
        <div
          className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr ${
            withdrawalKey ? 'border-amber-500/50' : 'border-red-500/50'
          }`}
        />

        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: withdrawalKey
                ? 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
              border: withdrawalKey
                ? '1px solid rgba(245, 165, 36, 0.4)'
                : '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            <span className="text-sm">🔐</span>
          </div>
          <span
            className={`font-mono text-xs uppercase tracking-wider ${
              withdrawalKey ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {intl.formatMessage({ id: 'components.withdrawBanner.securityStatus' })}
          </span>
        </div>

        <div className="space-y-3">
          {/* Authorization Status */}
          <div
            className="p-3 rounded-lg text-center"
            style={{
              background: withdrawalKey ? 'rgba(245, 165, 36, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: withdrawalKey ? '1px solid rgba(245, 165, 36, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${
                withdrawalKey ? 'text-amber-400/70' : 'text-red-400/70'
              }`}
            >
              {intl.formatMessage({ id: 'components.withdrawBanner.authorization' })}
            </div>
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: withdrawalKey ? '#F5A524' : '#ef4444',
                  boxShadow: withdrawalKey ? '0 0 8px #F5A524' : '0 0 8px #ef4444',
                }}
              />
              <span
                className={`font-display text-sm font-bold ${withdrawalKey ? 'text-amber-400' : 'text-red-400'}`}
              >
                {withdrawalKey
                  ? intl.formatMessage({ id: 'components.withdrawBanner.configured' })
                  : intl.formatMessage({ id: 'components.withdrawBanner.required' })}
              </span>
            </div>
          </div>

          {/* Configure Security Button */}
          <Button
            onClick={abrirModalConfiguracion}
            variant="secondary"
            className="w-full py-3 font-mono tracking-wider"
          >
            <div className="flex items-center justify-center gap-2">
              <span>🛠️</span>
              <span className="font-bold">{intl.formatMessage({ id: 'components.withdrawBanner.configureSecurity' })}</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Extraction Controls - Only show when withdrawal key is configured */}
      {withdrawalKey && (
        <div
          className="relative p-4 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(245, 165, 36, 0.3)',
            boxShadow: '0 0 20px rgba(245, 165, 36, 0.1)',
          }}
        >
          {/* Corner brackets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-500/50 rounded-tl" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-500/50 rounded-tr" />

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))',
                border: '1px solid rgba(245, 165, 36, 0.4)',
              }}
            >
              <span className="text-sm">⚡</span>
            </div>
            <span className="font-mono text-xs text-amber-400 uppercase tracking-wider">
              {intl.formatMessage({ id: 'components.withdrawBanner.extractionReady' })}
            </span>
            <div
              className="w-2 h-2 rounded-full animate-pulse ml-auto"
              style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
            />
          </div>

          <Button onClick={abrirModal} variant="primary" className="w-full py-3 font-mono tracking-wider">
            <div className="flex items-center justify-center gap-2">
              <span>🚀</span>
              <span className="font-bold">{intl.formatMessage({ id: 'components.withdrawBanner.initiateExtraction' })}</span>
            </div>
          </Button>
        </div>
      )}

      {/* Security Warning - Only show when withdrawal key is NOT configured */}
      {!withdrawalKey && (
        <div
          className="relative p-4 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
            border: '1px solid rgba(245, 165, 36, 0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))',
                border: '1px solid rgba(245, 165, 36, 0.4)',
              }}
            >
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <div className="font-display text-sm font-bold text-amber-400 mb-0.5">
                {intl.formatMessage({ id: 'components.withdrawBanner.securityProtocolRequired' })}
              </div>
              <div className="font-mono text-xs text-amber-400/70">
                {intl.formatMessage({ id: 'components.withdrawBanner.securityProtocolDesc' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scanHorizontal {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleX(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
};

export default WithdrawBanner;
