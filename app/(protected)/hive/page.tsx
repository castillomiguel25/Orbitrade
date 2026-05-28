"use client";

import { useState, useEffect } from 'react';
import { ReferralLinkBox } from '@/app/components/referrals/ReferralLinkBox';
import { ReferralCommissionsInfo } from '@/app/components/referrals/ReferralCommissionsInfo';
import { ReferralTable } from '@/app/components/referrals/ReferralTable';
import { useReferrals } from '@/app/hooks/useReferrals';
import { useIntl } from 'react-intl';
import { showToast } from '@/app/utils/toast';

export default function HivePage() {
  const {
    copiado,
    referralLink,
    glowEffect,
    referrals,
    error,
    loading,
    refetch,
    copiarEnlace,
    descargarQR,
    totalGanado,
    porcentajeNivel1,
    porcentajeNivel2,
  } = useReferrals();

  const intl = useIntl();
  const [activeSection, setActiveSection] = useState<'overview' | 'rewards' | 'members'>('overview');
  const [newReferralCountLevel1, setNewReferralCountLevel1] = useState<number>(0);
  const [newReferralCountLevel2, setNewReferralCountLevel2] = useState<number>(0);
  const [newDepositsTotalAmountLevel1, setNewDepositsTotalAmountLevel1] = useState<number>(0);
  const [newDepositsTotalAmountLevel2, setNewDepositsTotalAmountLevel2] = useState<number>(0);

  useEffect(() => {
    fetch('/api/referrals/new-stats', { credentials: 'include', cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data?.newReferralCountLevel1) setNewReferralCountLevel1(data.newReferralCountLevel1);
        if (data?.newReferralCountLevel2) setNewReferralCountLevel2(data.newReferralCountLevel2);
        if (data?.newDepositsTotalAmountLevel1) setNewDepositsTotalAmountLevel1(data.newDepositsTotalAmountLevel1);
        if (data?.newDepositsTotalAmountLevel2) setNewDepositsTotalAmountLevel2(data.newDepositsTotalAmountLevel2);
      })
      .catch(() => {});
  }, []);

  // Calculations for rewards
  const directRefs = referrals.filter(r => r.nivel === 1);
  const indirectRefs = referrals.filter(r => r.nivel === 2);

  const directActive = directRefs.filter(r => r.depositoActivo);
  const indirectActive = indirectRefs.filter(r => r.depositoActivo);

  const directActiveCount = directActive.length;
  const indirectActiveCount = indirectActive.length;

  const sumAmounts = (items: typeof referrals) =>
    items.reduce((acc, r) => acc + (parseFloat(r.totalGanado) || 0), 0);
  const sumFrozen = (items: typeof referrals) =>
    items.reduce((acc, r) => acc + (parseFloat(r.frozenbalanceAdjusted || r.frozenbalance || '0') || 0), 0);

  const directActiveSum = sumAmounts(directActive);
  const indirectActiveSum = sumAmounts(indirectActive);
  const investedTotalSum = sumFrozen([...directActive, ...indirectActive]);
  const levels12TotalInvested = sumFrozen([...directRefs, ...indirectRefs]);
  const totalFrozenLevel1And2 = sumFrozen([...directRefs, ...indirectRefs]);
  const totalFrozenLevel1 = sumFrozen(directActive);
  const totalFrozenLevel2 = sumFrozen(indirectActive);

  const salaryRewards = [
    { rank: 1, referrals: 10, amount: 300, salary: 20 },
    { rank: 2, referrals: 30, amount: 2500, salary: 50 },
    { rank: 3, referrals: 50, amount: 17000, salary: 220 },
    { rank: 4, referrals: 100, amount: 60000, salary: 700 },
    { rank: 5, referrals: 200, amount: 160000, salary: 2000 },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-void-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at top left, #0d1117 0%, #000000 70%)',
          }}
        />
        {/* Hexagon pattern for hive theme */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23dc95e6' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(220, 149, 230, 0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 lg:p-8">
        {!!error && (
          <div
            className="mb-6 rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
            }}
          >
            <div className="text-sm font-mono text-red-300">{error}</div>
            <button
              onClick={() => refetch()}
              className="text-xs font-mono font-bold tracking-wider px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fecaca',
              }}
              type="button"
            >
              RECARGAR
            </button>
          </div>
        )}

        {loading && referrals.length === 0 && (
          <div
            className="mb-6 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(0, 245, 255, 0.2)',
            }}
          >
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-sm font-mono text-cyan-200">Cargando referidos…</div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-black tracking-wider">
                <span className="text-white">{intl.formatMessage({ id: 'pages.hive.title' })}</span>{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #dc95e6, #00f5ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {intl.formatMessage({ id: 'pages.hive.network' })}
                </span>
              </h1>
              <p className="text-gray-500 font-mono text-sm mt-1">
                {intl.formatMessage({ id: 'pages.hive.subtitle' })}
              </p>
            </div>

            {/* Stats Summary */}
            <div
              className="flex items-center gap-4 px-6 py-3 rounded-2xl"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(220, 149, 230, 0.3)',
              }}
            >
              <div className="text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{intl.formatMessage({ id: 'pages.hive.stats.members' })}</div>
                <div className="text-xl font-mono font-bold text-plasma-pink">{referrals.length}</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{intl.formatMessage({ id: 'pages.hive.stats.collected' })}</div>
                <div className="text-xl font-mono font-bold text-miner-green">${totalGanado.toFixed(2)}</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{intl.formatMessage({ id: 'pages.hive.stats.activated' })}</div>
                <div className="text-xl font-mono font-bold text-cyber-cyan">${levels12TotalInvested.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl font-mono text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: intl.formatMessage({ id: 'pages.hive.tabs.overview' }), icon: '🌐' },
            { id: 'rewards', label: intl.formatMessage({ id: 'pages.hive.tabs.rewards' }), icon: '🏆' },
            { id: 'members', label: intl.formatMessage({ id: 'pages.hive.tabs.members' }), icon: '👥' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-sm transition-all whitespace-nowrap"
              style={{
                background: activeSection === tab.id ? 'rgba(220, 149, 230, 0.15)' : 'rgba(0, 0, 0, 0.4)',
                border: activeSection === tab.id ? '1px solid rgba(220, 149, 230, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeSection === tab.id ? '#dc95e6' : '#9ca3af',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Referral Link & Commissions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ReferralLinkBox
                referralLink={referralLink}
                copiado={copiado}
                copiarEnlace={copiarEnlace}
                glowEffect={glowEffect}
                descargarQR={descargarQR}
              />
              <ReferralCommissionsInfo
                porcentajeNivel1={porcentajeNivel1}
                porcentajeNivel2={porcentajeNivel2}
                totalGanado={totalGanado}
                totalReferidos={referrals.length}
              />
            </div>

            {/* Recent Activity */}
            {/* <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 15, 20, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
                border: '1px solid rgba(0, 245, 255, 0.2)',
              }}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-display font-bold">
                  <span className="text-white">{intl.formatMessage({ id: 'pages.hive.recentActivity' })}</span>{' '}
                  <span className="text-cyber-cyan">{intl.formatMessage({ id: 'pages.hive.activity' })}</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: intl.formatMessage({ id: 'pages.referrals.newStats.level1.count' }), value: newReferralCountLevel1, color: '#13f187' },
                    { label: intl.formatMessage({ id: 'pages.referrals.newStats.level1.amount' }), value: `$${newDepositsTotalAmountLevel1.toFixed(2)}`, color: '#00f5ff' },
                    { label: intl.formatMessage({ id: 'pages.referrals.newStats.level2.count' }), value: newReferralCountLevel2, color: '#dc95e6' },
                    { label: intl.formatMessage({ id: 'pages.referrals.newStats.level2.amount' }), value: `$${newDepositsTotalAmountLevel2.toFixed(2)}`, color: '#c8ff00' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl text-center"
                      style={{
                        background: `${item.color}08`,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">
                        {item.label}
                      </div>
                      <div className="text-2xl font-mono font-bold" style={{ color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Monthly Bonuses */}
            {/* <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 15, 20, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
                border: '1px solid rgba(19, 241, 135, 0.2)',
              }}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-display font-bold">
                  <span className="text-white">Monthly</span>{' '}
                  <span className="text-miner-green">Bonuses</span>
                </h3>
                <p className="text-gray-500 font-mono text-xs mt-1">
                  {intl.formatMessage({ id: 'pages.referrals.monthlyBonuses.note' })}
                </p>
              </div>
              <div className="p-6 overflow-x-auto">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                  {monthlyBonuses.map((bonus, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl text-center"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(19, 241, 135, 0.2)',
                      }}
                    >
                      <div className="text-2xl font-mono font-bold text-white mb-1">
                        {bonus.referidos}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase mb-2">refs</div>
                      <div className="text-xs font-mono text-gray-400 mb-1">${bonus.monto.toLocaleString()}</div>
                      <div className="text-lg font-mono font-bold text-miner-green">
                        ${bonus.salario}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase">monthly</div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        )}

        {activeSection === 'rewards' && (
          <div className="space-y-6">
            {/* Referral Rewards Table */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 15, 20, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
                border: '1px solid rgba(19, 241, 135, 0.2)',
              }}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-display font-bold">
                  <span className="text-white">{intl.formatMessage({ id: 'components.referralRewards.title' })}</span>
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div
                  className="hidden md:grid grid-cols-4 gap-4 p-4 text-xs font-mono uppercase tracking-wider border-b"
                  style={{ borderColor: 'rgba(19, 241, 135, 0.1)', background: 'rgba(10, 10, 15, 0.5)' }}
                >
                  <div className="text-center text-bio-yellow">
                    {intl.formatMessage({ id: 'components.referralRewards.rank' })}
                  </div>
                  <div className="text-center text-miner-green">
                    {intl.formatMessage({ id: 'components.referralRewards.referrals' })}
                  </div>
                  <div className="text-center text-cyber-cyan">
                    {intl.formatMessage({ id: 'components.referralRewards.amount' })}
                  </div>
                  <div className="text-center text-plasma-pink">
                    {intl.formatMessage({ id: 'components.referralRewards.salary' })}
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y" style={{ borderColor: 'rgba(19, 241, 135, 0.05)' }}>
                  {salaryRewards.map((reward, index) => (
                    <div
                      key={index}
                      className="p-4 transition-all duration-300 hover:bg-miner-green/5"
                    >
                      {/* Desktop View */}
                      <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                        <div className="text-center font-mono text-sm text-stellar-white font-bold">
                          {reward.rank}
                        </div>
                        <div className="text-center font-mono text-sm text-stellar-white">
                          {reward.referrals}
                        </div>
                        <div className="text-center font-mono text-sm text-stellar-white">
                          ${reward.amount.toLocaleString()}
                        </div>
                        <div className="text-center font-mono text-sm text-plasma-pink font-bold">
                          ${reward.salary.toLocaleString()}
                        </div>
                      </div>

                      {/* Mobile View */}
                      <div className="md:hidden space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-bio-yellow uppercase">
                            {intl.formatMessage({ id: 'components.referralRewards.rank' })} {reward.rank}
                          </span>
                          <span className="text-sm font-mono text-plasma-pink font-bold">
                            ${reward.salary.toLocaleString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">
                              {intl.formatMessage({ id: 'components.referralRewards.referrals' })}
                            </div>
                            <div className="text-sm font-mono text-white">
                              {reward.referrals}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">
                              {intl.formatMessage({ id: 'components.referralRewards.amount' })}
                            </div>
                            <div className="text-sm font-mono text-white">
                              ${reward.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Summary */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(10, 15, 20, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
                border: '1px solid rgba(220, 149, 230, 0.2)',
              }}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-display font-bold">
                  <span className="text-white">{intl.formatMessage({ id: 'pages.hive.yourProgress' })}</span>{' '}
                  <span className="text-plasma-pink">{intl.formatMessage({ id: 'pages.hive.progress' })}</span>
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(19, 241, 135, 0.08)', border: '1px solid rgba(19, 241, 135, 0.2)' }}>
                    <div className="text-3xl font-mono font-bold text-miner-green">{directActiveCount}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">{intl.formatMessage({ id: 'pages.hive.directActive' })}</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                    <div className="text-3xl font-mono font-bold text-cyber-cyan">{indirectActiveCount}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">{intl.formatMessage({ id: 'pages.hive.indirectActive' })}</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(19, 241, 135, 0.08)', border: '1px solid rgba(19, 241, 135, 0.2)' }}>
                    <div className="text-2xl font-mono font-bold text-miner-green">${totalFrozenLevel1.toFixed(0)}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">Monto total Nivel 1</div>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)' }}>
                    <div className="text-2xl font-mono font-bold text-cyber-cyan">${totalFrozenLevel2.toFixed(0)}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">Monto total Nivel 2</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Primer nivel</span>
                      <span className="text-[11px] font-mono text-miner-green">{directActive.length} usuarios</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {directActive.map((ref) => (
                        <div key={ref.id} className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                          <span className="truncate max-w-[180px]">{ref.email || ref.nombre}</span>
                          <span className="text-miner-green">${parseFloat(ref.frozenbalanceAdjusted || ref.frozenbalance || '0').toFixed(2)}</span>
                        </div>
                      ))}
                      {directActive.length === 0 && (
                        <div className="text-[11px] font-mono text-gray-500">Sin usuarios activos de primer nivel</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Segundo nivel</span>
                      <span className="text-[11px] font-mono text-cyber-cyan">{indirectActive.length} usuarios</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {indirectActive.map((ref) => (
                        <div key={ref.id} className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                          <span className="truncate max-w-[180px]">{ref.email || ref.nombre}</span>
                          <span className="text-cyber-cyan">${parseFloat(ref.frozenbalanceAdjusted || ref.frozenbalance || '0').toFixed(2)}</span>
                        </div>
                      ))}
                      {indirectActive.length === 0 && (
                        <div className="text-[11px] font-mono text-gray-500">Sin usuarios activos de segundo nivel</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'members' && (
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 15, 20, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
              border: '1px solid rgba(19, 241, 135, 0.2)',
            }}
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-display font-bold">
                <span className="text-white">{intl.formatMessage({ id: 'pages.hive.myFriends' })}</span>{' '}
                <span className="text-miner-green">{intl.formatMessage({ id: 'pages.hive.friends' })}</span>
              </h3>
            </div>
            <div className="p-6">
              <ReferralTable referrals={referrals} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
