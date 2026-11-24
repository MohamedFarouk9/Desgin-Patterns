/**
 * Strategy Pattern — Dynamic E-Commerce Pricing & Discount Engine
 * Swaps pricing algorithms at runtime without giant `if/else` blocks in checkout.
 */
export interface PricingStrategy {
  readonly name: string;
  calculate(basePrice: number, qty: number): number;
}

export class RegularPricing implements PricingStrategy {
  public readonly name = "regular";
  calculate(basePrice: number, qty: number) {
    return basePrice * qty;
  }
}

export class PercentageDiscountPricing implements PricingStrategy {
  public readonly name = "percentage";
  constructor(private readonly percent: number) {}
  calculate(basePrice: number, qty: number) {
    return Number((basePrice * qty * (1 - this.percent / 100)).toFixed(2));
  }
}

export class BulkTieredPricing implements PricingStrategy {
  public readonly name = "tiered";
  calculate(basePrice: number, qty: number) {
    const discount = qty >= 10 ? 0.2 : qty >= 5 ? 0.1 : 0;
    return Number((basePrice * qty * (1 - discount)).toFixed(2));
  }
}

export class PricingContext {
  constructor(private strategy: PricingStrategy) {}
  setStrategy(strategy: PricingStrategy) { this.strategy = strategy; }
  checkout(basePrice: number, qty: number) {
    return {
      strategy: this.strategy.name,
      unitPrice: basePrice,
      qty,
      finalTotal: this.strategy.calculate(basePrice, qty),
    };
  }
}
