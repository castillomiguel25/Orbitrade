"use client";

import { useState } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import { useProfileStore } from "@/app/store/useProfileStore";
import { getPlans, type Plan } from "@/app/modules/plans";
import { PlanInstallModal } from "@/app/components/PlanInstallModal";

const plans = getPlans();

function PlanCard({
  plan,
  onClick,
}: {
  plan: Plan;
  onClick: () => void;
}) {
  const intl = useIntl();
  const isIndustrial = plan.tier === "industrial";
  const accentColor = isIndustrial ? "#F5A524" : "#7C8AA0";
  const accentAlpha = isIndustrial ? "rgba(245,165,36,0.08)" : "rgba(124,138,160,0.06)";
  const accentBorder = isIndustrial ? "rgba(245,165,36,0.22)" : "rgba(124,138,160,0.18)";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] relative"
      style={{
        border: `1px solid ${accentBorder}`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${accentAlpha}, 0 0 0 1px ${accentColor}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.4)`;
      }}
    >
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${plan.imagePath})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(14,17,22,0.93) 0%, rgba(22,26,33,0.88) 100%)",
        }}
      />

      {/* Content sits above overlay */}
      <div className="relative z-10 p-5">
      {/* Tier badge */}
      <div
        className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3"
        style={{ background: accentAlpha, color: accentColor, border: `1px solid ${accentBorder}` }}
      >
        {intl.formatMessage({ id: `pages.dashboard.catalog.tier.${plan.tier}` })}
      </div>

      {/* Plan name */}
      <h3 className="text-base font-semibold text-bone-white mb-3">
        {intl.formatMessage({ id: plan.titleKey })}
      </h3>

      {/* Key metrics */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono text-steel-gray uppercase tracking-wider">Rendimiento</span>
          <span className="font-mono font-bold text-sm" style={{ color: accentColor }}>
            {plan.rendimiento}% / día
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono text-steel-gray uppercase tracking-wider">Inversión</span>
          <span className="font-mono text-sm text-bone-white">
            ${plan.minPrice} – ${plan.maxPrice}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono text-steel-gray uppercase tracking-wider">Duración</span>
          <span className="font-mono text-sm text-bone-white">{plan.duracionDias} días</span>
        </div>
      </div>

      {/* CTA hint */}
      <div
        className="mt-4 w-full py-2 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider text-center transition-colors"
        style={{ background: accentAlpha, color: accentColor, border: `1px solid ${accentBorder}` }}
      >
        Instalar →
      </div>
      </div>{/* end relative z-10 */}
    </button>
  );
}

export default function DashboardPage() {
  const intl = useIntl();
  const { profile } = useProfileStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* KPI grid */}
      <div
        className="rounded-xl p-5"
        style={{ background: "#161A21", border: "1px solid rgba(124,138,160,0.12)" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: intl.formatMessage({ id: "pages.dashboard.kpi.available" }), value: profile?.trc20balance ?? 0, accent: "#F5A524" },
            { label: intl.formatMessage({ id: "pages.dashboard.kpi.capacity" }), value: profile?.frozenbalance ?? 0, accent: "#7C8AA0" },
            { label: intl.formatMessage({ id: "pages.dashboard.kpi.todayProduction" }), value: profile?.dailyearnings ?? 0, accent: "#22c55e" },
            { label: intl.formatMessage({ id: "pages.dashboard.kpi.accumulated" }), value: profile?.totalgenerated ?? 0, accent: "#7C8AA0" },
          ].map(({ label, value, accent }) => (
            <div key={label}>
              <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: "#7C8AA0" }}>
                {label}
              </div>
              <div className="text-xl font-bold" style={{ color: accent }}>
                ${(value as number).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Link
            href="/deposits"
            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
            style={{ background: "rgba(245,165,36,0.15)", color: "#F5A524", border: "1px solid rgba(245,165,36,0.3)" }}
          >
            Depositar
          </Link>
          <Link
            href="/production"
            className="px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
            style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            Producción →
          </Link>
        </div>
      </div>

      {/* Plan catalog */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-bone-white">
            {intl.formatMessage({ id: "pages.dashboard.catalog.title" })}
          </h2>
          <p className="text-sm text-steel-gray mt-0.5">
            {intl.formatMessage({ id: "pages.dashboard.catalog.subtitle" })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onClick={() => setSelectedPlan(plan)} />
          ))}
        </div>
      </section>

      {selectedPlan && (
        <PlanInstallModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
