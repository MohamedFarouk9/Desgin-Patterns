import { Router, type Request, type Response } from "express";
import { TemplateRegistry } from "../Creational-Patterns/Prototype/Article.js";

const router = Router();

router.get("/templates", (req: Request, res: Response) => {
  res.json({
    message: "Available prototype templates in registry",
    templates: ["black-friday", "product-launch"],
  });
});

router.post("/clone", (req: Request, res: Response) => {
  try {
    const { templateKey, newName, overrideCustomFields } = req.body;

    if (!templateKey) {
      return res.status(400).json({ error: "templateKey is required ('black-friday' or 'product-launch')." });
    }

    // 1. Fetch isolated deep-clone from Prototype Registry
    const clonedDocument = TemplateRegistry.getTemplate(templateKey);

    // 2. Customize the clone without altering the master prototype
    if (newName) {
      clonedDocument.name = newName;
    }
    if (overrideCustomFields && typeof overrideCustomFields === "object") {
      clonedDocument.metadata.customFields = {
        ...clonedDocument.metadata.customFields,
        ...overrideCustomFields,
      };
    }

    return res.status(201).json({
      message: `✅ Prototype cloned successfully from blueprint: "${templateKey}"`,
      clonedDocument,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(404).json({ error: message });
  }
});

export default router;
