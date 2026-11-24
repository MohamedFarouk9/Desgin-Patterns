/**
 * Factory Method Pattern — Multi-Channel Notification Dispatcher
 * Decouples business logic from concrete notification providers (Email, SMS, Push, Slack).
 */
export interface NotificationPayload {
  recipient: string;
  subject?: string | undefined;
  body: string;
}

export interface NotificationResult {
  channel: string;
  messageId: string;
  recipient: string;
  sentAt: string;
}

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<NotificationResult>;
}

class EmailChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    return {
      channel: "email",
      messageId: `email_${Date.now()}`,
      recipient: payload.recipient,
      sentAt: new Date().toISOString(),
    };
  }
}

class SmsChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    return {
      channel: "sms",
      messageId: `sms_${Date.now()}`,
      recipient: payload.recipient,
      sentAt: new Date().toISOString(),
    };
  }
}

class SlackChannel implements NotificationChannel {
  async send(payload: NotificationPayload): Promise<NotificationResult> {
    return {
      channel: "slack",
      messageId: `slack_${Date.now()}`,
      recipient: payload.recipient,
      sentAt: new Date().toISOString(),
    };
  }
}

// Creator with the Factory Method
export abstract class NotificationDispatcher {
  protected abstract createChannel(): NotificationChannel;

  public async notify(payload: NotificationPayload): Promise<NotificationResult> {
    const channel = this.createChannel();
    return channel.send(payload);
  }
}

export class EmailDispatcher extends NotificationDispatcher {
  protected createChannel(): NotificationChannel {
    return new EmailChannel();
  }
}

export class SmsDispatcher extends NotificationDispatcher {
  protected createChannel(): NotificationChannel {
    return new SmsChannel();
  }
}

export class SlackDispatcher extends NotificationDispatcher {
  protected createChannel(): NotificationChannel {
    return new SlackChannel();
  }
}

const dispatchers: Record<string, () => NotificationDispatcher> = {
  email: () => new EmailDispatcher(),
  sms: () => new SmsDispatcher(),
  slack: () => new SlackDispatcher(),
};

export function getNotificationDispatcher(channel: string): NotificationDispatcher {
  const factory = dispatchers[channel.toLowerCase()];
  if (!factory) {
    throw new Error(`Unsupported channel "${channel}". Use: ${Object.keys(dispatchers).join(", ")}`);
  }
  return factory();
}
