export function formatWithdrawalDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function calculateWithdrawalFee(amount: number, percent: number): number {
  return amount * (percent / 100);
}

export function calculateFinalWithdrawalAmount(amount: number, percent: number): number {
  return amount - calculateWithdrawalFee(amount, percent);
} 