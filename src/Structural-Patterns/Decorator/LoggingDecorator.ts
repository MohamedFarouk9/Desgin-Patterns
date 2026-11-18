import { ExpressResponse } from "./ExpressResponse.js";
import { ResponseDecorator } from "./ResponseDecorator.js";

export class LoggingDecorator extends ResponseDecorator {
  private logger: (message: string) => void;

  constructor(response: ExpressResponse, logger: (message: string) => void) {
    super(response);
    this.logger = logger;
  }

  public json(body: any): void {
    this.logger(`[LOG] Sending JSON response: ${JSON.stringify(body)}`);
    super.json(body);
  }

  public send(body: string): void {
    this.logger(`[LOG] Sending response body (${body.length} chars)`);
    super.send(body);
  }
}