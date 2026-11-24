import { Router, type Request, type Response } from "express";
import {
  CachingDecorator,
  CoreDatabaseService,
  LoggingDecorator,
  RateLimitDecorator,
} from "./index.js";

const router = Router();

// Compose pipeline: RateLimit -> Cache -> Logging -> CoreDB
const pipeline = new RateLimitDecorator(
  new CachingDecorator(new LoggingDecorator(new CoreDatabaseService())),
  5
);

router.post("/fetch", async (req: Request, res: Response) => {
  try {
    const { userId = "user_1", resource = "profile" } = req.body as {
      userId?: string;
      resource?: string;
    };
    const result = await pipeline.fetch({ userId, resource });
    res.json({ pattern: "Decorator", result });
  } catch (err) {
    res.status(429).json({ error: err instanceof Error ? err.message : "Rate limited" });
  }
});

export default router;
