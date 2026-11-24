import { Router, type Request, type Response } from "express";
import { TemplateRegistry } from "./index.js";

const router = Router();

router.get("/templates", (_req: Request, res: Response) => {
  res.json({ pattern: "Prototype", templates: TemplateRegistry.listKeys() });
});

router.post("/clone", (req: Request, res: Response) => {
  try {
    const { templateKey, newName, overrideCustomFields } = req.body as {
      templateKey?: string;
      newName?: string;
      overrideCustomFields?: Record<string, unknown>;
    };

    if (!templateKey) {
      res.status(400).json({ error: "templateKey is required." });
      return;
    }

    const cloned = TemplateRegistry.cloneTemplate(templateKey);
    if (newName) cloned.name = newName;
    if (overrideCustomFields) {
      cloned.customFields = { ...cloned.customFields, ...overrideCustomFields };
    }

    res.status(201).json({ pattern: "Prototype", cloned });
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
