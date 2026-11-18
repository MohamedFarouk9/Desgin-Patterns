import { Router, type Request, type Response } from "express";
import { CloudFactoryProvider } from "../Creational-Patterns/Abstract-Factory/CloudInfrastructureFactory.js";

const router = Router();

router.post("/process-media", async (req: Request, res: Response) => {
  try {
    const { provider, fileName, fileContentBase64 } = req.body;

    // 1. Resolve family of cloud services using the Abstract Factory
    const factory = CloudFactoryProvider.getFactory(provider);

    const storageService = factory.createStorageService();
    const queueService = factory.createQueueService();
    const cdnService = factory.createCDNService();

    // 2. Perform end-to-end operation across the cloud suite
    const buffer = Buffer.from(fileContentBase64 || "Mock File Content Buffer", "utf-8");
    const safeName = fileName || `asset_${Date.now()}.png`;

    const uploadResult = await storageService.uploadFile(safeName, buffer);
    const queueResult = await queueService.publishJob("media-processing-queue", {
      fileUrl: uploadResult.fileUrl,
      storageId: uploadResult.storageId,
      action: "generate-thumbnails",
    });
    const cdnResult = await cdnService.purgeCache([`/assets/${safeName}`]);

    return res.status(200).json({
      message: `✅ End-to-end media pipeline executed using Abstract Factory (${provider || "local"})`,
      pipelineResults: {
        storage: uploadResult,
        queue: queueResult,
        cdn: cdnResult,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

export default router;
