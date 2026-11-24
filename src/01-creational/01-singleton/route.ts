import { Router, type Request, type Response } from "express";
import { DatabasePool } from "./index.js";

const router = Router();

router.get("/status", (_req: Request, res: Response) => {
  const pool = DatabasePool.getInstance();
  res.json({ pattern: "Singleton", status: pool.getStatus() });
});

router.post("/query", async (req: Request, res: Response) => {
  const { sql, params } = req.body as { sql?: string; params?: unknown[] };
  const poolA = DatabasePool.getInstance();
  const poolB = DatabasePool.getInstance();

  const result = await poolA.query(sql ?? "SELECT NOW()", params ?? []);
  res.json({
    pattern: "Singleton",
    sameInstance: poolA === poolB,
    result,
    status: poolA.getStatus(),
  });
});

export default router;
