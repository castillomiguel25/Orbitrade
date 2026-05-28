export type Withdrawal = {
  id: string;
  timestamp: string;
  amount?: number;
  finalamount: number;
  trc20address: string;
  is_processed: boolean;
  bank_details?: string;
};

export type Retiro = {
  id: string;
  fecha: string;
  monto: number;
  wallet: string;
  red: string;
  estado: 'Completado' | 'Procesando' | string;
}; 
