import { describe, it, expect } from 'vitest';
import {
  dailyProduction,
  accruedEarnings,
  remainingDays,
  uptimeProgress,
} from '../app/modules/production';
import type { Investment } from '../app/modules/production';

const BASE_NOW = new Date('2026-01-15T12:00:00Z');
const FAR_END = new Date('2027-01-01T12:00:00Z').toISOString();

function makeInvestment(overrides: Partial<Investment> = {}): Investment {
  return {
    id: 'inv-1',
    amount: 100,
    rendimiento: 1.2,
    ganancia_diaria: 1.20,
    fecha_inicio: new Date('2026-01-01T12:00:00Z').toISOString(),
    fecha_fin: FAR_END,
    last_claimed: null,
    ...overrides,
  };
}

// ── dailyProduction ──────────────────────────────────────────────────────────

describe('dailyProduction', () => {
  it('computes entry-tier earnings', () => {
    expect(dailyProduction(100, 1.2)).toBe(1.20);
  });

  it('computes industrial-tier earnings', () => {
    expect(dailyProduction(500, 2.0)).toBe(10.00);
  });

  it('computes max industrial investment', () => {
    expect(dailyProduction(5000, 2.0)).toBe(100.00);
  });

  it('rounds to 2 decimal places', () => {
    // 333 * 1.2 / 100 = 3.996 → rounds to 4.00
    expect(dailyProduction(333, 1.2)).toBe(4.00);
  });

  it('handles zero amount', () => {
    expect(dailyProduction(0, 1.2)).toBe(0);
  });

  it('matches stored ganancia_diaria formula from invest route', () => {
    // The invest route uses: gananciaDiaria = monto * (plan.rendimiento / 100)
    const amount = 250;
    const rendimiento = 1.2;
    const expected = Math.round(amount * (rendimiento / 100) * 100) / 100;
    expect(dailyProduction(amount, rendimiento)).toBe(expected);
  });
});

// ── accruedEarnings ──────────────────────────────────────────────────────────

describe('accruedEarnings', () => {
  it('returns 0 when investment is expired (now >= fecha_fin)', () => {
    const inv = makeInvestment({ fecha_fin: new Date('2026-01-01T00:00:00Z').toISOString() });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(0);
  });

  it('returns 0 exactly at fecha_fin', () => {
    const inv = makeInvestment({ fecha_fin: BASE_NOW.toISOString() });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(0);
  });

  it('returns 0 when < 24h since last_claimed', () => {
    const twelveHoursAgo = new Date(BASE_NOW.getTime() - 12 * 60 * 60 * 1000);
    const inv = makeInvestment({ last_claimed: twelveHoursAgo.toISOString() });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(0);
  });

  it('returns 0 when < 24h since fecha_inicio (no prior claim)', () => {
    const sixHoursAgo = new Date(BASE_NOW.getTime() - 6 * 60 * 60 * 1000);
    const inv = makeInvestment({
      fecha_inicio: sixHoursAgo.toISOString(),
      fecha_fin: new Date(BASE_NOW.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_claimed: null,
    });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(0);
  });

  it('returns ganancia_diaria when >= 24h since last_claimed and active', () => {
    const twentyFiveHoursAgo = new Date(BASE_NOW.getTime() - 25 * 60 * 60 * 1000);
    const inv = makeInvestment({ last_claimed: twentyFiveHoursAgo.toISOString(), ganancia_diaria: 1.20 });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(1.20);
  });

  it('uses fecha_inicio as baseline when never claimed', () => {
    // fecha_inicio is 14 days ago — well past 24h
    const inv = makeInvestment({ last_claimed: null, ganancia_diaria: 10.00 });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(10.00);
  });

  it('returns same value regardless of elapsed days (one claim per cycle)', () => {
    const twoDaysAgo = new Date(BASE_NOW.getTime() - 48 * 60 * 60 * 1000);
    const inv = makeInvestment({ last_claimed: twoDaysAgo.toISOString(), ganancia_diaria: 5.00 });
    // Claim pays ganancia_diaria once, not multiplied by days missed
    expect(accruedEarnings(inv, BASE_NOW)).toBe(5.00);
  });

  it('rounds result to 2 decimal places', () => {
    const twentyFiveHoursAgo = new Date(BASE_NOW.getTime() - 25 * 60 * 60 * 1000);
    const inv = makeInvestment({ last_claimed: twentyFiveHoursAgo.toISOString(), ganancia_diaria: 1.234 });
    expect(accruedEarnings(inv, BASE_NOW)).toBe(1.23);
  });
});

// ── remainingDays ────────────────────────────────────────────────────────────

describe('remainingDays', () => {
  it('returns 0 when expired', () => {
    const inv = makeInvestment({ fecha_fin: new Date('2026-01-01T00:00:00Z').toISOString() });
    expect(remainingDays(inv, BASE_NOW)).toBe(0);
  });

  it('returns 0 exactly at fecha_fin', () => {
    const inv = makeInvestment({ fecha_fin: BASE_NOW.toISOString() });
    expect(remainingDays(inv, BASE_NOW)).toBe(0);
  });

  it('returns positive days for an active investment', () => {
    const days = remainingDays(makeInvestment(), BASE_NOW);
    expect(days).toBeGreaterThan(0);
    expect(days).toBeLessThanOrEqual(365);
  });

  it('rounds up partial days', () => {
    const ninetyMinutesFromNow = new Date(BASE_NOW.getTime() + 90 * 60 * 1000);
    const inv = makeInvestment({ fecha_fin: ninetyMinutesFromNow.toISOString() });
    expect(remainingDays(inv, BASE_NOW)).toBe(1);
  });

  it('returns 1 for exactly 24h remaining', () => {
    const oneDayFromNow = new Date(BASE_NOW.getTime() + 24 * 60 * 60 * 1000);
    const inv = makeInvestment({ fecha_fin: oneDayFromNow.toISOString() });
    expect(remainingDays(inv, BASE_NOW)).toBe(1);
  });
});

// ── uptimeProgress ───────────────────────────────────────────────────────────

describe('uptimeProgress', () => {
  it('returns 0 at fecha_inicio', () => {
    const inv = makeInvestment();
    expect(uptimeProgress(inv, new Date(inv.fecha_inicio))).toBe(0);
  });

  it('returns 1 at fecha_fin', () => {
    const inv = makeInvestment();
    expect(uptimeProgress(inv, new Date(inv.fecha_fin))).toBe(1);
  });

  it('returns 1 after fecha_fin', () => {
    const inv = makeInvestment();
    const afterEnd = new Date(new Date(inv.fecha_fin).getTime() + 1000);
    expect(uptimeProgress(inv, afterEnd)).toBe(1);
  });

  it('returns approximately 0.5 at midpoint', () => {
    const inv = makeInvestment();
    const start = new Date(inv.fecha_inicio).getTime();
    const end = new Date(inv.fecha_fin).getTime();
    const mid = new Date((start + end) / 2);
    expect(uptimeProgress(inv, mid)).toBeCloseTo(0.5, 2);
  });

  it('returns a value between 0 and 1 for active investment', () => {
    const progress = uptimeProgress(makeInvestment(), BASE_NOW);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });
});
