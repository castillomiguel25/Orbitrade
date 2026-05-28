import { useIntl } from 'react-intl';

interface ReferralCommissionsInfoProps {
  porcentajeNivel1: string;
  porcentajeNivel2: string;
  totalGanado: number;
  totalReferidos: number;
}

export const ReferralCommissionsInfo: React.FC<ReferralCommissionsInfoProps> = ({
  porcentajeNivel1,
  porcentajeNivel2,
  totalGanado,
  totalReferidos,
}) => {
  const intl = useIntl();

  const levels = [
    {
      level: 1,
      percentage: porcentajeNivel1,
      title: intl.formatMessage({ id: 'components.referralCommissionsInfo.directAlliance' }),
      color: '#13f187',
    },
    {
      level: 2,
      percentage: porcentajeNivel2,
      title: intl.formatMessage({ id: 'components.referralCommissionsInfo.extendedFleet' }),
      color: '#00f5ff',
    },
    // {
    //   level: 3,
    //   percentage: porcentajeNivel3 || '1%',
    //   title: intl.formatMessage({ id: 'components.referralCommissionsInfo.deepFleet' }),
    //   color: '#dc95e6',
    // },
  ];

  return (
    <div className="space-y-4">
      {/* Commission Rates */}
      <div
        className="p-5 rounded-2xl"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(19, 241, 135, 0.2)',
        }}
      >
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
          {intl.formatMessage({ id: 'components.referralCommissionsInfo.commissionRate' })}s
        </div>

        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level.level} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
                  style={{
                    background: `${level.color}15`,
                    border: `1px solid ${level.color}40`,
                    color: level.color,
                  }}
                >
                  {level.level}
                </div>
                <span className="font-mono text-sm text-gray-300">{level.title}</span>
              </div>
              <span
                className="font-mono text-xl font-bold"
                style={{ color: level.color }}
              >
                {level.percentage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
