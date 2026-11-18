export interface RequestHandler {
  handle(request: any): boolean;
  setNext(handler: RequestHandler): RequestHandler;
}