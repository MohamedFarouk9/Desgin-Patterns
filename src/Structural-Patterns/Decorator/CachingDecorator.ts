import { ExpressResponse } from "./ExpressResponse.js";
import { ResponseDecorator } from "./ResponseDecorator.js";

export class CachingDecorator extends ResponseDecorator {
  private cache: Map<string, any>;
  private ttl: number;

  constructor(response: ExpressResponse, cache: Map<string, any>, ttl: number = 300000) {
    super(response);
    this.cache = cache;
    this.ttl = ttl;
  }

  public json(body: any): void {
    const cacheKey = `response_${Date.now()}`;
    this.cache.set(cacheKey, { body, timestamp: Date.now() });
    super.json(body);
  }

  public send(body: string): void {
    super.send(body);
  }
}