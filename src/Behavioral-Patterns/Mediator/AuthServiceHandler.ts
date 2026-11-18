import { Message } from "./Message.js";

export class AuthServiceHandler {
  private jwtSecret: string = process.env.JWT_SECRET || "default-secret";

  public handle(message: Message): void {
    if (message.type !== "login") {
      return;
    }

    const { token } = message.payload;
    if (!token) {
      console.log("[AuthService] Login message missing token");
      return;
    }

    const isValid = token === "valid-jwt-token-123";

    if (isValid) {
      const userId = `user_${Math.floor(Math.random() * 10000)}`;
      console.log(`[AuthService] Token verified for user: ${userId}`);
      message.payload.userId = userId;
      message.payload.loginSuccessful = true;
    } else {
      console.log("[AuthService] Invalid token rejected");
    }
  }
}