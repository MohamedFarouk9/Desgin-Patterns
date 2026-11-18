import { Router, type Request, type Response } from "express";
import { DatabasePoolManager } from "../Creational-Patterns/Singleton/DatabaseSingleton.js";
import { serializePoolManager, deserializePoolManager } from "../Creational-Patterns/Singleton/DatabaseSingleton.js";

const router = Router();

// Middleware to add correlation ID for tracing
router.use((req: Request, res: Response, next: Function) => {
  (req as any).correlationId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  next();
});

router.get("/status", (req: Request, res: Response) => {
  const pool = DatabasePoolManager.getInstance();
  res.json({
    message: "✅ Database connection pool status retrieved via Singleton",
    status: pool.getStatus(),
    correlationId: (req as any).correlationId,
  });
});

router.post("/query", async (req: Request, res: Response) => {
  const { sql, params } = req.body;
  const pool1 = DatabasePoolManager.getInstance();
  const pool2 = DatabasePoolManager.getInstance();

  const isExactSameReference = pool1 === pool2;
  const result = await pool1.query(sql || "SELECT NOW()", params || []);

  res.json({
    message: "Query executed successfully on shared pool instance",
    isExactSameReference,
    result,
    poolStatus: pool1.getStatus(),
    correlationId: (req as any).correlationId,
  });
});

/**
 * GET /api/singleton/serialize
 * Returns a JSON-serializable state of the pool manager (for monitoring/logging).
 */
router.get("/serialize", (req: Request, res: Response) => {
  const pool = DatabasePoolManager.getInstance();
  const serialized = serializePoolManager(pool);
  res.json({
    message: "Pool manager state serialized for monitoring",
    correlationId: (req as any).correlationId,
    serialized,
  });
});

/**
 * POST /api/singleton/deserialize
 * Accepts a JSON state and safely applies it to the singleton (monitoring only).
 */
router.post("/deserialize", (req: Request, res: Response) => {
  const { jsonStr } = req.body;
  try {
    const pool = deserializePoolManager(jsonStr);
    res.json({
      message: "Pool manager state deserialized (monitoring only)",
      correlationId: (req as any).correlationId,
      isConnected: pool.isConnected,
      activeConnections: pool.activeConnections,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to deserialize pool state",
      error: error instanceof Error ? error.message : String(error),
      correlationId: (req as any).correlationId,
    });
  }
});

export default router;