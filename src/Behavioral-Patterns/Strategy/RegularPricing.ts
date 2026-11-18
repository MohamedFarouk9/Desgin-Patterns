import { PricingStrategy } from "./PricingStrategy.js";

export class RegularPricing implements PricingStrategy {
  public calculatePrice(basePrice: number, context?: any): number {
    return basePrice;
  }
}