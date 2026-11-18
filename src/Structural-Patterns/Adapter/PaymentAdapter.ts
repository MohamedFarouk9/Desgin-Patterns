import { PaymentProcessor, PaymentResult } from "./PaymentProcessor.js";
import { LegacyPaymentGateway } from "./LegacyPaymentGateway.js";

export class PaymentAdapter implements PaymentProcessor {
  private adaptee: LegacyPaymentGateway;

  constructor(adaptee: LegacyPaymentGateway) {
    this.adaptee = adaptee;
  }

  public async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    return new Promise((resolve) => {
      this.adaptee.processPayment(amount, currency, (result: any) => {
        const paymentResult: PaymentResult = {
          success: result.success,
          transactionId: result.transactionId,
          amount,
          currency,
          timestamp: new Date().toISOString()
        };
        resolve(paymentResult);
      });
    });
  }
}