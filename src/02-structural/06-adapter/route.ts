import { Router, type Request, type Response } from "express";
import { LegacyPaymentGateway, PaymentAdapter } from "./index.js";

const router = Router();

router.post("/process", async (req: Request, res: Response) => {
  const { amount, currency = "USD" } = req.body as { amount?: number; currency?: string };
  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Positive numeric amount is required." });
    return;
  }

  const adapter = new PaymentAdapter(new LegacyPaymentGateway());
  const result = await adapter.processPayment(amount, currency);
  res.json({ pattern: "Adapter", result });
});

export default router;
