export type InvestmentPlanType = {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  altText: string;
  rendimiento: number;
  monto?: number;
  minPrice?: number;
  maxPrice?: number;
  duracionDias: number;
  titleKey: string;
  descriptionKey: string;
  maxPerUser?: number;
}; 
