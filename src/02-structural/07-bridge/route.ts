import { Router, type Request, type Response } from "express";
import { CriticalAlert, EmailSender, InfoAlert, PagerDutySender } from "./index.js";

const router = Router();

router.post("/alert", (req: Request, res: Response) => {
  const { severity = "info", channel = "email", message = "System check" } = req.body as {
    severity?: string;
    channel?: string;
    message?: string;
  };

  const sender = channel === "pagerduty" ? new PagerDutySender() : new EmailSender();
  const alert = severity === "critical" ? new CriticalAlert(sender) : new InfoAlert(sender);

  res.json({ pattern: "Bridge", result: alert.trigger(message) });
});

export default router;
