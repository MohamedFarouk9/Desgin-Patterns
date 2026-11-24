import { Router, type Request, type Response } from "express";
import { OrderContext } from "./index.js";

const router = Router();
let currentOrder = new OrderContext();

router.post("/reset", (_req: Request, res: Response) => {
  currentOrder = new OrderContext();
  res.json({ pattern: "State", state: currentOrder.state.name });
});

router.post("/:action", (req: Request, res: Response) => {
  try {
    const action = req.params.action;
    let message: string;
    if (action === "pay") message = currentOrder.pay();
    else if (action === "ship") message = currentOrder.ship();
    else if (action === "deliver") message = currentOrder.deliver();
    else {
      res.status(400).json({ error: "Valid actions: pay, ship, deliver, reset" });
      return;
    }
    res.json({ pattern: "State", message, state: currentOrder.state.name });
  } catch (err) {
    res.status(409).json({
      error: err instanceof Error ? err.message : "Invalid transition",
      currentState: currentOrder.state.name,
    });
  }
});

export default router;
