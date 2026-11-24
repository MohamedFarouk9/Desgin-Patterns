import { Router, type Request, type Response } from "express";
import { CsvImporter, JsonImporter } from "./index.js";

const router = Router();

router.post("/import", (req: Request, res: Response) => {
  try {
    const { format = "csv", data = "name,email\nAlice,alice@co.com" } = req.body as {
      format?: string;
      data?: string;
    };

    const importer = format.toLowerCase() === "json" ? new JsonImporter() : new CsvImporter();
    const result = importer.import(data);
    res.json({ pattern: "Template Method", ...result });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Import failed" });
  }
});

export default router;
