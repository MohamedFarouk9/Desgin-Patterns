import { Router, type Request, type Response } from "express";
import { getNotificationDispatcher } from "./index.js";

const router = Router();

router.post("/send", async (req: Request, res: Response) => {
  try {
    const { channel, recipient, subject, body } = req.body as {
      channel?: string;
      recipient?: string;
      subject?: string;
      body?: string;
    };

    if (!channel || !recipient || !body) {
      res.status(400).json({ error: "channel, recipient, and body are required." });
      return;
    }

    const dispatcher = getNotificationDispatcher(channel);
    const result = await dispatcher.notify({ recipient, subject, body });
    res.json({ pattern: "Factory Method", result });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
