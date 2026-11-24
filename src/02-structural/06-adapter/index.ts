/**
 * Adapter Pattern — Legacy Payment Gateway Adapter
 * Translates a modern dollar-based PaymentProcessor interface to an incompatible cents-based LegacyGateway.
 */
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amountCharged: number;
  currency: string;
}

export interface PaymentProcessor {
  processPayment(amountDollars: number, currency: string): Promise<PaymentResult>;
}

// Incompatible 3rd-party / legacy class (expects integer cents & currencyCode)
export class LegacyPaymentGateway {
  public async chargeInCents(amountCents: number, currencyCode: string): Promise<{
    tx_ref: string;
    cents_billed: number;
    status: string;
  }> {
    return {
      tx_ref: `LEG_${Date.now()}`,
      cents_billed: amountCents,
      status: `CHARGED_${currencyCode.toUpperCase()}`,
    };
  }
}

export class PaymentAdapter implements PaymentProcessor {
  constructor(private readonly legacyGateway: LegacyPaymentGateway) {}

  public async processPayment(amountDollars: number, currency: string): Promise<PaymentResult> {
    const cents = Math.round(amountDollars * 100);
    const legacyResp = await this.legacyGateway.chargeInCents(cents, currency);

    return {
      success: legacyResp.status.startsWith("CHARGED"),
      transactionId: legacyResp.tx_ref,
      amountCharged: legacyResp.cents_billed / 100,
      currency: currency.toUpperCase(),
    };
  }
}
