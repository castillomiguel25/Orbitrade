export type Investment = {
  id: string;
  amount: number;
  rendimiento: number;     // daily yield %
  ganancia_diaria: number; // stored daily earning = amount * (rendimiento / 100)
  fecha_inicio: string;
  fecha_fin: string;
  last_claimed: string | null;
};

// Matches: gananciaDiaria = monto * (plan.rendimiento / 100) in invest/route.ts
export function dailyProduction(amount: number, rate: number): number {
  return Math.round(amount * (rate / 100) * 100) / 100;
}

// Claimable earnings right now — mirrors the filter logic in claim-earnings/route.ts.
// Returns ganancia_diaria if >= 24h since last claim and not expired; else 0.
// Note: the claim system pays once per 24h cycle; missed days are not accumulated.
export function accruedEarnings(investment: Investment, now: Date): number {
  const end = new Date(investment.fecha_fin);
  if (now >= end) return 0;
  const last = new Date(investment.last_claimed ?? investment.fecha_inicio);
  const hours = (now.getTime() - last.getTime()) / 36e5;
  if (hours < 24) return 0;
  return Math.round(investment.ganancia_diaria * 100) / 100;
}

// Days until investment expires (0 when expired).
export function remainingDays(investment: Investment, now: Date): number {
  const end = new Date(investment.fecha_fin);
  if (now >= end) return 0;
  return Math.ceil((end.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
}

// Progress 0–1 through the investment lifetime (for gauge display).
export function uptimeProgress(investment: Investment, now: Date): number {
  const start = new Date(investment.fecha_inicio);
  const end = new Date(investment.fecha_fin);
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 1;
  const elapsed = now.getTime() - start.getTime();
  return Math.min(1, Math.max(0, elapsed / total));
}
