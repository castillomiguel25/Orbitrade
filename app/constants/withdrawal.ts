export const WITHDRAWAL_MIN_AMOUNT = 15;
export const WITHDRAWAL_FEE_PERCENT = 10;
export const WITHDRAWAL_NETWORK = 'BEP20';
export const WITHDRAWAL_ESTIMATED_TIME = '0-48 horas';
export const WITHDRAWAL_WEEKLY_TIERS = [10, 20, 30, 30, 30];

export function getWeeklyWithdrawalFeePercent(withdrawalsThisWeek: number): number {
  // withdrawalsThisWeek = 0 para el primer retiro de la semana => 10%
  const index = Math.min(Math.max(withdrawalsThisWeek, 0), WITHDRAWAL_WEEKLY_TIERS.length - 1);
  return WITHDRAWAL_WEEKLY_TIERS[index];
}
