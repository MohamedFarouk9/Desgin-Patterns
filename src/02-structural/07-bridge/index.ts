/**
 * Bridge Pattern — Decoupled Alerting & Delivery Channels
 * Separates Alert Urgency (Abstraction) from Delivery Provider (Implementation) so both scale independently.
 */
export interface MessageSender {
  sendMessage(title: string, body: string): { channel: string; formatted: string };
}

export class EmailSender implements MessageSender {
  sendMessage(title: string, body: string) {
    return { channel: "email", formatted: `[EMAIL] Subject: ${title} | Body: ${body}` };
  }
}

export class PagerDutySender implements MessageSender {
  sendMessage(title: string, body: string) {
    return { channel: "pagerduty", formatted: `[PAGERDUTY INCIDENT] ${title} :: ${body}` };
  }
}

export abstract class AlertNotification {
  constructor(protected readonly sender: MessageSender) {}
  abstract trigger(message: string): { severity: string; channel: string; formatted: string };
}

export class InfoAlert extends AlertNotification {
  trigger(message: string) {
    const res = this.sender.sendMessage("INFO", message);
    return { severity: "info", ...res };
  }
}

export class CriticalAlert extends AlertNotification {
  trigger(message: string) {
    const res = this.sender.sendMessage("CRITICAL P1", `ACTION REQUIRED: ${message}`);
    return { severity: "critical", ...res };
  }
}
