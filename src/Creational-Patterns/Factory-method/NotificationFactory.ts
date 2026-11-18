import type {
  INotificationChannel,
  NotificationPayload,
  NotificationResult,
} from "./Notification.js";
import {
  EmailNotificationChannel,
  SMSNotificationChannel,
  PushNotificationChannel,
  SlackNotificationChannel,
} from "./Notification.js";

// Abstract Creator: Defines the factory method that subclasses or implementations provide
export abstract class NotificationDispatcher {
  // The Factory Method
  abstract createChannel(): INotificationChannel;

  // Core business logic relying on the product created by the factory method
  public async notify(payload: NotificationPayload): Promise<NotificationResult> {
    const channel = this.createChannel();
    console.log(`[NotificationDispatcher] Initiating dispatch through factory-created channel...`);
    const result = await channel.send(payload);
    console.log(`[NotificationDispatcher] Notification sent successfully. Message ID: ${result.messageId}`);
    return result;
  }
}

// Concrete Creator 1: Email Dispatcher
export class EmailDispatcher extends NotificationDispatcher {
  createChannel(): INotificationChannel {
    return new EmailNotificationChannel();
  }
}

// Concrete Creator 2: SMS Dispatcher
export class SMSDispatcher extends NotificationDispatcher {
  createChannel(): INotificationChannel {
    return new SMSNotificationChannel();
  }
}

// Concrete Creator 3: Push Dispatcher
export class PushDispatcher extends NotificationDispatcher {
  createChannel(): INotificationChannel {
    return new PushNotificationChannel();
  }
}

// Concrete Creator 4: Slack Dispatcher
export class SlackDispatcher extends NotificationDispatcher {
  createChannel(): INotificationChannel {
    return new SlackNotificationChannel();
  }
}

// Parameterized Factory Helper (Registry) to resolve dispatcher based on runtime input
export type NotificationType = "email" | "sms" | "push" | "slack";

export class NotificationFactoryResolver {
  private static registry: Map<NotificationType, () => NotificationDispatcher> = new Map([
    ["email", () => new EmailDispatcher()],
    ["sms", () => new SMSDispatcher()],
    ["push", () => new PushDispatcher()],
    ["slack", () => new SlackDispatcher()],
  ]);

  public static getDispatcher(type: string): NotificationDispatcher {
    const factory = this.registry.get(type.toLowerCase() as NotificationType);
    if (!factory) {
      throw new Error(`Unsupported notification channel: "${type}". Allowed: email, sms, push, slack.`);
    }
    return factory();
  }

  // Extensibility: allow plugins/modules to register new channels at runtime
  public static registerChannel(type: NotificationType, factory: () => NotificationDispatcher): void {
    this.registry.set(type, factory);
  }
}
