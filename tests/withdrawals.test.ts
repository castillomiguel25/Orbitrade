import { describe, it, expect } from 'vitest';
import {
  validateWithdrawal,
  computeFeePercent,
  computeFinalAmount,
  verifyWithdrawalKey,
} from '../app/modules/withdrawals';

describe('validateWithdrawal', () => {
  it('rejects zero amount', () => {
    expect(validateWithdrawal(0, 100, 15).ok).toBe(false);
  });

  it('rejects negative amount', () => {
    expect(validateWithdrawal(-5, 100, 15).ok).toBe(false);
  });

  it('rejects amount below minimum', () => {
    const result = validateWithdrawal(10, 100, 15);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('below_minimum');
  });

  it('rejects amount exceeding available balance', () => {
    const result = validateWithdrawal(200, 100, 15);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('insufficient_balance');
  });

  it('accepts amount equal to minimum', () => {
    expect(validateWithdrawal(15, 100, 15).ok).toBe(true);
  });

  it('accepts amount equal to available balance', () => {
    expect(validateWithdrawal(100, 100, 15).ok).toBe(true);
  });

  it('accepts valid amount between min and available', () => {
    expect(validateWithdrawal(50, 100, 15).ok).toBe(true);
  });
});

describe('computeFeePercent', () => {
  it('returns 10% for first withdrawal of the week (count=0)', () => {
    expect(computeFeePercent(0, false)).toBe(10);
  });

  it('returns 15% for second withdrawal of the week (count=1)', () => {
    expect(computeFeePercent(1, false)).toBe(15);
  });

  it('returns 20% for third+ withdrawal (count=2)', () => {
    expect(computeFeePercent(2, false)).toBe(20);
  });

  it('returns 20% for count=5', () => {
    expect(computeFeePercent(5, false)).toBe(20);
  });

  it('adds 20% penalty when hasFlow is true (count=0)', () => {
    expect(computeFeePercent(0, true)).toBe(30);
  });

  it('adds 20% penalty when hasFlow is true (count=1)', () => {
    expect(computeFeePercent(1, true)).toBe(35);
  });

  it('adds 20% penalty when hasFlow is true (count=2)', () => {
    expect(computeFeePercent(2, true)).toBe(40);
  });
});

describe('computeFinalAmount', () => {
  it('computes fee and final amount correctly', () => {
    const result = computeFinalAmount(100, 10);
    expect(result.fee).toBe(10);
    expect(result.finalAmount).toBe(90);
  });

  it('rounds to 2 decimal places', () => {
    const result = computeFinalAmount(33.33, 15);
    expect(result.fee).toBe(5.00);
    expect(result.finalAmount).toBe(28.33);
  });

  it('handles 20% fee', () => {
    const result = computeFinalAmount(500, 20);
    expect(result.fee).toBe(100);
    expect(result.finalAmount).toBe(400);
  });
});

describe('verifyWithdrawalKey', () => {
  it('returns true when keys match', () => {
    expect(verifyWithdrawalKey('mykey123', 'mykey123')).toBe(true);
  });

  it('returns false when keys differ', () => {
    expect(verifyWithdrawalKey('mykey123', 'wrongkey')).toBe(false);
  });

  it('is case-sensitive', () => {
    expect(verifyWithdrawalKey('MyKey', 'mykey')).toBe(false);
  });

  it('returns false when stored key is empty (not configured)', () => {
    expect(verifyWithdrawalKey('anykey', '')).toBe(false);
  });

  it('returns false when stored key is null-like (no key set)', () => {
    expect(verifyWithdrawalKey('anykey', null as unknown as string)).toBe(false);
  });

  it('trims whitespace from input key before comparing', () => {
    expect(verifyWithdrawalKey('  mykey  ', 'mykey')).toBe(true);
  });
});
