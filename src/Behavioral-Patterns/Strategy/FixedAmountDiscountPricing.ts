import { PricingStrategy } from "./PricingStrategy.js";

export class FixedAmountDiscountPricing implements PricingStrategy {
  private discountAmount: number;

  constructor(discountAmount: number) {
    if (discountAmount < 0) {
      throw new Error("Discount amount cannot be negative");
    }
    this.discountAmount = discountAmount;
  }

  public calculatePrice(basePrice: number, context?: any): number {
    const finalPrice = basePrice - this.discountAmount;
    console.log(`[FixedAmountDiscountPricing] ${this.discountAmount} off ${basePrice} = ${finalPrice}`);
    return Math.max(finalPrice, 0);
  }
}