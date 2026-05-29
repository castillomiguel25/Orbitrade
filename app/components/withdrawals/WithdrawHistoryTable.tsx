import { useIntl } from 'react-intl';

interface Retiro {
  id: string;
  fecha: string;
  monto: number;
  wallet: string;
  red: string;
  estado: 'Completado' | 'Procesando' | string;
}

interface WithdrawHistoryTableProps {
  historialRetiros: Retiro[];
}

const WithdrawHistoryTable: React.FC<WithdrawHistoryTableProps> = ({ historialRetiros }) => {
  const intl = useIntl();

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'Completado':
        return intl.formatMessage({ id: 'components.withdrawHistoryTable.completed' });
      case 'Procesando':
        return intl.formatMessage({ id: 'components.withdrawHistoryTable.processing' });
      default:
        return status;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completado':
        return {
          bg: 'rgba(245, 165, 36, 0.1)',
          border: 'rgba(245, 165, 36, 0.3)',
          color: '#F5A524',
          dot: '#F5A524',
        };
      case 'Procesando':
        return {
          bg: 'rgba(245, 165, 36, 0.1)',
          border: 'rgba(245, 165, 36, 0.3)',
          color: '#F5A524',
          dot: '#F5A524',
        };
      default:
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          dot: '#ef4444',
        };
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network.toUpperCase()) {
      case 'APTOS':
        return '#7C8AA0';
      case 'TRC20':
        return '#E6E8EC';
      default:
        return '#F5A524';
    }
  };

  if (historialRetiros.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(230, 232, 236, 0.1)',
            border: '1px solid rgba(230, 232, 236, 0.3)',
          }}
        >
          <span className="text-4xl">📭</span>
        </div>
        <h3 className="text-white font-display font-bold text-lg mb-2">
          {intl.formatMessage({ id: 'components.withdrawHistoryTable.noExtractionsFound' })}
        </h3>
        <p className="text-gray-500 font-mono text-sm max-w-sm mx-auto">
          {intl.formatMessage({ id: 'components.withdrawHistoryTable.extractionArchiveEmpty' })}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
              }}
            >
              <th className="text-left py-3 px-4 text-gray-400 font-mono text-xs uppercase tracking-wider rounded-l-xl">
                {intl.formatMessage({ id: 'components.withdrawHistoryTable.date' })}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-mono text-xs uppercase tracking-wider">
                {intl.formatMessage({ id: 'components.withdrawHistoryTable.energy' })}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-mono text-xs uppercase tracking-wider">
                {intl.formatMessage({ id: 'components.withdrawHistoryTable.network' })}
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-mono text-xs uppercase tracking-wider rounded-r-xl">
                {intl.formatMessage({ id: 'components.withdrawHistoryTable.status' })}
              </th>
            </tr>
          </thead>
          <tbody>
            {historialRetiros.map((retiro, index) => {
              const statusStyles = getStatusStyles(retiro.estado);
              const networkColor = getNetworkColor(retiro.red);

              return (
                <tr
                  key={retiro.id}
                  className="transition-all duration-300 hover:bg-white/5"
                  style={{
                    borderBottom: index < historialRetiros.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                >
                  <td className="py-4 px-4">
                    <span className="text-gray-300 font-mono text-sm">
                      {retiro.fecha.split(' ')[0]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white font-mono text-sm font-bold">
                      {Number(retiro.monto).toFixed(2)}{' '}
                      <span className="text-gray-500 font-normal">USDT</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-bold"
                      style={{
                        background: `${networkColor}15`,
                        border: `1px solid ${networkColor}40`,
                        color: networkColor,
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: networkColor }} />
                      {retiro.red}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
                      style={{
                        background: statusStyles.bg,
                        border: `1px solid ${statusStyles.border}`,
                        color: statusStyles.color,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: statusStyles.dot }}
                      />
                      {getStatusTranslation(retiro.estado)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {historialRetiros.map((retiro) => {
          const statusStyles = getStatusStyles(retiro.estado);
          const networkColor = getNetworkColor(retiro.red);

          return (
            <div
              key={retiro.id}
              className="p-4 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-mono text-lg font-bold">
                  {Number(retiro.monto).toFixed(2)}{' '}
                  <span className="text-gray-500 text-sm font-normal">USDT</span>
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
                  style={{
                    background: statusStyles.bg,
                    border: `1px solid ${statusStyles.border}`,
                    color: statusStyles.color,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: statusStyles.dot }}
                  />
                  {getStatusTranslation(retiro.estado)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-mono text-sm">
                  {retiro.fecha.split(' ')[0]}
                </span>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-xs font-bold"
                  style={{
                    background: `${networkColor}15`,
                    border: `1px solid ${networkColor}40`,
                    color: networkColor,
                  }}
                >
                  {retiro.red}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="text-center p-4 rounded-xl"
          style={{
            background: 'rgba(230, 232, 236, 0.08)',
            border: '1px solid rgba(230, 232, 236, 0.2)',
          }}
        >
          <div className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawHistoryTable.total' })}
          </div>
          <div className="text-[#E6E8EC] font-mono text-xl font-bold">
            {historialRetiros.length}
          </div>
        </div>

        <div
          className="text-center p-4 rounded-xl"
          style={{
            background: 'rgba(245, 165, 36, 0.08)',
            border: '1px solid rgba(245, 165, 36, 0.2)',
          }}
        >
          <div className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawHistoryTable.completed' })}
          </div>
          <div className="text-amber-400 font-mono text-xl font-bold">
            {historialRetiros.filter(r => r.estado === 'Completado').length}
          </div>
        </div>

        <div
          className="text-center p-4 rounded-xl"
          style={{
            background: 'rgba(245, 165, 36, 0.08)',
            border: '1px solid rgba(245, 165, 36, 0.2)',
          }}
        >
          <div className="text-gray-500 font-mono text-[10px] uppercase tracking-wider mb-1">
            {intl.formatMessage({ id: 'components.withdrawHistoryTable.processing' })}
          </div>
          <div className="text-amber-400 font-mono text-xl font-bold">
            {historialRetiros.filter(r => r.estado === 'Procesando').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawHistoryTable;
