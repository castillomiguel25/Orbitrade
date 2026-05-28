import React from 'react';
import { useIntl } from 'react-intl';

type Referral = {
  id: string;
  nombre: string;
  fecha: string;
  nivel: number;
  depositoActivo: boolean;
  totalGanado: string;
};

interface ReferralTableProps {
  referrals: Referral[];
}

const getLevelColor = (nivel: number) => {
  switch (nivel) {
    case 1:
      return { color: '#13f187', name: 'miner-green' };
    case 2:
      return { color: '#00f5ff', name: 'cyber-cyan' };
    case 3:
      return { color: '#dc95e6', name: 'plasma-pink' };
    default:
      return { color: '#13f187', name: 'miner-green' };
  }
};

export const ReferralTable: React.FC<ReferralTableProps> = ({ referrals }) => {
  const intl = useIntl();

  return (
    <div className="space-y-4">
      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[
          {
            value: referrals.length,
            label: intl.formatMessage({ id: 'components.referralTable.totalAllies' }),
            color: '#13f187',
          },
          {
            value: referrals.filter((r) => r.depositoActivo).length,
            label: intl.formatMessage({ id: 'components.referralTable.activeMiners' }),
            color: '#c8ff00',
          },
          {
            value: referrals.filter((r) => r.nivel === 1).length,
            label: intl.formatMessage({ id: 'components.referralTable.level1' }),
            color: '#13f187',
          },
          {
            value: referrals.filter((r) => r.nivel === 2).length,
            label: intl.formatMessage({ id: 'components.referralTable.level2' }),
            color: '#00f5ff',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="relative p-3 rounded-lg overflow-hidden text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
              border: `1px solid ${stat.color}30`,
            }}
          >
            <div
              className="absolute top-1 left-1 w-2 h-2 border-t border-l rounded-tl"
              style={{ borderColor: `${stat.color}50` }}
            />
            <div
              className="text-xl font-display font-bold"
              style={{
                background: `linear-gradient(135deg, ${stat.color}, #00f5ff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {stat.value}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: `${stat.color}80` }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Roster */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(10, 36, 25, 0.9))',
          border: '1px solid rgba(19, 241, 135, 0.2)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-miner-green/50 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-miner-green/50 rounded-tr" />

        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'rgba(19, 241, 135, 0.2)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.3), rgba(19, 241, 135, 0.1))',
                border: '1px solid rgba(19, 241, 135, 0.4)',
              }}
            >
              <span className="text-lg">👥</span>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-wider">
                <span
                  className="italic"
                  style={{
                    background: 'linear-gradient(135deg, #13f187, #00f5ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Alliance
                </span>{' '}
                <span className="text-stellar-white font-light">
                  {intl.formatMessage({ id: 'components.referralTable.allianceFleetStatus' })}
                </span>
              </h2>
            </div>
          </div>
        </div>

        {referrals.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(19, 241, 135, 0.1), rgba(220, 149, 230, 0.1))',
                border: '1px dashed rgba(19, 241, 135, 0.3)',
              }}
            >
              <span className="text-4xl">🚀</span>
            </div>
            <h3 className="font-display text-lg font-bold text-cosmic-gray mb-2">
              {intl.formatMessage({ id: 'components.referralTable.fleetAwaitingCommanders' })}
            </h3>
            <p className="font-mono text-xs text-cosmic-gray/70 max-w-md mx-auto mb-4">
              {intl.formatMessage({ id: 'components.referralTable.fleetReadyForExpansion' })}
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(19, 241, 135, 0.15)',
                border: '1px solid rgba(19, 241, 135, 0.3)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#13f187', boxShadow: '0 0 6px #13f187' }}
              />
              <span className="font-mono text-xs text-miner-green">
                {intl.formatMessage({ id: 'components.referralTable.recruitmentSystemsActive' })}
              </span>
            </div>
          </div>
        ) : (
          /* Table Content */
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div
              className="hidden md:grid grid-cols-12 gap-4 p-3 text-xs font-mono uppercase tracking-wider border-b"
              style={{ borderColor: 'rgba(19, 241, 135, 0.1)', background: 'rgba(10, 10, 15, 0.5)' }}
            >
              <div className="col-span-4 text-miner-green">
                {intl.formatMessage({ id: 'components.referralTable.commanderId' })}
              </div>
              <div className="col-span-2 text-center text-cyber-cyan">
                {intl.formatMessage({ id: 'components.referralTable.rank' })}
              </div>
              <div className="col-span-2 text-center text-plasma-pink">
                {intl.formatMessage({ id: 'components.referralTable.joined' })}
              </div>
              <div className="col-span-2 text-center text-bio-yellow">
                {intl.formatMessage({ id: 'components.referralTable.status' })}
              </div>
              <div className="col-span-2 text-center text-miner-green">
                {intl.formatMessage({ id: 'components.referralTable.earnings' })}
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y" style={{ borderColor: 'rgba(19, 241, 135, 0.05)' }}>
              {referrals.map((referido) => {
                const levelColor = getLevelColor(referido.nivel);
                return (
                  <div
                    key={referido.id}
                    className="p-3 transition-all duration-300 hover:bg-miner-green/5"
                  >
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      {/* Commander ID */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-stellar-white"
                            style={{
                              background: `linear-gradient(135deg, ${levelColor.color}30, ${levelColor.color}10)`,
                              border: `1px solid ${levelColor.color}40`,
                            }}
                          >
                            {referido.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-deep-space ${
                              referido.depositoActivo ? 'animate-pulse' : ''
                            }`}
                            style={{
                              backgroundColor: referido.depositoActivo ? '#13f187' : '#6b7280',
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-mono text-sm text-stellar-white">{referido.nombre}</div>
                          <div className="font-mono text-[10px] text-cosmic-gray">
                            ID: {referido.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>

                      {/* Rank */}
                      <div className="col-span-2 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold"
                          style={{
                            background: `${levelColor.color}15`,
                            border: `1px solid ${levelColor.color}40`,
                            color: levelColor.color,
                          }}
                        >
                          <span>{referido.nivel === 1 ? '⭐' : referido.nivel === 2 ? '🌟' : '🛰️'}</span>
                          LVL {referido.nivel}
                        </span>
                      </div>

                      {/* Joined */}
                      <div className="col-span-2 text-center">
                        <span className="font-mono text-xs text-cosmic-gray">{referido.fecha}</span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-center">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold"
                          style={{
                            background: referido.depositoActivo ? 'rgba(19, 241, 135, 0.15)' : 'rgba(200, 255, 0, 0.15)',
                            border: referido.depositoActivo
                              ? '1px solid rgba(19, 241, 135, 0.4)'
                              : '1px solid rgba(200, 255, 0, 0.4)',
                            color: referido.depositoActivo ? '#13f187' : '#c8ff00',
                          }}
                        >
                          <span>{referido.depositoActivo ? '⚡' : '⏳'}</span>
                          {referido.depositoActivo
                            ? intl.formatMessage({ id: 'components.referralTable.mining' })
                            : intl.formatMessage({ id: 'components.referralTable.standby' })}
                        </span>
                      </div>

                      {/* Earnings */}
                      <div className="col-span-2 text-center">
                        <div
                          className="font-mono text-sm font-bold"
                          style={{
                            color: parseFloat(referido.totalGanado) > 0 ? '#13f187' : '#6b7280',
                          }}
                        >
                          {(() => {
                            const num = parseFloat(referido.totalGanado);
                            if (isNaN(num) || num === 0) return '0.00';
                            if (referido.nivel === 1) return (num * 0.06).toFixed(2);
                            if (referido.nivel === 2) return (num * 0.03).toFixed(2);
                            return '0.00';
                          })()}
                        </div>
                        <div className="font-mono text-[10px] text-cosmic-gray">USDT</div>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3 h-full rounded-full flex-shrink-0"
                          style={{ backgroundColor: levelColor.color }}
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stellar-white text-sm"
                                style={{
                                  background: `linear-gradient(135deg, ${levelColor.color}30, ${levelColor.color}10)`,
                                  border: `1px solid ${levelColor.color}40`,
                                }}
                              >
                                {referido.nombre.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-mono text-sm text-stellar-white">{referido.nombre}</div>
                                <div className="font-mono text-[10px] text-cosmic-gray">{referido.fecha}</div>
                              </div>
                            </div>
                            <span
                              className="px-2 py-1 rounded-full text-[10px] font-mono font-bold"
                              style={{
                                background: `${levelColor.color}15`,
                                border: `1px solid ${levelColor.color}40`,
                                color: levelColor.color,
                              }}
                            >
                              LVL {referido.nivel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono"
                              style={{
                                background: referido.depositoActivo ? 'rgba(19, 241, 135, 0.15)' : 'rgba(200, 255, 0, 0.15)',
                                color: referido.depositoActivo ? '#13f187' : '#c8ff00',
                              }}
                            >
                              <span>{referido.depositoActivo ? '⚡' : '⏳'}</span>
                              {referido.depositoActivo
                                ? intl.formatMessage({ id: 'components.referralTable.mining' })
                                : intl.formatMessage({ id: 'components.referralTable.standby' })}
                            </span>
                            <div className="text-right">
                              <div className="font-mono text-sm font-bold text-miner-green">
                                {(() => {
                                  const num = parseFloat(referido.totalGanado);
                                  if (isNaN(num) || num === 0) return '0.00';
                                  if (referido.nivel === 1) return (num * 0.06).toFixed(2);
                                  if (referido.nivel === 2) return (num * 0.03).toFixed(2);
                                  return '0.00';
                                })()}{' '}
                                USDT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        {referrals.length > 0 && (
          <div className="p-3 border-t" style={{ borderColor: 'rgba(19, 241, 135, 0.2)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: '#13f187', boxShadow: '0 0 6px #13f187' }}
                />
                <span className="font-mono text-xs text-miner-green/70">
                  {intl.formatMessage({ id: 'components.referralTable.fleetOperational' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-cosmic-gray">
                  {referrals.filter((r) => r.depositoActivo).length}/{referrals.length}{' '}
                  {intl.formatMessage({ id: 'components.referralTable.active' })}
                </span>
                <div className="flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: '#00f5ff', boxShadow: '0 0 4px #00f5ff' }}
                  />
                  <span className="font-mono text-[10px] text-cyber-cyan/70">
                    {intl.formatMessage({ id: 'components.referralTable.systemsNominal' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
