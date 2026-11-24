/**
 * Decorator Pattern — Composable API Handler Pipeline (Logging + Caching + Rate Limiting)
 * Wraps a core data fetcher dynamically with cross-cutting behaviors without subclass explosion.
 */
export interface ApiRequest {
  userId: string;
  resource: string;
}

export interface ApiResponse {
  data: string;
  metadata: string[];
}

export interface DataService {
  fetch(req: ApiRequest): Promise<ApiResponse>;
}

export class CoreDatabaseService implements DataService {
  async fetch(req: ApiRequest): Promise<ApiResponse> {
    return {
      data: `Record for ${req.resource} (user: ${req.userId})`,
      metadata: ["core-db"],
    };
  }
}

abstract class ServiceDecorator implements DataService {
  constructor(protected readonly wrapped: DataService) {}
  abstract fetch(req: ApiRequest): Promise<ApiResponse>;
}

export class LoggingDecorator extends ServiceDecorator {
  async fetch(req: ApiRequest): Promise<ApiResponse> {
    const start = Date.now();
    const res = await this.wrapped.fetch(req);
    return { ...res, metadata: [...res.metadata, `logged(${Date.now() - start}ms)`] };
  }
}

export class CachingDecorator extends ServiceDecorator {
  private readonly cache = new Map<string, ApiResponse>();

  async fetch(req: ApiRequest): Promise<ApiResponse> {
    const key = `${req.userId}:${req.resource}`;
    const hit = this.cache.get(key);
    if (hit) {
      return { data: hit.data, metadata: [...hit.metadata, "cache-HIT"] };
    }
    const fresh = await this.wrapped.fetch(req);
    this.cache.set(key, fresh);
    return { ...fresh, metadata: [...fresh.metadata, "cache-MISS"] };
  }
}

export class RateLimitDecorator extends ServiceDecorator {
  private readonly hits = new Map<string, number>();

  constructor(wrapped: DataService, private readonly limit = 3) {
    super(wrapped);
  }

  async fetch(req: ApiRequest): Promise<ApiResponse> {
    const count = (this.hits.get(req.userId) ?? 0) + 1;
    if (count > this.limit) {
      throw new Error(`Rate limit exceeded for user "${req.userId}" (max ${this.limit})`);
    }
    this.hits.set(req.userId, count);
    const res = await this.wrapped.fetch(req);
    return { ...res, metadata: [...res.metadata, `rate-limit(${count}/${this.limit})`] };
  }
}
