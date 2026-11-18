import { PricingStrategy } from "./PricingStrategy.js";

export class PricingContext {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: PricingStrategy): void {
    this.strategy = strategy;
    console.log(`[PricingContext] Strategy switched to: ${strategy.constructor.name}`);
  }

  public executeStrategy(basePrice: number, context?: any): number {
    return this.strategy.calculatePrice(basePrice, context);
  }
}