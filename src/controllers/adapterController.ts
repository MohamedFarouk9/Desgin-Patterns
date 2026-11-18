import { Router, type Request, type Response } from "express";
import { PaymentProcessor, PaymentResult } from "../Structural-Patterns/Adapter/PaymentProcessor.js";
import { LegacyPaymentGateway } from "../Structural-Patterns/Adapter/LegacyPaymentGateway.js";
import { PaymentAdapter } from "../Structural-Patterns/Adapter/PaymentAdapter.js";

const router = Router();

router.post("/process", async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: "amount and currency are required." });
    }

    // Create legacy gateway and adapter
    const legacyGateway = new LegacyPaymentGateway();
    const adapter = new PaymentAdapter(legacyGateway);

    // Process payment through adapter (client sees modern interface)
    const result: PaymentResult = await adapter.processPayment(amount, currency);

    return res.status(200).json({
      message: "✅ Payment processed via Adapter Pattern",
      result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

export default router;