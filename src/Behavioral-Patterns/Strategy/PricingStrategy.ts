export interface PricingStrategy {
  calculatePrice(basePrice: number, context?: any): number;
}