import React from 'react';
import { useIntl } from 'react-intl';

interface HistorialGanancia {
  id: number;
  fecha: string;
  plan: string;
  ganancia: number;
  reclamado: boolean;
  user_id: string;
}

interface EarningsHistoryTableProps {
  historialGanancias: HistorialGanancia[];
}

export const EarningsHistoryTable: React.FC<EarningsHistoryTableProps> = ({ historialGanancias }) => {
  const intl = useIntl();

  return (
    <div className="w-full">
      {/* Minimal Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-display font-bold text-white tracking-wide flex items-center gap-2">
          <span>📜</span>
          {intl.formatMessage({ id: 'components.earningsHistoryTable.quantumHarvestTerminal' })}
        </h3>
        <span className="text-xs font-mono text-gray-500">
          {historialGanancias.length} {intl.formatMessage({ id: 'components.earningsHistoryTable.totalOperations' })}
        </span>
      </div>

      {/* Clean Table */}
      <div className="w-full overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsHistoryTable.harvestDate' })}
                </th>
                <th className="px-4 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsHistoryTable.miningModule' })}
                </th>
                <th className="px-4 py-3 text-right text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsHistoryTable.energyYield' })}
                </th>
                <th className="px-4 py-3 text-center text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {intl.formatMessage({ id: 'components.earningsHistoryTable.extractionStatus' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historialGanancias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
                    {intl.formatMessage({ id: 'components.earningsHistoryTable.noHarvestDataAvailable' })}
                  </td>
                </tr>
              ) : (
                historialGanancias.map((item, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-4 text-sm font-mono text-gray-400 group-hover:text-white transition-colors">
                      {item.fecha}
                    </td>
                    <td className="px-4 py-4 text-sm font-display text-gray-300 group-hover:text-white transition-colors">
                      {item.plan}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-[#F5A524] font-mono font-bold text-sm">
                        +{item.ganancia}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.reclamado ? (
                        <span className="text-xs font-mono text-[#F5A524]">
                          {intl.formatMessage({ id: 'components.earningsHistoryTable.extracted' })}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-yellow-500">
                          {intl.formatMessage({ id: 'components.earningsHistoryTable.pending' })}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
