import { PricingStrategy } from "./PricingStrategy.js";

export class TieredPricing implements PricingStrategy {
  private tiers: Array<{ minQuantity: number; discountPercentage: number }>;

  constructor(tiers: Array<{ minQuantity: number; discountPercentage: number }>) {
    this.tiers = tiers.sort((a, b) => a.minQuantity - b.minQuantity);
  }

  public calculatePrice(basePrice: number, context?: any): number {
    if (!context || !context.quantity) {
      return basePrice;
    }

    const { quantity } = context;

    for (const tier of this.tiers) {
      if (quantity >= tier.minQuantity) {
        const discount = basePrice * (tier.discountPercentage / 100);
        const finalPrice = basePrice - discount;
        console.log(`[TieredPricing] Quantity ${quantity} qualifies for ${tier.discountPercentage}% discount: ${basePrice} -> ${finalPrice}`);
        return Math.max(finalPrice, 0);
      }
    }

    return basePrice;
  }
}