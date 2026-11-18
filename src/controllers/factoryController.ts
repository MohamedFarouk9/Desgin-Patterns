import { Router, type Request, type Response } from "express";
import { NotificationFactoryResolver } from "../Creational-Patterns/Factory-method/NotificationFactory.js";

const router = Router();

router.post("/send", async (req: Request, res: Response) => {
  try {
    const { channel, recipient, subject, body, metadata } = req.body;

    if (!channel || !recipient || !body) {
      return res.status(400).json({
        error: "Missing mandatory fields: 'channel' (email|sms|push|slack), 'recipient', 'body'.",
      });
    }

    // Use Factory Method to dynamically resolve channel dispatcher
    const dispatcher = NotificationFactoryResolver.getDispatcher(channel);
    const result = await dispatcher.notify({
      recipient,
      subject,
      body,
      metadata,
    });

    return res.status(200).json({
      message: `✅ Notification dispatched successfully via Factory Method (${channel})`,
      result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(400).json({ error: message });
  }
});

export default router;
