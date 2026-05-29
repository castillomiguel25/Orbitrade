"use client";

import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { toast } from "sonner";
import { useProfileStore } from "@/app/store/useProfileStore";
import type { Plan } from "@/app/modules/plans";

interface PlanInstallModalProps {
  plan: Plan;
  onClose: () => void;
}

export function PlanInstallModal({ plan, onClose }: PlanInstallModalProps) {
  const intl = useIntl();
  const { profile, fetchProfile } = useProfileStore();
  const [amount, setAmount] = useState(plan.minPrice);
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) close();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [submitting]);

  function close() {
    if (submitting) return;
    setVisible(false);
    onClose();
  }

  async function handleActivate() {
    if (submitting) return;
    if (amount < plan.minPrice || amount > plan.maxPrice) {
      toast.error(`Monto fuera de rango (${plan.minPrice}–${plan.maxPrice} USDT)`);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/invest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || intl.formatMessage({ id: "components.planInstallModal.errorMessage" }));
        return;
      }
      await fetchProfile();
      toast.success(data.message || intl.formatMessage({ id: "components.planInstallModal.successMessage" }));
      close();
    } catch {
      toast.error(intl.formatMessage({ id: "components.planInstallModal.errorMessage" }));
    } finally {
      setSubmitting(false);
    }
  }

  const isIndustrial = plan.tier === "industrial";
  const accentColor = isIndustrial ? "#F5A524" : "#22c55e";
  const accentAlpha = isIndustrial ? "rgba(245,165,36,0.15)" : "rgba(34,197,94,0.12)";
  const accentBorder = isIndustrial ? "rgba(245,165,36,0.3)" : "rgba(34,197,94,0.25)";

  const dailyIncome = (amount * plan.rendimiento) / 100;
  const totalReturn = (dailyIncome * plan.duracionDias).toFixed(0);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(14,17,22,0.85)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className={`relative w-full max-w-md mx-4 sm:mx-0 rounded-xl overflow-hidden transition-all duration-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{
          background: "#161A21",
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 0 32px ${accentAlpha}, 0 16px 40px rgba(0,0,0,0.6)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: accentBorder }}>
          <div>
            <div
              className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-1"
              style={{ background: accentAlpha, color: accentColor, border: `1px solid ${accentBorder}` }}
            >
              {intl.formatMessage({ id: `pages.dashboard.catalog.tier.${plan.tier}` })}
            </div>
            <h2 className="text-base font-semibold text-bone-white">
              {intl.formatMessage({ id: plan.titleKey })}
            </h2>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg text-steel-gray hover:text-bone-white transition-colors"
            style={{ background: "rgba(124,138,160,0.1)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(30,36,48,0.8)" }}>
              <div className="text-[10px] font-mono text-steel-gray uppercase tracking-wider mb-1">
                {intl.formatMessage({ id: "components.planInstallModal.dailyYield" })}
              </div>
              <div className="text-xl font-bold" style={{ color: accentColor }}>
                {plan.rendimiento}%
              </div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: "rgba(30,36,48,0.8)" }}>
              <div className="text-[10px] font-mono text-steel-gray uppercase tracking-wider mb-1">
                {intl.formatMessage({ id: "components.planInstallModal.duration" })}
              </div>
              <div className="text-xl font-bold text-bone-white">
                {plan.duracionDias}
                <span className="text-sm font-normal text-steel-gray ml-1">
                  {intl.formatMessage({ id: "components.planInstallModal.days" })}
                </span>
              </div>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-[11px] font-mono text-steel-gray uppercase tracking-wider mb-1.5">
              {intl.formatMessage({ id: "components.planInstallModal.amount" })}
            </label>
            <input
              type="number"
              min={plan.minPrice}
              max={plan.maxPrice}
              step={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              disabled={submitting}
              className="w-full rounded-lg px-3 py-2.5 text-bone-white font-mono text-sm focus:outline-none disabled:opacity-50"
              style={{
                background: "rgba(14,17,22,0.8)",
                border: `1px solid ${accentBorder}`,
              }}
            />
            <div className="flex justify-between text-[10px] font-mono text-steel-gray mt-1">
              <span>Min: {plan.minPrice} USDT</span>
              <span>Max: {plan.maxPrice} USDT</span>
            </div>
          </div>

          {/* Projections */}
          <div className="rounded-lg p-3" style={{ background: "rgba(30,36,48,0.8)", border: `1px solid ${accentBorder}` }}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[10px] font-mono text-steel-gray uppercase mb-0.5">
                  {intl.formatMessage({ id: "components.planInstallModal.dailyIncome" })}
                </div>
                <div className="font-mono font-semibold" style={{ color: accentColor }}>
                  {dailyIncome.toFixed(2)} USDT
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-steel-gray uppercase mb-0.5">
                  {intl.formatMessage({ id: "components.planInstallModal.totalReturn" })}
                </div>
                <div className="font-mono font-semibold text-bone-white">
                  {totalReturn} USDT
                </div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="text-[11px] font-mono text-steel-gray text-right">
            {intl.formatMessage({ id: "components.planInstallModal.balance" })}:{" "}
            <span className="text-bone-white">${(profile?.trc20balance ?? 0).toFixed(2)}</span>
          </div>

          {/* Activate button */}
          <button
            onClick={handleActivate}
            disabled={submitting}
            className="w-full py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: submitting ? accentAlpha : accentColor,
              color: "#0E1116",
            }}
          >
            {submitting
              ? intl.formatMessage({ id: "components.planInstallModal.activating" })
              : intl.formatMessage({ id: "components.planInstallModal.activate" })}
          </button>
        </div>
      </div>
    </div>
  );
}
