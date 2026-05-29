"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { useProfileStore } from "@/app/store/useProfileStore";
import {
  accruedEarnings,
  dailyProduction,
  remainingDays,
  uptimeProgress,
  type Investment,
} from "@/app/modules/production";

type RawDeposit = {
  id: string;
  amount: number;
  rendimiento: number;
  ganancia_diaria: number;
  fecha_inicio: string;
  fecha_fin: string;
  last_claimed: string | null;
  plan_nombre?: string;
};

function toInvestment(d: RawDeposit): Investment {
  return {
    id: d.id,
    amount: Number(d.amount),
    rendimiento: Number(d.rendimiento),
    ganancia_diaria: Number(d.ganancia_diaria),
    fecha_inicio: d.fecha_inicio,
    fecha_fin: d.fecha_fin,
    last_claimed: d.last_claimed,
  };
}

function GaugeBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(124,138,160,0.15)" }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.round(progress * 100)}%`, background: color }}
      />
    </div>
  );
}

function InstallationCard({
  deposit,
  now,
  onClaim,
  claiming,
}: {
  deposit: RawDeposit;
  now: Date;
  onClaim: () => void;
  claiming: boolean;
}) {
  const inv = toInvestment(deposit);
  const daily = dailyProduction(inv.amount, inv.rendimiento);
  const accrued = accruedEarnings(inv, now);
  const days = remainingDays(inv, now);
  const progress = uptimeProgress(inv, now);
  const canClaim = accrued > 0;
  const expired = days === 0;
  const accentColor = expired ? "#7C8AA0" : "#F5A524";

  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "#161A21",
        border: `1px solid ${expired ? "rgba(124,138,160,0.12)" : "rgba(245,165,36,0.15)"}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: "#7C8AA0" }}>
            Instalación
          </div>
          <div className="font-semibold text-bone-white text-sm">
            {deposit.plan_nombre || "Plan"}
          </div>
        </div>
        <div
          className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          style={{
            background: expired ? "rgba(124,138,160,0.08)" : "rgba(245,165,36,0.1)",
            color: accentColor,
            border: `1px solid ${expired ? "rgba(124,138,160,0.15)" : "rgba(245,165,36,0.2)"}`,
          }}
        >
          {expired ? "Expirado" : "Activo"}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5 text-steel-gray">
            Capacidad
          </div>
          <div className="font-mono font-bold text-bone-white">${inv.amount.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5 text-steel-gray">
            Producción / día
          </div>
          <div className="font-mono font-bold text-bone-white">${daily.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5 text-steel-gray">
            Días restantes
          </div>
          <div className="font-mono font-bold text-bone-white">{days}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5 text-steel-gray">
            Pendiente
          </div>
          <div className="font-mono font-bold" style={{ color: canClaim ? "#22c55e" : "#7C8AA0" }}>
            ${accrued.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Uptime gauge */}
      {!expired && (
        <div>
          <div className="flex justify-between text-[10px] font-mono text-steel-gray mb-1">
            <span>Progreso</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <GaugeBar progress={progress} color={accentColor} />
        </div>
      )}

      {/* Claim button */}
      {!expired && (
        <button
          onClick={onClaim}
          disabled={!canClaim || claiming}
          className="w-full py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all"
          style={{
            background: canClaim ? "rgba(34,197,94,0.12)" : "rgba(124,138,160,0.06)",
            color: canClaim ? "#22c55e" : "#4a5568",
            border: `1px solid ${canClaim ? "rgba(34,197,94,0.25)" : "rgba(124,138,160,0.1)"}`,
            cursor: canClaim && !claiming ? "pointer" : "not-allowed",
          }}
        >
          {claiming ? "Reclamando..." : canClaim ? "Reclamar ganancias" : "Disponible en 24 h"}
        </button>
      )}
    </div>
  );
}

export default function ProductionPage() {
  const { user } = useUserStore();
  const { fetchProfile } = useProfileStore();
  const [deposits, setDeposits] = useState<RawDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const fetchDeposits = useCallback(async () => {
    try {
      const res = await fetch("/api/deposits");
      if (!res.ok) return;
      const data = await res.json();
      setDeposits(data.deposits ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
    // Refresh "now" every minute so accrued/remaining update without page reload
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, [fetchDeposits]);

  const handleClaim = useCallback(async () => {
    if (!user?.id || claiming) return;
    setClaiming(true);
    setClaimResult(null);
    try {
      const res = await fetch("/api/claim-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setClaimResult(`+$${Number(data.total_earned).toFixed(2)} reclamados`);
        await fetchProfile();
        await fetchDeposits();
        setNow(new Date());
      }
    } finally {
      setClaiming(false);
      setTimeout(() => setClaimResult(null), 4000);
    }
  }, [user?.id, claiming, fetchProfile, fetchDeposits]);

  const active = deposits.filter((d) => new Date() < new Date(d.fecha_fin));
  const expired = deposits.filter((d) => new Date() >= new Date(d.fecha_fin));
  const totalClaimable = active.reduce(
    (sum, d) => sum + accruedEarnings(toInvestment(d), now),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header + global claim */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-bone-white">Producción</h1>
          <p className="text-sm mt-0.5" style={{ color: "#7C8AA0" }}>
            Instalaciones activas y ganancias disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
          {claimResult && (
            <span className="text-sm font-mono font-semibold" style={{ color: "#22c55e" }}>
              {claimResult}
            </span>
          )}
          <button
            onClick={handleClaim}
            disabled={totalClaimable === 0 || claiming}
            className="px-5 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            style={{
              background: totalClaimable > 0 ? "rgba(245,165,36,0.15)" : "rgba(124,138,160,0.06)",
              color: totalClaimable > 0 ? "#F5A524" : "#4a5568",
              border: `1px solid ${totalClaimable > 0 ? "rgba(245,165,36,0.3)" : "rgba(124,138,160,0.1)"}`,
              cursor: totalClaimable > 0 && !claiming ? "pointer" : "not-allowed",
            }}
          >
            {claiming
              ? "Reclamando..."
              : totalClaimable > 0
              ? `Reclamar $${totalClaimable.toFixed(2)}`
              : "Sin ganancias pendientes"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-steel-gray font-mono">Cargando instalaciones...</div>
      )}

      {!loading && deposits.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "#161A21", border: "1px solid rgba(124,138,160,0.12)" }}
        >
          <div className="text-steel-gray text-sm">Sin instalaciones activas.</div>
          <a
            href="/dashboard"
            className="mt-3 inline-block text-xs font-mono font-semibold uppercase tracking-wider"
            style={{ color: "#F5A524" }}
          >
            Instalar un plan →
          </a>
        </div>
      )}

      {active.length > 0 && (
        <section>
          <div className="text-[10px] font-mono uppercase tracking-widest text-steel-gray mb-3">
            Activas ({active.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((d) => (
              <InstallationCard
                key={d.id}
                deposit={d}
                now={now}
                onClaim={handleClaim}
                claiming={claiming}
              />
            ))}
          </div>
        </section>
      )}

      {expired.length > 0 && (
        <section>
          <div className="text-[10px] font-mono uppercase tracking-widest text-steel-gray mb-3">
            Expiradas ({expired.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expired.map((d) => (
              <InstallationCard
                key={d.id}
                deposit={d}
                now={now}
                onClaim={handleClaim}
                claiming={claiming}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
