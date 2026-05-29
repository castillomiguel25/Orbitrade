import { describe, it, expect } from 'vitest';
import { getPlans, getPlan, validatePurchase } from '../app/modules/plans';

describe('plans catalog', () => {
  it('returns exactly 2 plans', () => {
    expect(getPlans()).toHaveLength(2);
  });

  it('includes entry tier', () => {
    const plans = getPlans();
    const entry = plans.find(p => p.tier === 'entry');
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('plan-entry');
  });

  it('includes industrial tier', () => {
    const plans = getPlans();
    const industrial = plans.find(p => p.tier === 'industrial');
    expect(industrial).toBeDefined();
    expect(industrial?.id).toBe('plan-industrial');
  });

  it('each plan has required fields', () => {
    for (const plan of getPlans()) {
      expect(plan.id).toBeTruthy();
      expect(plan.tier).toMatch(/^(entry|industrial)$/);
      expect(plan.titleKey).toBeTruthy();
      expect(plan.descriptionKey).toBeTruthy();
      expect(plan.rendimiento).toBeGreaterThan(0);
      expect(plan.minPrice).toBeGreaterThan(0);
      expect(plan.maxPrice).toBeGreaterThan(plan.minPrice);
      expect(plan.duracionDias).toBeGreaterThan(0);
    }
  });
});

describe('getPlan', () => {
  it('returns entry plan by id', () => {
    const plan = getPlan('plan-entry');
    expect(plan).toBeDefined();
    expect(plan?.tier).toBe('entry');
  });

  it('returns industrial plan by id', () => {
    const plan = getPlan('plan-industrial');
    expect(plan).toBeDefined();
    expect(plan?.tier).toBe('industrial');
  });

  it('returns undefined for unknown id', () => {
    expect(getPlan('does-not-exist')).toBeUndefined();
    expect(getPlan('')).toBeUndefined();
    expect(getPlan('zyx-drone')).toBeUndefined();
  });
});

describe('validatePurchase', () => {
  const entry = getPlan('plan-entry')!;
  const industrial = getPlan('plan-industrial')!;

  it('accepts amount at min boundary', () => {
    expect(validatePurchase(entry, entry.minPrice)).toEqual({ ok: true });
    expect(validatePurchase(industrial, industrial.minPrice)).toEqual({ ok: true });
  });

  it('accepts amount at max boundary', () => {
    expect(validatePurchase(entry, entry.maxPrice)).toEqual({ ok: true });
    expect(validatePurchase(industrial, industrial.maxPrice)).toEqual({ ok: true });
  });

  it('accepts valid mid-range amounts', () => {
    const mid = Math.floor((entry.minPrice + entry.maxPrice) / 2);
    expect(validatePurchase(entry, mid)).toEqual({ ok: true });
  });

  it('rejects amount below min', () => {
    const result = validatePurchase(entry, entry.minPrice - 1);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects amount above max', () => {
    const result = validatePurchase(entry, entry.maxPrice + 1);
    expect(result.ok).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('rejects NaN', () => {
    expect(validatePurchase(entry, NaN).ok).toBe(false);
  });

  it('rejects non-finite values', () => {
    expect(validatePurchase(entry, Infinity).ok).toBe(false);
    expect(validatePurchase(entry, -Infinity).ok).toBe(false);
  });

  it('rejects zero', () => {
    expect(validatePurchase(entry, 0).ok).toBe(false);
  });

  it('rejects negative amounts', () => {
    expect(validatePurchase(entry, -10).ok).toBe(false);
  });

  it('industrial plan validates independently', () => {
    expect(validatePurchase(industrial, industrial.minPrice - 1).ok).toBe(false);
    expect(validatePurchase(industrial, industrial.maxPrice + 1).ok).toBe(false);
    expect(validatePurchase(industrial, industrial.minPrice).ok).toBe(true);
  });

  it('same plan can be purchased multiple times (validation is stateless)', () => {
    expect(validatePurchase(entry, entry.minPrice).ok).toBe(true);
    expect(validatePurchase(entry, entry.minPrice).ok).toBe(true);
  });
});
