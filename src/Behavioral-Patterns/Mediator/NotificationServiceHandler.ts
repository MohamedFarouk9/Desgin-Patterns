import { Message } from "./Message.js";

export class NotificationServiceHandler {
  public handle(message: Message): void {
    if (message.type !== "login") {
      return;
    }

    const { userId, loginSuccessful } = message.payload;
    if (loginSuccessful && userId) {
      console.log(`[NotificationService] Sending login notification to user: ${userId}`);
    }
  }
}