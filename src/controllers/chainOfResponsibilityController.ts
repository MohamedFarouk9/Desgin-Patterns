import { Router, type Request, type Response } from "express";
import { AuthenticationHandler } from "../Behavioral-Patterns/Chain-of-Responsibility/AuthenticationHandler.js";
import { ValidationHandler } from "../Behavioral-Patterns/Chain-of-Responsibility/ValidationHandler.js";
import { LoggingHandler } from "../Behavioral-Patterns/Chain-of-Responsibility/LoggingHandler.js";
import { ErrorHandler } from "../Behavioral-Patterns/Chain-of-Responsibility/ErrorHandler.js";

// Build the chain: Auth → Validation → Logging → Error
const auth = new AuthenticationHandler();
const validation = new ValidationHandler();
const logging = new LoggingHandler();
const error = new ErrorHandler();

auth.setNext(validation).setNext(logging).setNext(error);

const router = Router();

router.post("/process", (req: Request, res: Response) => {
  try {
    const request = {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
    };

    // Pass request through the chain
    const result = auth.handle(request);

    if (result) {
      return res.status(200).json({
        message: "✅ Request processed successfully through Chain of Responsibility",
        chainStatus: "ALL_HANDLERS_PASSED",
      });
    } else {
      return res.status(400).json({
        message: "❌ Request failed at some handler in the chain",
        chainStatus: "SHORT_CIRCUITED",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

router.get("/demo-failure", (req: Request, res: Response) => {
  try {
    // Demo: Request with missing auth token
    const request = {
      method: "POST",
      path: "/api/data",
      headers: { /* no auth header */ },
      body: { name: "Test", email: "invalid-email" },
    };

    const result = auth.handle(request);
    res.json({
      message: "Demo: Chain short-circuited at authentication",
      chainResult: result ? "PASSED" : "FAILED at AuthenticationHandler",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

router.get("/demo-validation-failure", (req: Request, res: Response) => {
  try {
    // Demo: Request with valid auth but invalid data
    const request = {
      method: "POST",
      path: "/api/data",
      headers: { authorization: "Bearer valid-token-123" },
      body: { name: "", email: "invalid" }, // Empty name, invalid email
    };

    const result = auth.handle(request);
    res.json({
      message: "Demo: Chain short-circuited at validation",
      chainResult: result ? "PASSED" : "FAILED at ValidationHandler",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

export default router;