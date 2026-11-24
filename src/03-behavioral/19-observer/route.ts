import { Router, type Request, type Response } from "express";
import { AnalyticsObserver, EmailReceiptObserver, OrderSubject } from "./index.js";

const router = Router();
const orderBus = new OrderSubject();
orderBus.subscribe(new EmailReceiptObserver());
orderBus.subscribe(new AnalyticsObserver());

router.post("/order-placed", (req: Request, res: Response) => {
  const { orderId = `ORD_${Date.now()}`, total = 149.99 } = req.body as {
    orderId?: string;
    total?: number;
  };

  const notifications = orderBus.publishOrderPlaced({ orderId, total });
  res.json({ pattern: "Observer", orderId, total, notifiedSubscribers: notifications });
});

export default router;
