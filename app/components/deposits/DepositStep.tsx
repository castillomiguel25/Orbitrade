import { Button } from '@/app/components/Button';
import { PixelIcon } from '@/app/components/PixelIcon';
import { useIntl } from 'react-intl';

interface DepositStepProps {
  walletAddress: string;
  copiarWallet: () => void;
  glowEffect: boolean;
  amount?: string;
}

export function DepositStep({ walletAddress, copiarWallet, glowEffect, amount = "..." }: DepositStepProps) {
  const intl = useIntl();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-mono tracking-wider">
            {intl.formatMessage({ id: 'components.depositStep.quantumFuelTransferProtocol' })}
          </h3>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
        </div>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
      </div>

      {/* Transfer Overview - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Transfer Amount Panel */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-red-500/20 rounded-2xl blur-lg animate-pulse" />
          <div className="relative rounded-2xl p-6 border border-blue-500/40 shadow-2xl">
            
            {/* Panel Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-lg">⚡</span>
                <span className="text-blue-300 font-mono text-sm tracking-wider font-bold">{intl.formatMessage({ id: 'components.depositStep.transferAmount' })}</span>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />
            </div>

            {/* Amount Display */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/30 to-red-500/30 rounded-xl blur-md animate-pulse" />
                <div className="relative bg-slate-800/90 rounded-xl px-6 py-4 border border-blue-500/50">
                  <div className="text-blue-300 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.depositStep.quantumFuel' })}</div>
                  <div className="text-blue-100 font-mono text-3xl font-bold tracking-wider mb-1">
                    {amount}
                  </div>
                  <div className="text-blue-400 font-mono text-sm tracking-wider">USDT</div>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/30">
                <span className="text-blue-400 text-sm">🌐</span>
                <span className="text-blue-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.tronNetwork' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Instructions Panel */}
        {/* <div className="relative">
          <div className="absolute -inset-3 rounded-2xl blur-lg animate-pulse" />
          <div className="relative rounded-2xl p-6 border border-red-500/40 shadow-2xl">
            

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">📡</span>
                <span className="text-red-300 font-mono text-sm tracking-wider font-bold">{intl.formatMessage({ id: 'components.depositStep.protocolInstructions' })}</span>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60" />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-mono text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="text-red-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.initiateTransfer' })}</div>
                  <div className="text-red-200 font-mono text-xs leading-relaxed">
                    {intl.formatMessage({ id: 'components.depositStep.transferExactAmount' })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-mono text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="text-red-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.awaitConfirmation' })}</div>
                  <div className="text-red-200 font-mono text-xs leading-relaxed">
                    {intl.formatMessage({ id: 'components.depositStep.allowNetworkValidation' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Destination Coordinates - Full Width */}
      <div className="relative">
        <div className="absolute -inset-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl blur-lg animate-pulse" />
        <div className="relative rounded-2xl p-6 border border-green-500/40 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-green-400 text-lg">🗒️</span>
              <span className="text-green-300 font-mono text-sm tracking-wider font-bold">{intl.formatMessage({ id: 'components.depositStep.destinationCoordinates' })}</span>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />
          </div>

          {/* Wallet Address Interface */}
          <div className={`relative transition-all duration-500 ${glowEffect ? 'animate-pulse' : ''}`}>
            <div className={`absolute -inset-2 rounded-xl blur-md transition-all duration-500 ${
              glowEffect 
                ? 'bg-gradient-to-r from-green-500/40 to-cyan-500/40' 
                : 'bg-gradient-to-r from-green-500/20 to-cyan-500/20'
            }`} />
            
            <div className={`relative bg-slate-800/90 rounded-xl border-2 transition-all duration-500 ${
              glowEffect 
                ? 'border-green-500/60 shadow-2xl shadow-green-500/30' 
                : 'border-slate-700/50'
            }`}>
              
              {/* Address Label */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <span className="text-green-300 font-mono text-sm font-bold tracking-widest">{intl.formatMessage({ id: 'components.depositStep.walletAddress' })}</span>
                  {glowEffect && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.copied' })}</span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={copiarWallet}
                  variant="cosmic"
                  className="px-4 py-2 font-mono text-sm tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{glowEffect ? '✅' : '📋'}</span>
                    <span>{glowEffect ? intl.formatMessage({ id: 'components.depositStep.copied' }) : intl.formatMessage({ id: 'components.depositStep.copy' })}</span>
                  </div>
                </Button>
              </div>

              {/* Address Input */}
              <div className="p-4">
                <div className=" rounded-lg p-4 border border-slate-700/50">
                  <input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="w-full bg-transparent text-green-100 font-mono text-sm focus:outline-none"
                    style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Protocol Warnings */}
      <div className="relative">
        <div className="absolute -inset-3 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-2xl blur-lg animate-pulse" />
        <div className="relative rounded-2xl p-6 border border-amber-500/40 shadow-2xl">
          
          {/* Warning Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
              <PixelIcon name="trending-up" className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-amber-300 font-mono text-lg font-bold tracking-wider">⚠️ {intl.formatMessage({ id: 'components.depositStep.criticalProtocol' })}</h3>
              <div className="text-amber-400 font-mono text-xs tracking-wider">{intl.formatMessage({ id: 'components.depositStep.transmissionRequirements' })}</div>
            </div>
          </div>

          {/* Warning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">●</span>
                <span className="text-amber-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.exactAmount' })}</span>
              </div>
              <div className="text-amber-200 font-mono text-xs leading-relaxed">
                {intl.formatMessage({ id: 'components.depositStep.transferPrecisely' }, { amount })}
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">●</span>
                <span className="text-amber-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.networkValidation' })}</span>
              </div>
              <div className="text-amber-200 font-mono text-xs leading-relaxed">
                {intl.formatMessage({ id: 'components.depositStep.useTronNetwork' })}
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400 text-lg">●</span>
                <span className="text-amber-300 font-mono text-xs font-bold">{intl.formatMessage({ id: 'components.depositStep.transmissionDelay' })}</span>
              </div>
              <div className="text-amber-200 font-mono text-xs leading-relaxed">
                {intl.formatMessage({ id: 'components.depositStep.allowConfirmation' })}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/30">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 font-mono text-xs tracking-wider font-bold">
                {intl.formatMessage({ id: 'components.depositStep.transmissionProtocolsActive' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Ready */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-red-500/10 px-6 py-3 rounded-full border border-red-500/30">
          <span className="text-red-400 font-mono text-sm font-bold text-xs">{intl.formatMessage({ id: 'components.depositStep.nextProtocol' })}</span>
          <span className="text-red-300 font-mono text-xs">{intl.formatMessage({ id: 'components.depositStep.uploadTransmissionProof' })}</span>
          <span className="text-red-400 text-lg">→</span>
        </div>
      </div>
    </div>
  );
} 