"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useIntl } from "react-intl";

export default function GallineroModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");
  const intl = useIntl();
  const t = (id) => intl.formatMessage({ id, defaultMessage: id });

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError(t("must_login"));
          setLoading(false);
          return;
        }
        setSession(session);

        const { data, error } = await supabase
          .from("investments")
          .select("id, plan_title, daily_income, last_claimed, start_date, status")
          .eq("user_id", session.user.id)
          .eq("status", "active")
          .in("plan_title", ["Gallina", "Gallo"]);

        if (error) {
          setError(t("error_loading_investments"));
          setLoading(false);
          return;
        }
        setInvestments(data || []);
      } catch (e) {
        setError(t("unexpected_error"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen]);

  const counts = useMemo(() => {
    const hens = (investments || []).filter(i => String(i.plan_title).toLowerCase() === "gallina").length;
    const roosters = (investments || []).filter(i => String(i.plan_title).toLowerCase() === "gallo").length;
    return { hens, roosters };
  }, [investments]);

  const getNextAvailability = (inv) => {
    const base = inv.last_claimed ? new Date(inv.last_claimed) : new Date(inv.start_date);
    const next = new Date(base.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const remainingMs = next - now;
    return {
      available: remainingMs <= 0,
      nextTime: next,
      remainingMs,
    };
  };

  const formatRemaining = (ms) => {
    if (ms <= 0) return t("ready_to_claim");
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const claimInvestment = async (inv) => {
    if (!session) return;
    try {
      const token = session.access_token;
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ investmentId: inv.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(t("claim_error"));
        return;
      }
      // Refrescar lista tras cobro
      const { data: refreshed } = await supabase
        .from("investments")
        .select("id, plan_title, daily_income, last_claimed, start_date, status")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .in("plan_title", ["Gallina", "Gallo"]);
      setInvestments(refreshed || []);
      setError("");
      alert(
        t("claim_alert")
          .replace("{amount}", data.added_amount)
          .replace("{balance}", data.new_trc20balance)
      );
    } catch (e) {
      setError(t("claim_error"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[90vw] max-w-[520px] p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">{t("modal_chicken_coop_title")}</h2>
          <button className="text-gray-600 hover:text-black" onClick={onClose}>
            {t("close")}
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">{t("loading")}</div>
        ) : error ? (
          <div className="py-4 text-red-600">{error}</div>
        ) : (
          <>
            <div className="mb-3 text-sm">
              <div>
                {t("hens")}: <span className="font-medium">{counts.hens}</span>
              </div>
              <div>
                {t("roosters")}: <span className="font-medium">{counts.roosters}</span>
              </div>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {investments.length === 0 && (
                <div className="text-sm text-gray-600">{t("none_active_chicken_coop")}</div>
              )}
              {investments.map((inv) => {
                const tAvail = getNextAvailability(inv);
                const isHen = String(inv.plan_title).toLowerCase() === "gallina";
                return (
                  <div key={inv.id} className="border rounded p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        {isHen ? t("hen") : t("rooster")}
                      </div>
                      <div className="text-xs text-gray-600">
                        {t("daily_income")}: {inv.daily_income}
                      </div>
                      <div className="text-xs text-gray-600">
                        {tAvail.available
                          ? t("ready_to_claim")
                          : `${t("next_claim_in")}: ${formatRemaining(tAvail.remainingMs)}`}
                      </div>
                    </div>
                    <button
                      className={`px-3 py-1 text-sm rounded ${
                        tAvail.available
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-700 cursor-not-allowed"
                      }`}
                      disabled={!tAvail.available}
                      onClick={() => claimInvestment(inv)}
                    >
                      {t("claim")}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
