/**
 * Visitor Pattern — Shopping Cart Tax & Export Operations
 * Adds new operations (Tax calculation, JSON/XML export) to stable Item classes without modifying them.
 */
export interface CartItem {
  accept<T>(visitor: CartVisitor<T>): T;
}

export class PhysicalProduct implements CartItem {
  constructor(public readonly name: string, public readonly price: number, public readonly weightKg: number) {}
  accept<T>(visitor: CartVisitor<T>): T {
    return visitor.visitPhysical(this);
  }
}

export class DigitalSubscription implements CartItem {
  constructor(public readonly name: string, public readonly monthlyPrice: number, public readonly months: number) {}
  accept<T>(visitor: CartVisitor<T>): T {
    return visitor.visitDigital(this);
  }
}

export interface CartVisitor<T> {
  visitPhysical(item: PhysicalProduct): T;
  visitDigital(item: DigitalSubscription): T;
}

export class TaxCalculatorVisitor implements CartVisitor<number> {
  visitPhysical(item: PhysicalProduct): number {
    // 10% sales tax + $2/kg shipping surcharge
    return Number((item.price * 0.1 + item.weightKg * 2).toFixed(2));
  }
  visitDigital(item: DigitalSubscription): number {
    // 5% digital goods VAT
    return Number((item.monthlyPrice * item.months * 0.05).toFixed(2));
  }
}

export class InvoiceLineVisitor implements CartVisitor<string> {
  visitPhysical(item: PhysicalProduct): string {
    return `[PHYSICAL] ${item.name} (${item.weightKg}kg) - $${item.price}`;
  }
  visitDigital(item: DigitalSubscription): string {
    return `[DIGITAL] ${item.name} (${item.months}mo) - $${item.monthlyPrice * item.months}`;
  }
}
