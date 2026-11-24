import { Router, type Request, type Response } from "express";
import { PaginatedLogCollection } from "./index.js";

const router = Router();

router.get("/demo", (req: Request, res: Response) => {
  const pageSize = Math.max(1, Number(req.query.pageSize) || 2);
  const logs = [
    "[INFO] Server booted",
    "[INFO] DB pool ready",
    "[WARN] High memory on worker-2",
    "[INFO] Cron job finished",
    "[ERROR] Timeout on upstream",
  ];

  const collection = new PaginatedLogCollection(logs, pageSize);
  const iterator = collection.createIterator();
  const pages: string[][] = [];

  while (iterator.hasNext()) {
    pages.push(iterator.next());
  }

  res.json({ pattern: "Iterator", pageSize, totalPages: pages.length, pages });
});

export default router;
