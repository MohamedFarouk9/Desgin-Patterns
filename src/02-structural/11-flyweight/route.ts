import { Router, type Request, type Response } from "express";
import { AssetFlyweightFactory } from "./index.js";

const router = Router();

router.post("/render", (req: Request, res: Response) => {
  const { assetKey = "company-logo", page = "/home", x = 0, y = 0 } = req.body as {
    assetKey?: string;
    page?: string;
    x?: number;
    y?: number;
  };

  const { asset, cacheHit } = AssetFlyweightFactory.getAsset(assetKey);
  res.json({
    pattern: "Flyweight",
    cacheHit,
    intrinsicSharedAsset: asset,
    extrinsicRenderContext: { page, x, y },
    memoryStats: AssetFlyweightFactory.getStats(),
  });
});

router.get("/stats", (_req: Request, res: Response) => {
  res.json({ pattern: "Flyweight", stats: AssetFlyweightFactory.getStats() });
});

export default router;
