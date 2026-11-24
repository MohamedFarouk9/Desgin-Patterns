/**
 * Chain of Responsibility Pattern — API Request Security & Validation Pipeline
 * Passes a request through Auth -> Schema Validation -> Fraud Check, short-circuiting on failure.
 */
export interface PipelineRequest {
  token?: string | undefined;
  email?: string | undefined;
  amount: number;
  trace: string[];
}

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(req: PipelineRequest): { ok: boolean; failedAt?: string; reason?: string; trace: string[] };
}

abstract class BaseHandler implements Handler {
  private next: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  public handle(req: PipelineRequest) {
    if (this.next) {
      return this.next.handle(req);
    }
    return { ok: true, trace: req.trace };
  }
}

export class AuthHandler extends BaseHandler {
  override handle(req: PipelineRequest) {
    req.trace.push("AuthHandler");
    if (req.token !== "Bearer valid-token-123") {
      return { ok: false, failedAt: "AuthHandler", reason: "Invalid or missing Bearer token", trace: req.trace };
    }
    return super.handle(req);
  }
}

export class ValidationHandler extends BaseHandler {
  override handle(req: PipelineRequest) {
    req.trace.push("ValidationHandler");
    if (!req.email || !req.email.includes("@")) {
      return { ok: false, failedAt: "ValidationHandler", reason: "Valid email is required", trace: req.trace };
    }
    return super.handle(req);
  }
}

export class FraudCheckHandler extends BaseHandler {
  override handle(req: PipelineRequest) {
    req.trace.push("FraudCheckHandler");
    if (req.amount > 10000) {
      return { ok: false, failedAt: "FraudCheckHandler", reason: "Amount exceeds $10,000 limit", trace: req.trace };
    }
    return super.handle(req);
  }
}
