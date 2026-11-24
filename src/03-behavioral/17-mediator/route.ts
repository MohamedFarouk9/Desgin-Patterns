import { Router, type Request, type Response } from "express";
import { LoginMediator } from "./index.js";

const router = Router();
const mediator = new LoginMediator();

router.post("/login", (req: Request, res: Response) => {
  const { token = "" } = req.body as { token?: string };
  const result = mediator.login(token);
  res.status(result.authenticated ? 200 : 401).json({ pattern: "Mediator", ...result });
});

export default router;
