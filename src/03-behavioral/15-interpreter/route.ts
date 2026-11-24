import { Router, type Request, type Response } from "express";
import { parseRule, type EvalContext } from "./index.js";

const router = Router();

router.post("/evaluate", (req: Request, res: Response) => {
  try {
    const {
      rule = "country == US AND plan == pro OR role == admin",
      context = { country: "US", plan: "pro", role: "user" },
    } = req.body as { rule?: string; context?: EvalContext };

    const ast = parseRule(rule);
    const matched = ast.interpret(context);
    res.json({ pattern: "Interpreter", rule, context, matched });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Parse error" });
  }
});

export default router;
