# ✨ Decorator Pattern: Dynamic Feature Stacking

## 1. 🚨 The Real Production Problem
In Node.js/Express applications, middleware and feature enhancement often require stacking multiple behaviors dynamically. Without Decorator:

- **Rigid Inheritance Hierarchies:** Must create `LoggedSecurityMiddleware`, `RateLimitedLoggedMiddleware`, `CachedRateLimitedLoggedMiddleware`, etc.
- ** combinatorial Explosion:** N classes for every combination of features
- **Difficult to Disable/Reorder Features:** Changing middleware order requires restructuring the class hierarchy
- **Violates Single Responsibility:** Each middleware class tries to do too many things

## 2. 💡 How Decorator Solves It
The **Decorator Pattern** attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

### Core Benefits:
* **Runtime Flexibility:** Add/remove features at runtime without class restructuring
* **Open/Closed Friendly:** Add new decorators without modifying existing code
* **Composition Over Inheritance:** Combine behaviors flexibly via composition
* **Single Responsibility:** Each decorator has one concern (logging, caching, rate limiting, etc.)

## 3. 📊 Visual Diagram (Flow & Structure)

### Class Diagram
```mermaid
classDiagram
    class ExpressResponse {
        +send(body): void
        +json(body): void
        +status(code): this
    }

    class LoggingDecorator {
        +#response: ExpressResponse
        +#logger: Logger
        +send(body): void
        +json(body): void
    }

    class CachingDecorator {
        +#response: ExpressResponse
        +#cache: CacheStore
        +send(body): void
        +json(body): void
    }

    class RateLimitingDecorator {
        +#response: ExpressResponse
        +#rateLimiter: RateLimiter
        +send(body): void
        +json(body): void
    }

    class BaseResponseDecorator {
        <<interface>>
        +send(body): void
        +json(body): void
    }

    ExpressResponse <|-- BaseResponseDecorator
    BaseResponseDecorator <|-- LoggingDecorator
    BaseResponseDecorator <|-- CachingDecorator
    BaseResponseDecorator <|-- RateLimitingDecorator

    LoggingDecorator --> ExpressResponse : wraps
    CachingDecorator --> ExpressResponse : wraps
    RateLimitingDecorator --> ExpressResponse : wraps

    Note for LoggingDecorator "Adds request/response logging"
    Note for CachingDecorator "Adds response caching"
    Note for RateLimitingDecorator "Adds rate limiting headers"
```

### Execution Flow
```mermermaid
sequenceDiagram
    autonumber
    actor Client as API Consumer
    participant Decorated as RateLimitedLoggedCachedResponse
    participant RateLimiter as RateLimiter
    participant Logger as Logger
    participant Cache as CacheStore
    participant Base as Base ExpressResponse

    Client->>Decorated: GET /api/data
    Decorated->>RateLimiter: checkRateLimit()
    RateLimiter-->>Decorated: 200 (within limit) / 429 (over limit)
    Decorated->>Cache: isCached(key)
    Cache-->>Decorated: cached_response [or] null
    alt Cached
      Decorated-->>Client: cached_response
    else Not Cached
      Decorated->>Base: send(data)
      Base-->>Client: response data
      Client->>Cache: store response
    end
    
    Decorated->>Logger: logRequest(req, res)
    Logger-->>Decorated: "Request logged"
    Decorated-->>Client: full response
```

## 4. 💻 Code Implementation

### Step 1: Define Component Interface
```typescript
export interface ExpressResponse {
  json(body: any): void;
  send(body: string): void;
  status(code: number): this;
}
```

### Step 2: Create Concrete Component
```typescript
export class BaseExpressResponse implements ExpressResponse {
  private response: any; // Express Response object

  constructor(response: any) {
    this.response = response;
  }

  public json(body: any): void {
    this.response.json(body);
  }

  public send(body: string): void {
    this.response.send(body);
  }

  public status(code: number): this {
    this.response.status(code);
    return this;
  }
}
```

### Step 3: Create Base Decorator
```typescript
export class ResponseDecorator implements ExpressResponse {
  private response: ExpressResponse;

  constructor(response: ExpressResponse) {
    this.response = response;
  }

  public json(body: any): void {
    this.response.json(body);
  }

  public send(body: string): void {
    this.response.send(body);
  }

  public status(code: number): this {
    this.response.status(code);
    return this;
  }
}
```

### Step 4: Implement Concrete Decorators

#### Logging Decorator
```typescript
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
```

#### Caching Decorator
```typescript
export class CachingDecorator extends ResponseDecorator {
  private cache: Map<string, any>;
  private ttl: number; // Time to live in milliseconds

  constructor(response: ExpressResponse, cache: Map<string, any>, ttl: number = 300000) {
    super(response);
    this.cache = cache;
    this.ttl = ttl;
  }

  public json(body: any): void {
    const cacheKey = `response_${Date.now()}`;
    this.cache.set(cacheKey, { body, timestamp: Date.now() });
    this.ttl = this.ttl || 300000;
    
    // Set cache header
    // this.response.setHeader('X-Cache-Key', cacheKey);
    
    super.json(body);
  }

  public send(body: string): void {
    super.send(body);
  }
}
```

#### Rate Limiting Decorator
```typescript
export class RateLimitingDecorator extends ResponseDecorator {
  private rateLimiter: (req: any) => { allowed: boolean; reset: Date };

  constructor(response: ExpressResponse, rateLimiter: (req: any) => { allowed: boolean; reset: Date }) {
    super(response);
    this.rateLimiter = rateLimiter;
  }

  public json(body: any): void {
    // In a real implementation, we'd have access to the original request
    // For this demo, we'll always allow but set headers
    this.response.setHeader('X-RateLimit-Limit', '100');
    this.response.setHeader('X-RateLimit-Remaining', '99');
    this.response.setHeader('X-RateLimit-Reset', new Date(this.rateLimiter({}).reset).toISOString());
    super.json(body);
  }

  public send(body: string): void {
    super.send(body);
  }
}
```

### Usage / Composition
```typescript
// Create base response
const baseRes = new BaseExpressResponse(expressResponse);

// Compose decorators dynamically at runtime
const loggedRes = new LoggingDecorator(baseRes, console.log);
const cachedRes = new CachingDecorator(loggedRes, new Map());
const rateLimitedRes = new RateLimitingDecorator(cachedRes, (req) => ({ allowed: true, reset: new Date(Date.now() + 60000) }));

// Now rateLimitedRes has ALL features: rate limiting + caching + logging
// Can also remove decorators by not composing them
```

## 5. 🔧 Production Enhancements
- **Factory Pattern:** Create decorator pipelines declaratively
- **Configuration-driven:** Read decorator stack from config file
- **Error Handling:** Decorators can wrap error handling
- **Metrics:** Decorators can track usage statistics