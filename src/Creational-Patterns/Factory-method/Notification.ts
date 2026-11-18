export interface NotificationPayload {
  recipient: string;
  subject?: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  channel: string;
  messageId: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Product Interface
export interface INotificationChannel {
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

// Concrete Product 1: Email Notification
export class EmailNotificationChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[EmailGateway] Dispatching SMTP email to ${payload.recipient} with subject "${payload.subject ?? "Alert"}"`);
    return {
      success: true,
      channel: "email",
      messageId: `email_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      details: { smtpServer: "smtp.sendgrid.net", recipient: payload.recipient },
    };
  }
}

// Concrete Product 2: SMS Notification
export class SMSNotificationChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[SMSGateway] Dispatching SMS payload via Twilio to ${payload.recipient}`);
    return {
      success: true,
      channel: "sms",
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      details: { provider: "Twilio", recipient: payload.recipient },
    };
  }
}

// Concrete Product 3: Mobile Push Notification
export class PushNotificationChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[PushGateway] Dispatching FCM push notification to device token ${payload.recipient}`);
    return {
      success: true,
      channel: "push",
      messageId: `push_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      details: { service: "Firebase Cloud Messaging", deviceToken: payload.recipient },
    };
  }
}

// Concrete Product 4: Slack Webhook Notification
export class SlackNotificationChannel implements INotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    console.log(`[SlackGateway] Posting webhook notification to channel/webhook ${payload.recipient}`);
    return {
      success: true,
      channel: "slack",
      messageId: `slack_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      details: { platform: "Slack Bot", target: payload.recipient },
    };
  }
}
