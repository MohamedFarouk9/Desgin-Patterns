export class LegacyPaymentGateway {
  // This class remains unchanged - we cannot modify it
  processPayment(amount: number, currency: string, callback: (result: any) => void): void {
    // Simulate legacy callback-based API
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      callback({
        success,
        transactionId: `legacy_tx_${Date.now()}`,
        amount,
        currency,
        response: "Legacy gateway response"
      });
    }, 100);
  }
}