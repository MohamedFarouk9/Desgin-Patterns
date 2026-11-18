import { AbstractHandler } from "./AbstractHandler.js";

export class ValidationHandler extends AbstractHandler {
  public handle(request: any): boolean {
    const { name, email } = request.body;

    if (!name || name.trim().length === 0) {
      console.log("[ValidationHandler] Missing or empty 'name' field");
      return false; // Short-circuit
    }

    if (!email || !email.includes('@')) {
      console.log("[ValidationHandler] Invalid email format");
      return false; // Short-circuit
    }

    console.log("[ValidationHandler] Request validated successfully");

    // Pass to next handler if exists
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return true; // Chain completed successfully
  }
}