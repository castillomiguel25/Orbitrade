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
  let base = 10;
  if (weeklyCount === 1) base = 15;
  else if (weeklyCount >= 2) base = 20;
  return hasFlow ? base + 20 : base;
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
