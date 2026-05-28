import React from 'react';
import { Button } from '@/app/components/Button';
import { QRCodeCanvas } from 'qrcode.react';
import { useIntl } from 'react-intl';

interface ReferralLinkBoxProps {
  referralLink: string;
  copiado: boolean;
  copiarEnlace: () => void;
  glowEffect: boolean;
  descargarQR: () => void;
}

export const ReferralLinkBox: React.FC<ReferralLinkBoxProps> = ({
  referralLink,
  copiado,
  copiarEnlace,
  glowEffect,
  descargarQR,
}) => {
  const intl = useIntl();

  return (
    <div className="space-y-6">
      {/* Colony Recruitment Transmitter */}
      <div
        className={`relative p-5 rounded-xl overflow-hidden transition-all duration-500 ${
          glowEffect ? 'shadow-lg' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
          border: `1px solid ${glowEffect ? 'rgba(19, 241, 135, 0.5)' : 'rgba(19, 241, 135, 0.3)'}`,
          boxShadow: glowEffect ? '0 0 30px rgba(19, 241, 135, 0.2)' : '0 0 15px rgba(19, 241, 135, 0.1)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-miner-green/60 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-miner-green/60 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-miner-green/60 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-miner-green/60 rounded-br" />

        {/* Transmission Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187' }}
            />
            <span className="font-mono text-xs text-miner-green uppercase tracking-wider">
              {intl.formatMessage({ id: 'components.referralLinkBox.transmissionActive' })}
            </span>
          </div>
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, #13f187, transparent)' }} />
        </div>

        {/* Link Input */}
        <div
          className="relative p-4 rounded-lg mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(10, 36, 25, 0.7))',
            border: '1px solid rgba(19, 241, 135, 0.2)',
          }}
        >
          <label className="block font-mono text-[10px] text-miner-green/70 uppercase tracking-wider mb-2">
            {intl.formatMessage({ id: 'components.referralLinkBox.galacticRecruitmentCode' })}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={referralLink ?? ''}
              readOnly
              className="flex-1 bg-transparent text-stellar-white font-mono text-sm focus:outline-none truncate hidden md:block"
              style={{ textShadow: '0 0 10px rgba(19, 241, 135, 0.3)' }}
            />
            <Button
              onClick={copiarEnlace}
              variant="cosmic"
              className="px-4 py-2 font-mono tracking-wider flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <span>{copiado ? '✅' : '📋'}</span>
                <span className="text-sm">
                  {copiado
                    ? intl.formatMessage({ id: 'components.referralLinkBox.copied' })
                    : intl.formatMessage({ id: 'components.referralLinkBox.copyCode' })}
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Info message */}
        <div
          className="p-3 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.1), rgba(0, 245, 255, 0.05))',
            border: '1px solid rgba(19, 241, 135, 0.2)',
          }}
        >
          <p className="font-mono text-xs text-miner-green/80 text-center">
            {intl.formatMessage({ id: 'components.referralLinkBox.transmitCodeMessage' })}
          </p>
        </div>

        {/* Mission Briefing */}
        <div
          className="mt-4 p-3 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(220, 149, 230, 0.1), rgba(220, 149, 230, 0.05))',
            border: '1px solid rgba(220, 149, 230, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-plasma-pink text-sm">🌌</span>
            <span className="font-mono text-xs text-plasma-pink uppercase tracking-wider">
              {intl.formatMessage({ id: 'components.referralLinkBox.missionBriefing' })}
            </span>
          </div>
          <p className="font-mono text-[11px] text-plasma-pink/70 leading-relaxed">
            {intl.formatMessage({ id: 'components.referralLinkBox.missionBriefingText' })}
          </p>
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
