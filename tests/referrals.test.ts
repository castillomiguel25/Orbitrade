import { describe, it, expect } from 'vitest';
import { computeReferralPayouts } from '../app/modules/referrals';

describe('computeReferralPayouts', () => {
  it('returns empty array for zero amount', () => {
    expect(computeReferralPayouts(0, ['u1', 'u2', 'u3'])).toEqual([]);
  });

  it('returns empty array for negative amount', () => {
    expect(computeReferralPayouts(-10, ['u1'])).toEqual([]);
  });

  it('returns empty array for empty upline', () => {
    expect(computeReferralPayouts(100, [])).toEqual([]);
  });

  it('applies 6% for level 1', () => {
    const [p] = computeReferralPayouts(100, ['u1']);
    expect(p.level).toBe(1);
    expect(p.percent).toBe(0.06);
    expect(p.payout).toBe(6);
  });

  it('applies 3% for level 2', () => {
    const [, p] = computeReferralPayouts(100, ['u1', 'u2']);
    expect(p.level).toBe(2);
    expect(p.percent).toBe(0.03);
    expect(p.payout).toBe(3);
  });

  it('applies 1% for level 3', () => {
    const [, , p] = computeReferralPayouts(100, ['u1', 'u2', 'u3']);
    expect(p.level).toBe(3);
    expect(p.percent).toBe(0.01);
    expect(p.payout).toBe(1);
  });

  it('handles upline of 1 (only direct referrer)', () => {
    const result = computeReferralPayouts(200, ['u1']);
    expect(result).toHaveLength(1);
    expect(result[0].payout).toBe(12);
  });

  it('handles upline of 2', () => {
    const result = computeReferralPayouts(200, ['u1', 'u2']);
    expect(result).toHaveLength(2);
    expect(result[0].payout).toBe(12);
    expect(result[1].payout).toBe(6);
  });

  it('handles full upline of 3', () => {
    const result = computeReferralPayouts(200, ['u1', 'u2', 'u3']);
    expect(result).toHaveLength(3);
    expect(result[0].payout).toBe(12);
    expect(result[1].payout).toBe(6);
    expect(result[2].payout).toBe(2);
  });

  it('ignores extra upline beyond 3 levels', () => {
    const result = computeReferralPayouts(100, ['u1', 'u2', 'u3', 'u4', 'u5']);
    expect(result).toHaveLength(3);
  });

  it('assigns correct userIds', () => {
    const result = computeReferralPayouts(100, ['alice', 'bob', 'carol']);
    expect(result[0].userId).toBe('alice');
    expect(result[1].userId).toBe('bob');
    expect(result[2].userId).toBe('carol');
  });

  it('handles fractional amounts', () => {
    const result = computeReferralPayouts(33.33, ['u1']);
    expect(result[0].payout).toBeCloseTo(1.9998, 4);
  });

  it('handles large amounts', () => {
    const result = computeReferralPayouts(10000, ['u1', 'u2', 'u3']);
    expect(result[0].payout).toBe(600);
    expect(result[1].payout).toBe(300);
    expect(result[2].payout).toBe(100);
  });

  it('returns correct level 3 payout on 1 USDT', () => {
    const result = computeReferralPayouts(1, ['u1', 'u2', 'u3']);
    expect(result[2].payout).toBe(0.01);
  });
});
