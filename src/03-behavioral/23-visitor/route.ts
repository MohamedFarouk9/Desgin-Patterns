import { Router, type Request, type Response } from "express";
import {
  DigitalSubscription,
  InvoiceLineVisitor,
  PhysicalProduct,
  TaxCalculatorVisitor,
  type CartItem,
} from "./index.js";

const router = Router();

router.post("/invoice", (req: Request, res: Response) => {
  const { laptopPrice = 1200, subscriptionMonths = 12 } = req.body as {
    laptopPrice?: number;
    subscriptionMonths?: number;
  };

  const cart: CartItem[] = [
    new PhysicalProduct("Developer Laptop", laptopPrice, 2.5),
    new DigitalSubscription("Cloud Pro Plan", 29, subscriptionMonths),
  ];

  const taxVisitor = new TaxCalculatorVisitor();
  const lineVisitor = new InvoiceLineVisitor();

  const lines = cart.map((item) => item.accept(lineVisitor));
  const totalTax = Number(cart.reduce((sum, item) => sum + item.accept(taxVisitor), 0).toFixed(2));

  res.json({ pattern: "Visitor", lines, totalTax });
});

export default router;
