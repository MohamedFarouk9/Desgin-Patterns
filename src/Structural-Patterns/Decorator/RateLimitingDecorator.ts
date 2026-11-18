import { ExpressResponse } from "./ExpressResponse.js";
import { ResponseDecorator } from "./ResponseDecorator.js";

export class RateLimitingDecorator extends ResponseDecorator {
  private rateLimiter: (req: any) => { allowed: boolean; reset: Date };

  constructor(response: ExpressResponse, rateLimiter: (req: any) => { allowed: boolean; reset: Date }) {
    super(response);
    this.rateLimiter = rateLimiter;
  }

  public json(body: any): void {
    this.setHeader('X-RateLimit-Limit', '100');
    this.setHeader('X-RateLimit-Remaining', '99');
    this.setHeader('X-RateLimit-Reset', new Date(this.rateLimiter({}).reset).toISOString());
    super.json(body);
  }

  public send(body: string): void {
    super.send(body);
  }
}