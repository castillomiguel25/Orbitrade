import React from 'react';
import { Button } from '@/app/components/Button';
import { PixelIcon } from '@/app/components/PixelIcon';
import Modal from '@/app/components/Modal';
import { useIntl } from 'react-intl';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  montoRetiro: string;
  setMontoRetiro: (value: string) => void;
  wallet: string;
  setWallet: (value: string) => void;
  redSeleccionada: string;
  seleccionarRed: (red: string) => void;
  claveRetiro: string;
  setClaveRetiro: (value: string) => void;
  balanceDisponible: number;
  balanceDisponibleUSDT: Number;
  comisionRetiro: number;
  calcularMontoFinal: () => string;
  solicitarRetiro: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  montoRetiro,
  setMontoRetiro,
  wallet,
  setWallet,
  redSeleccionada,
  seleccionarRed,
  claveRetiro,
  setClaveRetiro,
  balanceDisponible,
  balanceDisponibleUSDT,
  comisionRetiro,
  calcularMontoFinal,
  solicitarRetiro
}) => {
  const intl = useIntl();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={intl.formatMessage({ id: 'components.withdrawModal.title' })}
      maxWidth="4xl"
    >
      <div className="p-6">
        {/* Energy Extraction Configuration */}
        <div className="space-y-6">
          {/* Extraction Amount */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-2xl blur-md animate-pulse"></div>
            <div className="relative bg-[#161A21]/80 rounded-2xl p-6 border border-amber-500/25">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-amber-400 text-lg"></span>
                  <span className="text-[#E6E8EC] font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawModal.energyExtractionAmount' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60"></div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="number"
                    value={montoRetiro}
                    onChange={(e) => setMontoRetiro(e.target.value)}
                    className="w-full bg-[#0E1116]/80 border border-[#7C8AA0]/20 text-[#E6E8EC] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono text-lg tracking-wider"
                    placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterExtractionAmount' })}
                    style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-amber-500/10 rounded-xl border border-[#7C8AA0]/20">
                    <div className="text-[#7C8AA0] font-mono text-xs tracking-widest mb-1">
                      {intl.formatMessage({ id: 'components.withdrawModal.available' })}
                    </div>
                    <div className="text-[#E6E8EC] font-mono text-xl font-bold">
                      {(balanceDisponibleUSDT ?? 0).toLocaleString('es-ES')} USDT
                    </div>
                  </div>
                  
                  {montoRetiro && (
                    <div className="text-center p-3 bg-[#7C8AA0]/10 rounded-xl border border-green-500/20">
                      <div className="text-amber-400 font-mono text-xs tracking-widest mb-1">
                        {intl.formatMessage({ id: 'components.withdrawModal.youReceive' })}
                      </div>
                      <div className="text-amber-300 font-mono text-sm font-bold">{calcularMontoFinal()} USDT</div>
                    </div>
                  )}
                </div>
                
                {montoRetiro && (
                  <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                    <div className="text-amber-300 font-mono text-xs">
                      {intl.formatMessage(
                        { id: 'components.withdrawModal.quantumExtractionFee' },
                        { fee: comisionRetiro, amount: calcularMontoFinal() }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quantum Network */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#7C8AA0]/10 to-[#7C8AA0]/5 rounded-2xl blur-md animate-pulse"></div>
            <div className="relative bg-[#161A21]/80 rounded-2xl p-6 border border-[#7C8AA0]/25">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  
                  <span className="text-amber-300 font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawModal.quantumNetwork' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C8AA0] to-transparent opacity-60"></div>
              </div>
              
              <div className="space-y-2">
                {/* TRC20 Network */}
                <button
                  type="button"
                  onClick={() => seleccionarRed('TRC20')}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-sm transition-all duration-300 ${
                    redSeleccionada === 'TRC20'
                      ? 'bg-amber-500/10 text-amber-300 border-2 border-[#7C8AA0]/30 shadow-lg '
                      : 'bg-[#0E1116]/80 text-[#7C8AA0] border border-[#7C8AA0]/20 hover:bg-[#161A21]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    
                    <span className="font-bold tracking-wider">
                      {intl.formatMessage({ id: 'components.withdrawModal.tronQuantumNetwork' })}
                    </span>
                  </div>
                </button>

                {/* APTOS Network */}
                <button
                  type="button"
                  onClick={() => seleccionarRed('APTOS')}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-sm transition-all duration-300 ${
                    redSeleccionada === 'APTOS'
                      ? 'bg-amber-500/10 text-amber-300 border-2 border-[#7C8AA0]/30 shadow-lg '
                      : 'bg-[#0E1116]/80 text-[#7C8AA0] border border-[#7C8AA0]/20 hover:bg-[#161A21]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">·</span>
                    <span className="font-bold tracking-wider">APTOS</span>
                  </div>
                </button>

                {/* ARBITRUM ONE Network */}
                <button
                  type="button"
                  onClick={() => seleccionarRed('ARBITRUM ONE')}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-sm transition-all duration-300 ${
                    redSeleccionada === 'ARBITRUM ONE'
                      ? 'bg-amber-500/10 text-amber-300 border-2 border-[#7C8AA0]/30 shadow-lg '
                      : 'bg-[#0E1116]/80 text-[#7C8AA0] border border-[#7C8AA0]/20 hover:bg-[#161A21]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🔵</span>
                    <span className="font-bold tracking-wider">ARBITRUM ONE</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Destination Coordinates */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-2xl blur-md animate-pulse"></div>
            <div className="relative bg-[#161A21]/80 rounded-2xl p-6 border border-red-500/40">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-red-400 text-lg">🗒️</span>
                  <span className="text-red-300 font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawModal.destinationCoordinates' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60"></div>
              </div>
              
              <textarea
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="w-full bg-[#0E1116]/80 border border-[#7C8AA0]/20 text-red-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono text-sm tracking-wider resize-none"
                placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterDestinationWallet' })}
                rows={2}
                style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}
              />
            </div>
          </div>

          {/* Security Authorization */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-md animate-pulse"></div>
            <div className="relative bg-[#161A21]/80 rounded-2xl p-6 border border-red-500/40">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  
                  <span className="text-red-300 font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawModal.securityAuthorization' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60"></div>
              </div>
              
              <input
                type="password"
                value={claveRetiro}
                onChange={(e) => setClaveRetiro(e.target.value)}
                className="w-full bg-[#0E1116]/80 border border-[#7C8AA0]/20 text-red-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 font-mono text-sm tracking-wider"
                placeholder={intl.formatMessage({ id: 'components.withdrawModal.enterExtractionKey' })}
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
              />
            </div>
          </div>

          {/* Extraction Protocol */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-md animate-pulse"></div>
            <div className="relative bg-[#161A21]/80 rounded-2xl p-4 border border-amber-500/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <PixelIcon name="clock" className="text-white w-5 h-5" />
                </div>
                <div>
                  <div className="text-amber-300 font-mono text-sm font-bold">
                    {intl.formatMessage({ id: 'components.withdrawModal.extractionProtocol' })}
                  </div>
                  <div className="text-amber-200 font-mono text-xs">
                    {intl.formatMessage({ id: 'components.withdrawModal.processingTime' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative rounded-2xl border-t border-slate-700/50 px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={solicitarRetiro}
            disabled={!montoRetiro || !wallet || !claveRetiro}
            variant={!montoRetiro || !wallet || !claveRetiro ? 'outline' : 'primary'}
            className="flex-1 py-3 font-mono tracking-wider"
          >
            <div className="flex items-center justify-center gap-2">
              
              <span className="font-bold">
                {intl.formatMessage({ id: 'components.withdrawModal.initiateExtraction' })}
              </span>
            </div>
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 font-mono tracking-wider"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">❌</span>
              <span className="font-bold">
                {intl.formatMessage({ id: 'components.withdrawModal.abortMission' })}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawModal; 
