import React from 'react';
import { useIntl } from 'react-intl';

interface ReferralHowItWorksProps {
  porcentajeNivel1: string;
  porcentajeNivel2: string;
  porcentajeNivel3?: string;
}

export const ReferralHowItWorks: React.FC<ReferralHowItWorksProps> = ({
  porcentajeNivel1,
  porcentajeNivel2,
  porcentajeNivel3 = '1%',
}) => {
  const intl = useIntl();

  const protocolSteps = [
    {
      id: 1,
      icon: '📡',
      title: intl.formatMessage({ id: 'components.referralHowItWorks.transmitRecruitmentCode' }),
      description: intl.formatMessage({ id: 'components.referralHowItWorks.transmitRecruitmentCodeDesc' }),
      color: '#F5A524',
    },
    {
      id: 2,
      icon: '🚀',
      title: intl.formatMessage({ id: 'components.referralHowItWorks.allianceRegistration' }),
      description: intl.formatMessage({ id: 'components.referralHowItWorks.allianceRegistrationDesc' }),
      color: '#E6E8EC',
    },
    {
      id: 3,
      icon: '⚡',
      title: intl.formatMessage({ id: 'components.referralHowItWorks.level1Commission' }, { percentage: porcentajeNivel1 }),
      description: intl.formatMessage({ id: 'components.referralHowItWorks.level1CommissionDesc' }),
      color: '#F5A524',
      badge: intl.formatMessage({ id: 'components.referralHowItWorks.directRewards' }),
    },
    {
      id: 4,
      icon: '🌌',
      title: intl.formatMessage({ id: 'components.referralHowItWorks.level2Commission' }, { percentage: porcentajeNivel2 }),
      description: intl.formatMessage({ id: 'components.referralHowItWorks.level2CommissionDesc' }),
      color: '#7C8AA0',
      badge: intl.formatMessage({ id: 'components.referralHowItWorks.networkRewards' }),
    },
    {
      id: 5,
      icon: '🛰️',
      title: intl.formatMessage({ id: 'components.referralHowItWorks.level3Commission' }, { percentage: porcentajeNivel3 }),
      description: intl.formatMessage({ id: 'components.referralHowItWorks.level3CommissionDesc' }),
      color: '#E6E8EC',
      badge: intl.formatMessage({ id: 'components.referralHowItWorks.deepNetworkRewards' }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="relative p-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: '1px solid rgba(245, 165, 36, 0.3)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/50 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/50 rounded-tr" />

        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.3), rgba(245, 165, 36, 0.1))',
                border: '1px solid rgba(245, 165, 36, 0.4)',
              }}
            >
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="font-display text-xl font-bold tracking-wider">
              <span
                className="italic"
                style={{
                  background: 'linear-gradient(135deg, #F5A524, #7C8AA0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Alliance
              </span>{' '}
              <span className="text-[#E6E8EC] font-light">
                {intl.formatMessage({ id: 'components.referralHowItWorks.allianceExpansionProtocol' })}
              </span>
            </h2>
          </div>
          <div
            className="w-full h-[1px] mb-3"
            style={{ background: 'linear-gradient(90deg, transparent, #F5A524, transparent)' }}
          />
          <p className="font-mono text-xs text-amber-400/70 max-w-2xl mx-auto">
            {intl.formatMessage({ id: 'components.referralHowItWorks.executeMissionSequence' })}
          </p>
        </div>
      </div>

      {/* Protocol Steps */}
      <div className="space-y-3">
        {protocolSteps.map((step, index) => (
          <div
            key={step.id}
            className="relative p-4 rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
              border: `1px solid ${step.color}30`,
            }}
          >
            {/* Corner brackets */}
            <div
              className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 rounded-tl"
              style={{ borderColor: `${step.color}50` }}
            />
            <div
              className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 rounded-tr"
              style={{ borderColor: `${step.color}50` }}
            />

            {/* Connection line to next step */}
            {index < protocolSteps.length - 1 && (
              <div
                className="absolute left-7 -bottom-3 w-[2px] h-6 z-10"
                style={{
                  background: `linear-gradient(180deg, ${step.color}50, ${protocolSteps[index + 1].color}50)`,
                }}
              />
            )}

            <div className="flex items-start gap-4">
              {/* Step Icon & Number */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `1px solid ${step.color}40`,
                    boxShadow: `0 0 15px ${step.color}20`,
                  }}
                >
                  <span className="text-xl">{step.icon}</span>
                </div>
                <div
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  <span className="font-mono text-[10px] font-bold" style={{ color: step.color }}>
                    {intl.formatMessage({ id: 'components.referralHowItWorks.step' }, { number: step.id })}
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <h3 className="font-display text-sm font-bold mb-1" style={{ color: step.color }}>
                    {step.title}
                  </h3>
                  <div className="w-16 h-[2px]" style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
                </div>

                <p className="font-mono text-xs text-[#7C8AA0] leading-relaxed mb-3">{step.description}</p>

                {/* Status & Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: step.color, boxShadow: `0 0 6px ${step.color}` }}
                    />
                    <span className="font-mono text-[10px]" style={{ color: `${step.color}90` }}>
                      {intl.formatMessage({ id: 'components.referralHowItWorks.protocolActive' })}
                    </span>
                  </div>
                  {step.badge && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{
                        background: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      <span className="text-[10px]">{step.id === 3 ? '💰' : step.id === 4 ? '🌟' : '🛰️'}</span>
                      <span className="font-mono text-[10px]" style={{ color: step.color }}>
                        {step.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Briefing */}
      <div
        className="relative p-5 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.95), rgba(22, 26, 33, 0.9))',
          border: '1px solid rgba(230, 232, 236, 0.3)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-plasma-pink/50 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-plasma-pink/50 rounded-tr" />

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[#E6E8EC] text-lg">📋</span>
            <span className="font-mono text-xs text-[#E6E8EC] uppercase tracking-wider">
              {intl.formatMessage({ id: 'components.referralHowItWorks.missionBriefing' })}
            </span>
          </div>
          <div
            className="w-full h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #E6E8EC, transparent)' }}
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: intl.formatMessage({ id: 'components.referralHowItWorks.automaticEarnings' }),
              description: intl.formatMessage({ id: 'components.referralHowItWorks.automaticEarningsDesc' }),
              color: '#7C8AA0',
            },
            {
              title: intl.formatMessage({ id: 'components.referralHowItWorks.unlimitedExpansion' }),
              description: intl.formatMessage({ id: 'components.referralHowItWorks.unlimitedExpansionDesc' }),
              color: '#E6E8EC',
            },
            {
              title: intl.formatMessage({ id: 'components.referralHowItWorks.tripleCommissionSystem' }),
              description: intl.formatMessage(
                { id: 'components.referralHowItWorks.tripleCommissionSystemDesc' },
                { level1: porcentajeNivel1, level2: porcentajeNivel2, level3: porcentajeNivel3 }
              ),
              color: '#F5A524',
            },
            {
              title: intl.formatMessage({ id: 'components.referralHowItWorks.secureProtocol' }),
              description: intl.formatMessage({ id: 'components.referralHowItWorks.secureProtocolDesc' }),
              color: '#F5A524',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg"
              style={{
                background: `${item.color}08`,
                border: `1px solid ${item.color}20`,
              }}
            >
              <h4 className="font-display text-xs font-bold mb-1" style={{ color: item.color }}>
                {item.title}
              </h4>
              <p className="font-mono text-[10px] leading-relaxed" style={{ color: `${item.color}80` }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Station */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 165, 36, 0.15), rgba(124, 138, 160, 0.1))',
            border: '1px solid rgba(245, 165, 36, 0.3)',
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
          />
          <span className="font-mono text-xs text-amber-400 tracking-wider">
            {intl.formatMessage({ id: 'components.referralHowItWorks.allianceExpansionSystemsReady' })}
          </span>
        </div>
      </div>
    </div>
  );
};
