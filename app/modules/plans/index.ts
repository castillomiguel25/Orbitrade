export type PlanTier = 'entry' | 'industrial';

export interface Plan {
  id: string;
  tier: PlanTier;
  titleKey: string;
  descriptionKey: string;
  rendimiento: number; // daily yield %
  minPrice: number;
  maxPrice: number;
  duracionDias: number;
  imagePath: string;
}

export interface PurchaseValidation {
  ok: boolean;
  error?: string;
}

// Placeholder numbers — owner confirms before launch
const PLANS: readonly Plan[] = [
  {
    id: 'plan-entry',
    tier: 'entry',
    titleKey: 'plans.entry.title',
    descriptionKey: 'plans.entry.description',
    rendimiento: 1.2,   // TBD
    minPrice: 20,       // TBD
    maxPrice: 499,      // TBD
    duracionDias: 365,
    imagePath: '/orbitrade-plan-entry.png',
  },
  {
    id: 'plan-industrial',
    tier: 'industrial',
    titleKey: 'plans.industrial.title',
    descriptionKey: 'plans.industrial.description',
    rendimiento: 2.0,   // TBD
    minPrice: 500,      // TBD
    maxPrice: 5000,     // TBD
    duracionDias: 365,
    imagePath: '/orbitrade-plan-industrial.png',
  },
];

export function getPlans(): Plan[] {
  return [...PLANS];
}

export function getPlan(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id);
}

export function validatePurchase(plan: Plan, amount: number): PurchaseValidation {
  if (typeof amount !== 'number' || !isFinite(amount) || isNaN(amount)) {
    return { ok: false, error: 'Monto inválido' };
  }
  if (amount < plan.minPrice) {
    return { ok: false, error: `El monto mínimo es ${plan.minPrice} USDT` };
  }
  if (amount > plan.maxPrice) {
    return { ok: false, error: `El monto máximo es ${plan.maxPrice} USDT` };
  }
  return { ok: true };
}
