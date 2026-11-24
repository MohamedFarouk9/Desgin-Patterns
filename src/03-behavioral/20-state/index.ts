/**
 * State Pattern — E-Commerce Order Lifecycle State Machine
 * Eliminates fragile status `if/else` checks by delegating behavior to explicit State classes.
 */
export interface OrderState {
  readonly name: string;
  pay(order: OrderContext): string;
  ship(order: OrderContext): string;
  deliver(order: OrderContext): string;
}

export class OrderContext {
  public state: OrderState = new PendingState();
  public pay() { return this.state.pay(this); }
  public ship() { return this.state.ship(this); }
  public deliver() { return this.state.deliver(this); }
}

class PendingState implements OrderState {
  public readonly name = "PENDING";
  pay(order: OrderContext): string {
    order.state = new PaidState();
    return "Payment accepted -> moved to PAID";
  }
  ship(): string { throw new Error("Cannot ship an unpaid PENDING order."); }
  deliver(): string { throw new Error("Cannot deliver an unpaid PENDING order."); }
}

class PaidState implements OrderState {
  public readonly name = "PAID";
  pay(): string { throw new Error("Order is already PAID."); }
  ship(order: OrderContext): string {
    order.state = new ShippedState();
    return "Order handed to carrier -> moved to SHIPPED";
  }
  deliver(): string { throw new Error("Cannot deliver before shipping."); }
}

class ShippedState implements OrderState {
  public readonly name = "SHIPPED";
  pay(): string { throw new Error("Order is already PAID."); }
  ship(): string { throw new Error("Order is already SHIPPED."); }
  deliver(order: OrderContext): string {
    order.state = new DeliveredState();
    return "Package signed -> moved to DELIVERED";
  }
}

class DeliveredState implements OrderState {
  public readonly name = "DELIVERED";
  pay(): string { throw new Error("Order is already DELIVERED."); }
  ship(): string { throw new Error("Order is already DELIVERED."); }
  deliver(): string { throw new Error("Order is already DELIVERED."); }
}
