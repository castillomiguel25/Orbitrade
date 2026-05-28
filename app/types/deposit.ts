export type Deposit = {
  id: string;
  fecha: string;
  plan: string;
  monto: number;
  estado: 'Completado' | 'Pendiente' | 'Activo' | 'Finalizado' | 'Otro';
  txid: string;
};

export type DepositPlan = {
  id: string;
  nombre: string;
  rendimiento: string;
  monto: string;
  duracion: string;
  titleKey: string;
  durationKey: string;
}; 