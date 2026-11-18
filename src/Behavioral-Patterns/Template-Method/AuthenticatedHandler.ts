import type { Request } from "express";
import { APIHandler } from "./APIHandler.js";

export class AuthenticatedHandler extends APIHandler {
  protected validateInput(request: Request): boolean {
    const { name, email } = request.body;
    return !!(name && email && email.includes('@'));
  }

  protected authenticate(request: Request): boolean {
    const authHeader = request.headers?.authorization;
    return authHeader === 'Bearer valid-token';
  }

  protected authorize(request: Request): boolean {
    // Authenticated handlers are always authorized
    return true;
  }

  protected businessLogic(request: Request): any {
    const { name, email } = request.body;
    return { name, email, processedAt: new Date().toISOString() };
  }
}