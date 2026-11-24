/**
 * Observer Pattern — Event-Driven Order & Telemetry Pub/Sub
 * Decouples the Subject (OrderEvents) from multiple independent Subscribers (Email, Analytics, Inventory).
 */
export interface OrderEvent {
  orderId: string;
  total: number;
}

export interface OrderObserver {
  readonly name: string;
  update(event: OrderEvent): string;
}

export class EmailReceiptObserver implements OrderObserver {
  public readonly name = "EmailReceiptObserver";
  update(event: OrderEvent) {
    return `Sent receipt for ${event.orderId} ($${event.total})`;
  }
}

export class AnalyticsObserver implements OrderObserver {
  public readonly name = "AnalyticsObserver";
  update(event: OrderEvent) {
    return `Tracked revenue +$${event.total} for ${event.orderId}`;
  }
}

export class OrderSubject {
  private observers: OrderObserver[] = [];

  subscribe(observer: OrderObserver) {
    if (!this.observers.some((o) => o.name === observer.name)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(name: string) {
    this.observers = this.observers.filter((o) => o.name !== name);
  }

  publishOrderPlaced(event: OrderEvent): Record<string, string>[] {
    return this.observers.map((o) => ({ observer: o.name, action: o.update(event) }));
  }
}
