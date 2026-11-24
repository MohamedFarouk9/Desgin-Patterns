import { Router, type Request, type Response } from "express";
import {
  BulkTieredPricing,
  PercentageDiscountPricing,
  PricingContext,
  RegularPricing,
  type PricingStrategy,
} from "./index.js";

const router = Router();

router.post("/calculate", (req: Request, res: Response) => {
  const { strategy = "regular", basePrice = 100, qty = 1, percent = 20 } = req.body as {
    strategy?: string;
    basePrice?: number;
    qty?: number;
    percent?: number;
  };

  let impl: PricingStrategy;
  if (strategy === "percentage") impl = new PercentageDiscountPricing(percent);
  else if (strategy === "tiered") impl = new BulkTieredPricing();
  else impl = new RegularPricing();

  const ctx = new PricingContext(impl);
  res.json({ pattern: "Strategy", ...ctx.checkout(basePrice, qty) });
});

export default router;
