export interface DatabaseConnection {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>;
  close(): Promise<void>;
  getStatus(): { isConnected: boolean; poolSize: number; activeConnections: number; createdAt: string };
}

export class DatabasePoolManager {
  private static instance: DatabasePoolManager | null = null;
  private isConnected: boolean = false;
  private readonly maxPoolSize: number = 10;
  private activeConnections: number = 0;
  private readonly createdAt: string;

  // Private constructor prevents direct instantiation with `new`
  private constructor() {
    this.createdAt = new Date().toISOString();
    this.initPool();
  }

  // Centralized single point of access
  public static getInstance(): DatabasePoolManager {
    if (!DatabasePoolManager.instance) {
      DatabasePoolManager.instance = new DatabasePoolManager();
    }
    return DatabasePoolManager.instance;
  }

  private initPool(): void {
    this.isConnected = true;
    console.log(`[DatabasePoolManager] Initialized connection pool at ${this.createdAt}. Max size: ${this.maxPoolSize}`);
  }

  public async query(sql: string, params: unknown[] = []): Promise<{ rows: unknown[]; rowCount: number }> {
    if (!this.isConnected) {
      throw new Error("Cannot execute query: Database pool is disconnected.");
    }
    if (this.activeConnections >= this.maxPoolSize) {
      throw new Error(`Connection pool exhausted (Active: ${this.activeConnections}/${this.maxPoolSize}).`);
    }

    this.activeConnections++;
    try {
      // Simulate asynchronous database I/O latency
      await new Promise((resolve) => setTimeout(resolve, 50));
      return {
        rows: [{ id: 1, executedSql: sql, params, timestamp: new Date().toISOString() }],
        rowCount: 1,
      };
    } finally {
      this.activeConnections--;
    }
  }

  public getStatus() {
    return {
      isConnected: this.isConnected,
      poolSize: this.maxPoolSize,
      activeConnections: this.activeConnections,
      createdAt: this.createdAt,
    };
  }

  public async close(): Promise<void> {
    this.isConnected = false;
    this.activeConnections = 0;
    DatabasePoolManager.instance = null;
    console.log("[DatabasePoolManager] Pool connections gracefully closed.");
  }
}

// Backward compatibility alias if needed
export default DatabasePoolManager;
