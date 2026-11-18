import { Router, type Request, type Response } from "express";
import { DatabasePoolManager } from "../Creational-Patterns/Singlton/DatabaseSingleton.js";

const router = Router();

router.get("/status", (req: Request, res: Response) => {
  const pool = DatabasePoolManager.getInstance();
  res.json({
    message: "✅ Database connection pool status retrieved via Singleton",
    status: pool.getStatus(),
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
  });
});

export default router;
