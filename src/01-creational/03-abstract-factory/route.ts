import { Router, type Request, type Response } from "express";
import { getCloudFactory } from "./index.js";

const router = Router();

router.post("/process-media", async (req: Request, res: Response) => {
  try {
    const { provider = "local", fileName = "asset.png" } = req.body as {
      provider?: string;
      fileName?: string;
    };

    const factory = getCloudFactory(provider);
    const storage = factory.createStorage();
    const queue = factory.createQueue();
    const cdn = factory.createCDN();

    const uploaded = await storage.upload(fileName, 1024);
    const queued = await queue.publish("media-transcode", { url: uploaded.url });
    const purged = await cdn.purge([`/assets/${fileName}`]);

    res.json({ pattern: "Abstract Factory", provider, uploaded, queued, purged });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
