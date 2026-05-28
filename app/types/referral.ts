export interface ReferralProfile {
  id: string;
  email: string;
  referralCode: string;
}

export interface Referral {
  id: string;
  email?: string | null;
  nombre: string;
  fecha: string;
  nivel: number;
  depositoActivo: boolean;
  totalGanado: string;
  frozenbalance?: string;
  frozenbalanceAdjusted?: string;
} 
