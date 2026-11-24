/**
 * Facade Pattern — Order Checkout Orchestrator
 * Hides complex subsystem calls (Inventory, Payment, Shipping, Email) behind one simple checkout() method.
 */
class InventoryService {
  reserve(sku: string, qty: number) { return { reserved: true, sku, qty }; }
}
class BillingService {
  charge(userId: string, amount: number) { return { paid: true, txId: `tx_${Date.now()}`, userId, amount }; }
}
class ShippingService {
  schedule(sku: string, address: string) { return { trackingCode: `TRK_${Date.now()}`, sku, address }; }
}
class ReceiptMailer {
  send(userId: string, txId: string) { return { sent: true, to: userId, txId }; }
}

export class CheckoutFacade {
  private readonly inventory = new InventoryService();
  private readonly billing = new BillingService();
  private readonly shipping = new ShippingService();
  private readonly mailer = new ReceiptMailer();

  public placeOrder(userId: string, sku: string, qty: number, amount: number, address: string) {
    const stock = this.inventory.reserve(sku, qty);
    const payment = this.billing.charge(userId, amount);
    const shipment = this.shipping.schedule(sku, address);
    const receipt = this.mailer.send(userId, payment.txId);

    return { orderId: `ORD_${Date.now()}`, stock, payment, shipment, receipt };
  }
}
