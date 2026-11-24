import { Router, type Request, type Response } from "express";
import { AuthHandler, FraudCheckHandler, ValidationHandler } from "./index.js";

const router = Router();
const auth = new AuthHandler();
auth.setNext(new ValidationHandler()).setNext(new FraudCheckHandler());

router.post("/process", (req: Request, res: Response) => {
  const { email, amount = 100 } = req.body as { email?: string; amount?: number };
  const result = auth.handle({
    token: req.headers.authorization,
    email,
    amount,
    trace: [],
  });

  res.status(result.ok ? 200 : 400).json({ pattern: "Chain of Responsibility", ...result });
});

export default router;
