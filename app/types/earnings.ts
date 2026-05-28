export interface EarningsHistory {
  id: number;
  fecha: string;
  plan: string;
  ganancia: number;
  reclamado: boolean;
  user_id: string;
}

export interface ActivePlan {
  nombre: string;
  rendimiento: string;
  imagen: string;
} 