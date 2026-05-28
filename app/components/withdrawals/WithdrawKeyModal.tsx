import React from 'react';
import { Button } from '@/app/components/Button';
import { PixelIcon } from '@/app/components/PixelIcon';
import Modal from '@/app/components/Modal';
import { useIntl } from 'react-intl';

interface WithdrawKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  claveActual: string;
  setClaveActual: (value: string) => void;
  nuevaClave: string;
  setNuevaClave: (value: string) => void;
  confirmarClave: string;
  setConfirmarClave: (value: string) => void;
  configurarClave: () => void;
}

const WithdrawKeyModal: React.FC<WithdrawKeyModalProps> = ({
  isOpen,
  onClose,
  claveActual,
  setClaveActual,
  nuevaClave,
  setNuevaClave,
  confirmarClave,
  setConfirmarClave,
  configurarClave
}) => {
  const intl = useIntl();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={intl.formatMessage({ id: 'components.withdrawKeyModal.title' })}
      maxWidth="lg"
    >
      <div className="p-6">
        {/* Security Configuration */}
        <div className="space-y-6">
          {/* Current Authorization */}
          <div className="relative">
            <div className="relative bg-black rounded-2xl p-6 border border-white/10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-white text-lg">🔑</span>
                  <span className="text-white font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawKeyModal.currentKey' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-white/10"></div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="password"
                  value={claveActual}
                  onChange={(e) => setClaveActual(e.target.value)}
                  className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                  placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.enterCurrentKey' })}
                />
                <div className="text-gray-400 font-mono text-xs text-center">
                  {intl.formatMessage({ id: 'components.withdrawKeyModal.authVerificationRequired' })}
                </div>
              </div>
            </div>
          </div>

          {/* New Authorization */}
          <div className="relative">
            <div className="relative bg-black rounded-2xl p-6 border border-white/10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="text-white text-lg">🆕</span>
                  <span className="text-white font-mono text-sm tracking-wider">
                    {intl.formatMessage({ id: 'components.withdrawKeyModal.newKey' })}
                  </span>
                </div>
                <div className="w-full h-[1px] bg-white/10"></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={nuevaClave}
                    onChange={(e) => setNuevaClave(e.target.value)}
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                    placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.enterNewKey' })}
                  />
                </div>
                
                <div>
                  <input
                    type="password"
                    value={confirmarClave}
                    onChange={(e) => setConfirmarClave(e.target.value)}
                    className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-white font-mono text-sm tracking-wider"
                    placeholder={intl.formatMessage({ id: 'components.withdrawKeyModal.confirmNewKey' })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Code Strength Indicator */}
          {nuevaClave && (
            <div className="relative">
              <div className="relative bg-black rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-white font-mono text-sm">⚡</span>
                  </div>
                  <div>
                    <div className="text-gray-400 font-mono text-xs">
                      {intl.formatMessage(
                        { id: 'components.withdrawKeyModal.codeLengthStatus' },
                        {
                          length: nuevaClave.length,
                          status: nuevaClave.length >= 8 
                            ? intl.formatMessage({ id: 'components.withdrawKeyModal.secure' }) 
                            : intl.formatMessage({ id: 'components.withdrawKeyModal.weak' })
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative border-t border-white/10 px-8 py-6 bg-black">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={configurarClave}
            disabled={!nuevaClave || !confirmarClave}
            className={`flex-1 py-3 font-mono tracking-wider ${!nuevaClave || !confirmarClave ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-gray-200'} rounded-xl transition-colors font-bold`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">💾</span>
              <span className="font-bold">
                {intl.formatMessage({ id: 'components.withdrawKeyModal.configureKey' })}
              </span>
            </div>
          </Button>
          
          <Button
            onClick={onClose}
            className="flex-1 py-3 font-mono tracking-wider bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-xl transition-colors font-bold"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">❌</span>
              <span className="font-bold">
                {intl.formatMessage({ id: 'components.withdrawKeyModal.cancel' })}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawKeyModal; 