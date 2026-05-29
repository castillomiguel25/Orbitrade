// This page is protected by the ProtectedLayout in (protected)/layout.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { toast } from 'sonner';
import { Button } from '@/app/components/Button';
import { CreatureDetail } from '@/app/components/CreatureDetail';
import { TopCryptos } from '@/app/components/TopCryptos';
import { PixelIcon } from '@/app/components/PixelIcon';
import Modal from '@/app/components/Modal';
import { useProfileStore } from '@/app/store/useProfileStore';
import { InvestmentPlanType } from '@/app/types/investmentPlan';
import { investmentPlans } from '@/app/constants/investmentPlans';

// Creature Card Component - Full Bleed Design
function CreatureCard({
  creature,
  isSelected,
  onClick,
  intl,
}: {
  creature: InvestmentPlanType;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  intl: ReturnType<typeof useIntl>;
}) {
  // Rarity based on investment amount
  const getRarity = (monto: number) => {
    const amount = monto || 0;
    if (amount >= 150) return { 
      main: '#F5A524', 
      glow: 'rgba(245, 165, 36, 0.6)', 
      label: intl.formatMessage({ id: 'pages.dashboard.card.rarity.legendary' })
    };
    if (amount >= 100) return { 
      main: '#E6E8EC', 
      glow: 'rgba(230, 232, 236, 0.6)', 
      label: intl.formatMessage({ id: 'pages.dashboard.card.rarity.epic' })
    };
    if (amount >= 50) return { 
      main: '#7C8AA0', 
      glow: 'rgba(124, 138, 160, 0.6)', 
      label: intl.formatMessage({ id: 'pages.dashboard.card.rarity.rare' })
    };
    return { 
      main: '#F5A524', 
      glow: 'rgba(245, 165, 36, 0.6)', 
      label: intl.formatMessage({ id: 'pages.dashboard.card.rarity.common' })
    };
  };

  const config = getRarity(creature.minPrice || creature.monto || 0);

  return (
    <button
      onClick={onClick}
      className={`
        relative group w-full
        transition-all duration-500 ease-out
        rounded-2xl overflow-hidden
        aspect-[3/4]
        ${isSelected ? 'scale-[1.03] z-20' : 'hover:scale-[1.02]'}
      `}
      style={{
        border: `2px solid ${isSelected ? config.main : `${config.main}40`}`,
        boxShadow: isSelected
          ? `0 0 50px ${config.glow}, 0 20px 40px rgba(0,0,0,0.5)`
          : '0 8px 30px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* FULL BLEED CREATURE IMAGE */}
      <div className="absolute inset-0">
        <img
          src={creature.imagePath}
          alt={creature.altText}
          className="w-full h-full object-cover transition-all duration-700"
          style={{
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </div>

      {/* Dark Gradient Overlay - Bottom Heavy */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            0deg,
            rgba(14, 17, 22, 0.95) 0%,
            rgba(14, 17, 22, 0.8) 25%,
            rgba(22, 26, 33, 0.3) 50%,
            transparent 70%
          )`,
        }}
      />

      {/* Top Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center top, transparent 40%, rgba(14, 17, 22, 0.5) 100%)',
        }}
      />

      {/* Rarity Badge - Top Right */}
      <div
        className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg"
        style={{
          background: `${config.main}25`,
          border: `1px solid ${config.main}`,
          backdropFilter: 'blur(8px)',
          boxShadow: isSelected ? `0 0 15px ${config.glow}` : 'none',
        }}
      >
        <span
          className="text-[9px] font-mono font-black uppercase tracking-widest"
          style={{ color: config.main, textShadow: `0 0 8px ${config.main}` }}
        >
          {config.label}
        </span>
      </div>

      {/* Active Pulse Effect */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-24 h-24 rounded-full"
            style={{
              border: `2px solid ${config.main}40`,
              animation: 'pulseGrow 2s ease-out infinite',
            }}
          />
        </div>
      )}

      {/* Info Panel - Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Creature Name */}
        <h3 className="mb-3">
          <span
            className="text-xl font-display font-black tracking-wide block"
            style={{
              color: '#ffffff',
              textShadow: `0 0 25px ${config.glow}, 0 2px 4px rgba(0,0,0,0.9)`,
            }}
          >
            {creature.title}
          </span>
        </h3>

        {/* Stats Row */}
        <div className="flex gap-2 mb-3">
          {/* Plasma Cost */}
          <div
            className="flex-1 text-center py-2 rounded-lg"
            style={{
              background: 'rgba(14, 17, 22, 0.7)',
              border: `1px solid ${config.main}50`,
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
              {intl.formatMessage({ id: 'pages.dashboard.card.plasma' })}
            </div>
            <div className="font-mono text-base font-bold" style={{ color: config.main }}>
              {creature.minPrice ? `${creature.minPrice} - ${creature.maxPrice}` : creature.monto}
            </div>
          </div>

          {/* Daily Yield */}
          <div
            className="flex-1 text-center py-2 rounded-lg"
            style={{
              background: 'rgba(14, 17, 22, 0.7)',
              border: '1px solid rgba(245, 165, 36, 0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">
              {intl.formatMessage({ id: 'pages.dashboard.card.daily' })}
            </div>
            <div className="font-mono text-base font-bold text-amber-400">
              +{creature.rendimiento}%
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div
        className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg z-10"
        style={{ borderColor: isSelected ? config.main : `${config.main}50` }}
      />
      <div
        className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 rounded-bl-lg z-10"
        style={{ borderColor: isSelected ? config.main : `${config.main}50` }}
      />
      <div
        className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 rounded-br-lg z-10"
        style={{ borderColor: isSelected ? config.main : `${config.main}50` }}
      />

      {/* Scan Line Effect */}
      {isSelected && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.main}, transparent)`,
              boxShadow: `0 0 15px ${config.main}`,
              animation: 'scanDown 3s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Glow Border on Active */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `inset 0 0 30px ${config.main}25` }}
        />
      )}
    </button>
  );
}

// RadialStat component removed as requested

export default function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState<null | InvestmentPlanType>(null);
  const { profile } = useProfileStore();
  const [currentTime, setCurrentTime] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();

  useEffect(() => {
    setIsPromoOpen(true);
  }, []);

  // Time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  if (!profile) return null;

  const availablePlans = investmentPlans.filter((p) =>
    !['galaxian_scout', 'galaxian_fighter', 'galaxian_destroyer'].includes(String(p.id))
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0E1116 0%, #0a0a0f 50%, #0a2419 100%)',
      }}
    >
      {/* <Modal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        maxWidth="md"
        variant="secondary"
      >
        <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
          <div className="space-y-2 text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase"
              style={{
                background: 'rgba(220,149,230,0.12)',
                border: '1px solid rgba(220,149,230,0.4)',
              }}
            >
              <span>🎉</span>
              <span>{intl.formatMessage({ id: 'promo.event.badge' })}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">
              {intl.formatMessage({ id: 'promo.event.title' })}
            </h2>
          </div>

          <div
            className="relative rounded-2xl border border-white/10 p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(14, 17, 22, 0.94), rgba(22, 26, 33, 0.9))',
              boxShadow: '0 0 30px rgba(220,149,230,0.25)',
            }}
          >
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(220,149,230,0.35), transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(19,241,135,0.35), transparent 70%)',
                filter: 'blur(45px)',
              }}
            />

            <div className="relative text-sm sm:text-base font-mono text-gray-300 text-left space-y-3">
              <p>Nos complace anunciar una oportunidad exclusiva para potenciar sus inversiones.</p>
              <p>
                Todos los usuarios (nuevos y antiguos) que activen un nuevo minero recibirán un bono del 10% sobre el valor de su compra.
              </p>
              <ul className="space-y-2 text-gray-200">
                <li>▫️ Bono por activación: 10% adicional (acreditado al activar)</li>
                <li>▫️ Ejemplo A: Inversión de 50 USDT ➡️ Recibes 5 USDT extra.</li>
                <li>▫️ Ejemplo B: Inversión de 100 USDT ➡️ Recibes 10 USDT extra.</li>
                <li>▫️ Ejemplo C: Inversión de 400 USDT ➡️ Recibes 40 USDT extra.</li>
              </ul>
              <p>🟢 Vigencia de la promoción: Del 06 de abril al 16 de abril.</p>
            </div>

            <div className="relative pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[11px] sm:text-xs text-gray-400 font-mono" />
              <button
                type="button"
                onClick={() => setIsPromoOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-mono font-semibold bg-pink-500 hover:bg-pink-400 text-white shadow-lg shadow-pink-500/30 transition-colors w-full sm:w-auto"
              >
                {intl.formatMessage({ id: 'promo.event.button.ok' })}
              </button>
            </div>
          </div>
        </div>
      </Modal> */}
      {/* Animated background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Nebula effects */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(245, 165, 36, 0.4), transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(230, 232, 236, 0.4), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245, 165, 36, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 165, 36, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${10 + (i * 4.5) % 80}%`,
              top: `${5 + (i * 7) % 90}%`,
              backgroundColor: i % 3 === 0 ? '#F5A524' : i % 3 === 1 ? '#E6E8EC' : '#7C8AA0',
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#F5A524' : i % 3 === 1 ? '#E6E8EC' : '#7C8AA0'}`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Command Center Header */}
        <header className="mb-8">
          <div
            className="relative p-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 17, 22, 0.9), rgba(22, 26, 33, 0.8))',
              border: '1px solid rgba(245, 165, 36, 0.2)',
              boxShadow: '0 0 40px rgba(245, 165, 36, 0.1)',
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500 rounded-tl" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500 rounded-br" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Title replaced with WhatsApp Button */}
              <div className="text-center lg:text-left">
                <a
                  href="https://chat.whatsapp.com/ByRJFokrQWGL2sk0szdv4N?mode=hq2tcla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/50 group w-full sm:w-auto"
                >
                  <div className="bg-white rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-8 h-8 fill-[#25D366]"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-mono text-green-100 uppercase tracking-wider">{intl.formatMessage({ id: 'pages.dashboard.whatsapp.community' })}</div>
                    <div className="text-lg font-bold text-white">{intl.formatMessage({ id: 'pages.dashboard.whatsapp.join' })}</div>
                  </div>
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-4">
                <div
                  className="px-4 py-2 rounded-xl flex items-center gap-3"
                  style={{
                    background: 'rgba(245, 165, 36, 0.1)',
                    border: '1px solid rgba(245, 165, 36, 0.3)',
                  }}
                >
                  <span className="text-xl">💻</span>
                  <div>
                    <div className="text-[10px] font-mono text-[#7C8AA0] uppercase">
                      {intl.formatMessage({ id: 'pages.dashboard.header.operator' })}
                    </div>
                    <div className="text-sm font-display font-bold text-amber-400 tracking-wide">
                      {profile.name || intl.formatMessage({ id: 'pages.dashboard.header.unknown' })}
                    </div>
                    {profile.referralcode && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-[10px] font-mono text-gray-400 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">
                          UID: {profile.referralcode}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(profile.referralcode || '');
                            toast.success("UID copiado");
                          }}
                          className="text-[9px] font-bold text-amber-400 hover:text-white hover:bg-amber-500/20 px-1.5 py-0.5 rounded transition-all cursor-pointer uppercase border border-amber-500/30 hover:border-amber-500"
                        >
                          Copiar UID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scan line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #F5A524, transparent)',
                animation: 'scanHorizontal 4s ease-in-out infinite',
              }}
            />
          </div>
        </header>

        {/* Stats Grid - Minimal Design */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-10 px-4">
          {/* Balance */}
          <div className="flex flex-col items-center text-center group">
            {/* <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">💎</div> */}
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              {intl.formatMessage({ id: 'pages.dashboard.stats.balance.label' })}
            </div>
            <div 
              className="text-xl lg:text-xl font-display font-bold tracking-wide text-[#F5A524]" 
              style={{ textShadow: '0 0 30px rgba(245, 165, 36, 0.4)' }}
            >
              ${(profile.trc20balance ?? 0).toLocaleString()}
            </div>
          </div>

          {/* Daily Earnings */}
          {/* <div className="flex flex-col items-center text-center group">
            <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">⚡</div>
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              {intl.formatMessage({ id: 'pages.dashboard.stats.dailyEarnings.label' })}
            </div>
            <div 
              className="text-xl lg:text-xl font-display font-bold tracking-wide text-[#E6E8EC]" 
              style={{ textShadow: '0 0 30px rgba(230, 232, 236, 0.4)' }}
            >
              +{(profile.dailyearnings ?? 0).toFixed(2)}
            </div>
          </div> */}

          {/* Incubation */}
          <div className="flex flex-col items-center text-center group">
            {/* <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">🔒</div> */}
            <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
              {intl.formatMessage({ id: 'pages.dashboard.stats.incubation.label' })}
            </div>
            <div 
              className="text-xl lg:text-xl font-display font-bold tracking-wide text-[#7C8AA0]" 
              style={{ textShadow: '0 0 30px rgba(124, 138, 160, 0.4)' }}
            >
              ${(profile.frozenbalance ?? 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex gap-3">
            <Link href="/deposits" className="flex-1">
              <Button variant="primary" size="sm" fullWidth>
                <span className="flex items-center gap-2">
                  <span>💻</span>
                  <span>
                    <span className="font-bold">{intl.formatMessage({ id: 'pages.dashboard.actions.deposit' })}</span>{' '}
                  </span>
                </span>
              </Button>
            </Link>
            <Link href="/withdrawals" className="flex-1">
              <Button variant="secondary" size="sm" fullWidth>
                <span className="flex items-center gap-2">
                  <PixelIcon name="download" className="w-4 h-4" />
                  <span>
                    <span className="italic">{intl.formatMessage({ id: 'pages.dashboard.actions.withdraw' })}</span>
                  </span>
                </span>
              </Button>
            </Link>
          </div>
          {/* <Link href="/plasma-core" className="w-full">
            <Button variant="outline" size="md" fullWidth>
              <span className="flex items-center gap-2">
                <PixelIcon name="trending-up" className="w-4 h-4" />
                <span>
                  <span className="font-bold">{intl.formatMessage({ id: 'pages.dashboard.actions.getMining' })}</span>
                </span>
              </span>
            </Button>
          </Link> */}
        </div>

        {/* Creatures Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold tracking-wider">
                <span className="text-amber-400 italic">{intl.formatMessage({ id: 'pages.dashboard.creatures.title.part1' })}</span>{' '}
                <span className="text-[#E6E8EC] font-light">{intl.formatMessage({ id: 'pages.dashboard.creatures.title.part2' })}</span>
              </h2>
              <p className="text-sm font-mono text-[#7C8AA0]">
                {intl.formatMessage({ id: 'pages.dashboard.creatures.description' })}{' '}
                <span className="italic text-[#E6E8EC]">{intl.formatMessage({ id: 'pages.dashboard.creatures.description.incubate' })}</span>{' '}
                {intl.formatMessage({ id: 'pages.dashboard.creatures.description.and' })}{' '}
                <span className="font-bold text-amber-400">{intl.formatMessage({ id: 'pages.dashboard.creatures.description.harvest' })}</span>{' '}
                {intl.formatMessage({ id: 'pages.dashboard.creatures.description.plasma' })}
              </p>
            </div>
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono"
              style={{
                background: 'rgba(245, 165, 36, 0.1)',
                border: '1px solid rgba(245, 165, 36, 0.2)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: '#F5A524', boxShadow: '0 0 8px #F5A524' }}
              />
              <span className="text-amber-400">{availablePlans.length} {intl.formatMessage({ id: 'pages.dashboard.creatures.available' })}</span>
            </div>
          </div>

          {/* Creatures Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {availablePlans.map((plan, index) => (
              <CreatureCard
                key={plan.id}
                creature={plan}
                index={index}
                isSelected={selectedPlan?.id === plan.id}
                onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                intl={intl}
              />
            ))}
          </div>
        </section>

        {/* Market Data Section */}
        <TopCryptos />
      </div>

      {/* Plan Detail Modal */}
      {selectedPlan && <CreatureDetail plan={selectedPlan} onClose={() => setSelectedPlan(null)} />}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scanHorizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes pulseGrow {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes scanDown {
          0% { top: 0%; }
          50% { top: 100%; }
          50.01% { top: 0%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}
