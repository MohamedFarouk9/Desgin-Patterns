import { AbstractHandler } from "./AbstractHandler.js";

export class AuthenticationHandler extends AbstractHandler {
  public handle(request: any): boolean {
    // Check for auth token in header
    const authHeader = request.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("[AuthenticationHandler] Missing or invalid auth token");
      return false; // Short-circuit: stop chain
    }

    const token = authHeader.split(' ')[1];
    // Simulate token validation
    const isValid = token === 'valid-token-123';

    if (!isValid) {
      console.log("[AuthenticationHandler] Invalid token");
      return false; // Short-circuit
    }

    console.log("[AuthenticationHandler] Token validated successfully");

    // Pass to next handler if exists
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return true; // Chain completed successfully
  }
}