import { AbstractHandler } from "./AbstractHandler.js";

export class ErrorHandler extends AbstractHandler {
  public handle(request: any): boolean {
    // This is the fallback - if any previous handler didn't process,
    // we here mean the request fully passed all checks
    console.log("[ErrorHandler] Request passed all middleware - proceeding to handler");

    // In a real app, this might trigger the actual route handler
    // For this demo, we just indicate success
    return true;
  }
}