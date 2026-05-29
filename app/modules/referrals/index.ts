const RATES: [number, number, number] = [0.06, 0.03, 0.01];

export interface ReferralPayout {
  userId: string;
  level: 1 | 2 | 3;
  percent: number;
  payout: number;
}

export function computeReferralPayouts(amount: number, upline: string[]): ReferralPayout[] {
  if (amount <= 0) return [];
  return upline.slice(0, 3).map((userId, i) => ({
    userId,
    level: (i + 1) as 1 | 2 | 3,
    percent: RATES[i],
    payout: parseFloat((amount * RATES[i]).toFixed(8)),
  }));
}
