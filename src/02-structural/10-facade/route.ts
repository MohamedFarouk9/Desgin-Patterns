import { Router, type Request, type Response } from "express";
import { CheckoutFacade } from "./index.js";

const router = Router();
const checkout = new CheckoutFacade();

router.post("/checkout", (req: Request, res: Response) => {
  const {
    userId = "user_42",
    sku = "LAPTOP-PRO-16",
    qty = 1,
    amount = 2499,
    address = "123 Cloud St",
  } = req.body as {
    userId?: string;
    sku?: string;
    qty?: number;
    amount?: number;
    address?: string;
  };

  const order = checkout.placeOrder(userId, sku, qty, amount, address);
  res.status(201).json({ pattern: "Facade", order });
});

export default router;
