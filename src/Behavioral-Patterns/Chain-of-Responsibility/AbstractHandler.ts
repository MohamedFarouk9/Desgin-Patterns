import { RequestHandler } from "./RequestHandler.js";

export abstract class AbstractHandler implements RequestHandler {
  protected nextHandler: RequestHandler | null = null;

  public setNext(handler: RequestHandler): RequestHandler {
    this.nextHandler = handler;
    return handler;
  }

  public abstract handle(request: any): boolean;
}