import { Deposit } from '@/app/types/deposit';
import { PixelIcon } from '@/app/components/PixelIcon';
import { useIntl } from 'react-intl';

interface DepositHistoryProps {
  historialDepositos: Deposit[];
}

export function DepositHistory({ historialDepositos }: DepositHistoryProps) {
  const intl = useIntl();
  
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'Completado':
        return intl.formatMessage({ id: 'components.depositHistory.completed' });
      case 'Pendiente':
        return intl.formatMessage({ id: 'components.depositHistory.pending' });
      case 'Procesando':
        return intl.formatMessage({ id: 'components.depositHistory.processing' });
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      case 'Pendiente':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Procesando':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="relative">
      <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 min-h-[420px] flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-cyan-400 text-lg">📋</span>
            <span className="text-cyan-300 font-mono text-lg tracking-wider">{intl.formatMessage({ id: 'components.depositHistory.missionArchive' })}</span>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
        </div>

        {historialDepositos.length > 0 ? (
          <div className="flex-1 space-y-4 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-auto max-h-[280px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-900/90">
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.depositHistory.date' })}</th>
                    <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.depositHistory.module' })}</th>
                    <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.depositHistory.fuel' })}</th>
                    <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.depositHistory.status' })}</th>
                  </tr>
                </thead>
                <tbody>
                  {historialDepositos.slice(0, 6).map((deposito, index) => (
                    <tr key={deposito.id} className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                      <td className="py-3 px-2 text-slate-300 font-mono text-xs">{deposito.fecha.split(' ')[0]}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-red-300 font-mono text-xs font-bold">{deposito.plan}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-300 font-mono text-xs font-bold">{deposito.monto}</span>
                          <span className="text-slate-400 font-mono text-xs">USDT</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border font-mono text-xs ${getStatusColor(deposito.estado)}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                          <span>{getStatusTranslation(deposito.estado).substring(0, 8)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 overflow-auto max-h-[280px]">
              {historialDepositos.slice(0, 4).map((deposito) => (
                <div key={deposito.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-300 font-mono text-xs font-bold">{deposito.plan}</span>
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border font-mono text-xs ${getStatusColor(deposito.estado)}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                      <span>{getStatusTranslation(deposito.estado).substring(0, 6)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-slate-400 font-mono text-xs mb-1">{intl.formatMessage({ id: 'components.depositHistory.fuel' })}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-300 font-mono text-xs font-bold">{deposito.monto}</span>
                        <span className="text-slate-400 font-mono text-xs">USDT</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-mono text-xs mb-1">{intl.formatMessage({ id: 'components.depositHistory.date' })}</div>
                      <div className="text-slate-300 font-mono text-xs">{deposito.fecha.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-3 gap-2 mt-auto">
              <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-green-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.depositHistory.total' })}</div>
                <div className="text-green-300 font-mono text-lg font-bold">{historialDepositos.length}</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="text-blue-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.depositHistory.active' })}</div>
                <div className="text-blue-300 font-mono text-lg font-bold">
                  {historialDepositos.filter(d => d.estado === 'Completado').length}
                </div>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="text-red-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.depositHistory.pending' })}</div>
                <div className="text-red-300 font-mono text-lg font-bold">
                  {historialDepositos.filter(d => d.estado === 'Pendiente').length}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center text-center py-8">
            <div className="relative inline-block mb-4 mx-auto">
              <div className="absolute -inset-3 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                <PixelIcon name="archive" className="text-slate-400 w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-slate-300 font-mono text-lg font-bold tracking-wider">{intl.formatMessage({ id: 'components.depositHistory.noMissionsFound' })}</h3>
                <p className="text-slate-400 font-mono text-sm">{intl.formatMessage({ id: 'components.depositHistory.missionArchiveEmpty' })}</p>
              </div>
              
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 max-w-sm mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400 text-lg">🚀</span>
                  <span className="text-cyan-300 font-mono text-sm tracking-wider">{intl.formatMessage({ id: 'components.depositHistory.initiateFirstMission' })}</span>
                </div>
                <p className="text-slate-300 font-mono text-xs leading-relaxed">
                  {intl.formatMessage({ id: 'components.depositHistory.beginMiningJourney' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 