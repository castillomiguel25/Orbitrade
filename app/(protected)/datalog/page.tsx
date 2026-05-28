"use client";

import { useEffect, useState } from "react";
import { useIntl } from "react-intl";

type Movement = {
  id: string;
  created_at: string;
  type: "deposit" | "invest" | "withdraw" | "earning" | "conversion" | "adjustment";
  amount: number;
  previous_balance: number;
  new_balance: number;
  ref_id?: string | null;
  note?: string | null;
  metadata?: Record<string, unknown>;
};

function formatType(intl: ReturnType<typeof useIntl>, t: Movement["type"]) {
  const map: Record<Movement["type"], string> = {
    deposit: intl.formatMessage({ id: "movements.type.deposit" }),
    invest: intl.formatMessage({ id: "movements.type.invest" }),
    withdraw: intl.formatMessage({ id: "movements.type.withdraw" }),
    earning: intl.formatMessage({ id: "movements.type.earning" }),
    conversion: intl.formatMessage({ id: "movements.type.conversion" }),
    adjustment: intl.formatMessage({ id: "movements.type.adjustment" }),
  };
  return map[t] || t;
}

function getTypeColor(t: Movement["type"]) {
  const colors: Record<Movement["type"], { bg: string; text: string; border: string }> = {
    deposit: { bg: 'rgba(19, 241, 135, 0.15)', text: '#13f187', border: 'rgba(19, 241, 135, 0.4)' },
    invest: { bg: 'rgba(220, 149, 230, 0.15)', text: '#dc95e6', border: 'rgba(220, 149, 230, 0.4)' },
    withdraw: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' },
    earning: { bg: 'rgba(0, 245, 255, 0.15)', text: '#00f5ff', border: 'rgba(0, 245, 255, 0.4)' },
    conversion: { bg: 'rgba(200, 255, 0, 0.15)', text: '#c8ff00', border: 'rgba(200, 255, 0, 0.4)' },
    adjustment: { bg: 'rgba(255, 255, 255, 0.1)', text: '#ffffff', border: 'rgba(255, 255, 255, 0.2)' },
  };
  return colors[t] || colors.adjustment;
}

export default function MovementsPage() {
  const intl = useIntl();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/balance-movements", { cache: "no-store" });
        const json = await res.json();
        if (mounted) setMovements(json.movements || []);
      } catch (e) {
        console.error("Error fetching movements", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(10, 36, 25, 0.8))',
    border: '1px solid rgba(19, 241, 135, 0.2)',
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #000201 0%, #0a0a0f 50%, #0a2419 100%)',
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nebula effects */}
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.4), transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(19, 241, 135, 0.4), transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 10s ease-in-out infinite reverse',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.02) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              left: `${5 + (i * 7) % 90}%`,
              top: `${10 + (i * 8) % 80}%`,
              backgroundColor: i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#00f5ff' : '#dc95e6',
              boxShadow: `0 0 10px ${i % 3 === 0 ? '#13f187' : i % 3 === 1 ? '#00f5ff' : '#dc95e6'}`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 lg:p-8 pb-32">
        {/* Header */}
        <header className="mb-8">
          <div
            className="relative p-6 rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(10, 36, 25, 0.8))',
              border: '1px solid rgba(0, 245, 255, 0.2)',
              boxShadow: '0 0 40px rgba(0, 245, 255, 0.1)',
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan rounded-tl" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-miner-green rounded-tr" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-miner-green rounded-bl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan rounded-br" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Title section */}
              <div className="flex items-center gap-4">
                {/* Log icon */}
                <div
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(19, 241, 135, 0.1))',
                    border: '1px solid rgba(0, 245, 255, 0.4)',
                    boxShadow: '0 0 25px rgba(0, 245, 255, 0.3)',
                  }}
                >
                  <span className="text-3xl">📋</span>
                  <div
                    className="absolute inset-0 rounded-xl border-2 border-dashed border-miner-green/30 animate-spin"
                    style={{ animationDuration: '20s' }}
                  />
                </div>

                <div>
                  <h1 className="text-xl lg:text-2xl font-display font-bold tracking-wider mb-1">
                    <span
                      className="italic"
                      style={{
                        background: 'linear-gradient(135deg, #00f5ff, #13f187)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Operations
                    </span>{' '}
                    <span className="text-stellar-white font-light">Log</span>
                  </h1>
                  <p className="text-sm font-mono text-cosmic-gray">
                    {intl.formatMessage({ id: "pages.movements.title" })} •{' '}
                    <span className="italic text-cyber-cyan">ORBITRADE</span>
                  </p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
                  />
                  <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider">
                    {movements.length} Records
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: '#13f187', boxShadow: '0 0 8px #13f187', animationDelay: '0.5s' }}
                  />
                  <span className="text-xs font-mono text-miner-green uppercase tracking-wider">
                    Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Scan line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)',
                animation: 'scanHorizontal 4s ease-in-out infinite',
              }}
            />
          </div>
        </header>

        {/* Table Container */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={cardStyle}
        >
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-miner-green rounded-tl" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-miner-green rounded-tr" />

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr style={{ background: 'rgba(19, 241, 135, 0.1)' }}>
                  <th className="px-4 py-4 text-left text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.date" })}
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.type" })}
                  </th>
                  <th className="px-4 py-4 text-right text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.previous" })}
                  </th>
                  <th className="px-4 py-4 text-right text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.amount" })}
                  </th>
                  <th className="px-4 py-4 text-right text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.new" })}
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-mono font-semibold text-miner-green">
                    {intl.formatMessage({ id: "movements.table.note" })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-4 py-6 text-center" colSpan={6}>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-miner-green border-t-transparent rounded-full animate-spin" />
                        <span className="text-cosmic-gray font-mono">
                          {intl.formatMessage({ id: "movements.loading" })}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && movements.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={6}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl opacity-50">📭</span>
                        <span className="text-cosmic-gray font-mono">
                          {intl.formatMessage({ id: "movements.empty" })}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
                {movements.map((m) => {
                  const date = new Date(m.created_at);
                  const typeColors = getTypeColor(m.type);
                  const typeLabel = formatType(intl, m.type);
                  return (
                    <tr
                      key={m.id}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: 'rgba(19, 241, 135, 0.1)' }}
                    >
                      <td className="px-4 py-3 text-sm font-mono text-white/80">
                        {date.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-mono font-semibold"
                          style={{
                            background: typeColors.bg,
                            color: typeColors.text,
                            border: `1px solid ${typeColors.border}`,
                          }}
                        >
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-white/70">
                        {m.previous_balance.toFixed(2)} USDT
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono font-bold" style={{ color: m.amount >= 0 ? '#13f187' : '#ef4444' }}>
                        {m.amount >= 0 ? "+" : ""}{m.amount.toFixed(2)} USDT
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-mono text-white/90">
                        {m.new_balance.toFixed(2)} USDT
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-cosmic-gray">
                        {m.note || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-4 space-y-4">
            {loading && (
              <div className="flex items-center justify-center gap-3 py-8">
                <div className="w-5 h-5 border-2 border-miner-green border-t-transparent rounded-full animate-spin" />
                <span className="text-cosmic-gray font-mono">
                  {intl.formatMessage({ id: "movements.loading" })}
                </span>
              </div>
            )}
            {!loading && movements.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8">
                <span className="text-4xl opacity-50">📭</span>
                <span className="text-cosmic-gray font-mono">
                  {intl.formatMessage({ id: "movements.empty" })}
                </span>
              </div>
            )}
            {movements.map((m) => {
              const date = new Date(m.created_at);
              const typeColors = getTypeColor(m.type);
              const typeLabel = formatType(intl, m.type);
              return (
                <div
                  key={m.id}
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(19, 241, 135, 0.2)',
                  }}
                >
                  {/* Type indicator bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: typeColors.text }}
                  />

                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2 py-1 rounded-lg text-xs font-mono font-semibold"
                      style={{
                        background: typeColors.bg,
                        color: typeColors.text,
                        border: `1px solid ${typeColors.border}`,
                      }}
                    >
                      {typeLabel}
                    </span>
                    <span className="text-xs font-mono text-cosmic-gray">
                      {date.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60 font-mono">
                        {intl.formatMessage({ id: "movements.table.previous" })}:
                      </span>
                      <span className="text-sm font-mono text-white/80">
                        {m.previous_balance.toFixed(2)} USDT
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60 font-mono">
                        {intl.formatMessage({ id: "movements.table.amount" })}:
                      </span>
                      <span
                        className="text-sm font-mono font-bold"
                        style={{ color: m.amount >= 0 ? '#13f187' : '#ef4444' }}
                      >
                        {m.amount >= 0 ? "+" : ""}{m.amount.toFixed(2)} USDT
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60 font-mono">
                        {intl.formatMessage({ id: "movements.table.new" })}:
                      </span>
                      <span className="text-sm font-mono text-white">
                        {m.new_balance.toFixed(2)} USDT
                      </span>
                    </div>

                    {m.note && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-xs font-mono text-cosmic-gray">
                          {m.note}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes scanHorizontal {
          0%, 100% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
