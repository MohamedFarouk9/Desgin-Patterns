import { PricingStrategy } from "./PricingStrategy.js";

export class PercentageDiscountPricing implements PricingStrategy {
  private discountPercentage: number;

  constructor(discountPercentage: number) {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Discount percentage must be between 0 and 100");
    }
    this.discountPercentage = discountPercentage;
  }

  public calculatePrice(basePrice: number, context?: any): number {
    const discount = basePrice * (this.discountPercentage / 100);
    const finalPrice = basePrice - discount;
    console.log(`[PercentageDiscountPricing] ${this.discountPercentage}% off ${basePrice} = ${finalPrice}`);
    return Math.max(finalPrice, 0);
  }
}