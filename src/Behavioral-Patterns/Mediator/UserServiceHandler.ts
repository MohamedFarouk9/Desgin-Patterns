import { Message } from "./Message.js";

export class UserServiceHandler {
  public handle(message: Message): void {
    if (message.type !== "login") {
      return;
    }

    const { userId, loginSuccessful } = message.payload;
    if (loginSuccessful && userId) {
      console.log(`[UserService] User ${userId} login processed, setting session`);
    }
  }
}