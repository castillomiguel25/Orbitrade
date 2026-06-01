import { WITHDRAWAL_FEE_PERCENT } from "@/app/constants/withdrawal";

export type WithdrawalValidation = { ok: boolean; error?: string };

export function validateWithdrawal(
  amount: number,
  available: number,
  minAmount: number
): WithdrawalValidation {
  if (!amount || amount <= 0) return { ok: false, error: 'invalid_amount' };
  if (amount < minAmount) return { ok: false, error: 'below_minimum' };
  if (amount > available) return { ok: false, error: 'insufficient_balance' };
  return { ok: true };
}

export function computeFeePercent(weeklyCount: number, hasFlow: boolean): number {
  void weeklyCount;
  void hasFlow;
  return WITHDRAWAL_FEE_PERCENT;
}

export function computeFinalAmount(
  amount: number,
  feePercent: number
): { fee: number; finalAmount: number } {
  const fee = parseFloat((amount * (feePercent / 100)).toFixed(2));
  const finalAmount = parseFloat((amount - fee).toFixed(2));
  return { fee, finalAmount };
}

export function verifyWithdrawalKey(inputKey: string, storedKey: string): boolean {
  if (!storedKey) return false;
  return inputKey.trim() === storedKey;
}
