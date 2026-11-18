import { Mediator } from "./Mediator.js";
import { Message } from "./Message.js";

export class LoginMediator implements Mediator {
  private handlers: Map<string, (message: Message) => void> = new Map();

  public register(serviceName: string, handler: (message: Message) => void): void {
    this.handlers.set(serviceName, handler);
    console.log(`[LoginMediator] Registered: ${serviceName}`);
  }

  public route(message: Message): void {
    const handler = this.handlers.get(message.type);
    if (handler) {
      handler(message);
    } else {
      console.log(`[LoginMediator] No handler for message type: ${message.type}`);
    }
  }

  public notify(event: string, data: any): void {
    this.handlers.forEach((handler, serviceName) => {
      try {
        handler({ type: event, payload: data, from: "mediator", timestamp: new Date().toISOString() });
      } catch (error) {
        console.error(`[LoginMediator] Error notifying ${serviceName}:`, error);
      }
    });
  }
}