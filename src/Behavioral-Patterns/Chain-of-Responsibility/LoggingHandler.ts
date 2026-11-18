import { AbstractHandler } from "./AbstractHandler.js";

export class LoggingHandler extends AbstractHandler {
  public handle(request: any): boolean {
    console.log(`[LoggingHandler] Processing request: ${request.method} ${request.path}`);
    console.log(`[LoggingHandler] Request body keys: ${Object.keys(request.body).join(', ')}`);

    // Always pass to next - logging is additive
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }

    return true;
  }
}