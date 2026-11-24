/**
 * Mediator Pattern — Microservice Login Orchestrator
 * Coordinates AuthService, UserService, and AuditService without them importing each other.
 */
export interface Mediator {
  notify(sender: string, event: string, data?: Record<string, unknown>): void;
}

class AuthColleague {
  constructor(private readonly mediator: Mediator) {}
  verifyToken(token: string) {
    const valid = token === "valid-jwt-123";
    this.mediator.notify("AuthService", valid ? "AUTH_OK" : "AUTH_FAIL", { token });
    return valid;
  }
}

class UserColleague {
  loadProfile(userId: string) {
    return { userId, role: "admin", plan: "enterprise" };
  }
}

class AuditColleague {
  public readonly logs: string[] = [];
  record(entry: string) {
    this.logs.push(`${new Date().toISOString()} :: ${entry}`);
  }
}

export class LoginMediator implements Mediator {
  private readonly auth = new AuthColleague(this);
  private readonly users = new UserColleague();
  private readonly audit = new AuditColleague();
  private lastProfile: Record<string, unknown> | null = null;

  public login(token: string) {
    this.lastProfile = null;
    const ok = this.auth.verifyToken(token);
    return { authenticated: ok, profile: this.lastProfile, auditLog: [...this.audit.logs] };
  }

  public notify(_sender: string, event: string, data?: Record<string, unknown>): void {
    if (event === "AUTH_OK") {
      this.lastProfile = this.users.loadProfile("user_101");
      this.audit.record("Login succeeded -> profile loaded");
    } else if (event === "AUTH_FAIL") {
      this.audit.record(`Login rejected for token=${String(data?.token ?? "")}`);
    }
  }
}
