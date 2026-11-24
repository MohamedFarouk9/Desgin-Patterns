import { Router, type Request, type Response } from "express";
import { Department, Employee } from "./index.js";

const router = Router();

router.post("/budget", (req: Request, res: Response) => {
  const { engineeringBonus = 0 } = req.body as { engineeringBonus?: number };

  const backend = new Department("Backend Team")
    .add(new Employee("Alice (Staff Eng)", 180000 + engineeringBonus))
    .add(new Employee("Bob (Senior Eng)", 150000));

  const frontend = new Department("Frontend Team")
    .add(new Employee("Carol (Lead UI)", 145000));

  const engineering = new Department("Engineering Org")
    .add(backend)
    .add(frontend)
    .add(new Employee("VP of Engineering", 240000));

  res.json({
    pattern: "Composite",
    totalOrgBudget: engineering.getBudget(),
    hierarchy: engineering.toJSON(),
  });
});

export default router;
