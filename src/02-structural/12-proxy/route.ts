import { Router, type Request, type Response } from "express";
import { ReportAccessProxy } from "./index.js";

const router = Router();
const reportProxy = new ReportAccessProxy();

router.get("/report", async (req: Request, res: Response) => {
  try {
    const quarter = (req.query.quarter as string) || "Q4-2026";
    const role = (req.headers["x-user-role"] as string) || "guest";

    const report = await reportProxy.getFinancialReport(quarter, role);
    res.json({ pattern: "Proxy", report });
  } catch (err) {
    res.status(403).json({ error: err instanceof Error ? err.message : "Forbidden" });
  }
});

export default router;
