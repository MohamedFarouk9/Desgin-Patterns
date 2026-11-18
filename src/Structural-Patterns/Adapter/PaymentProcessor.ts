export interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: string;
}