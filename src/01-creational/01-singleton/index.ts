/**
 * Singleton Pattern — Database Connection Pool Manager
 * Ensures a single shared pool exists across the entire Node.js service.
 */
export class DatabasePool {
  private static instance: DatabasePool | null = null;
  private readonly maxConnections: number;
  private activeConnections = 0;
  private readonly createdAt: string;

  private constructor(maxConnections = 20) {
    this.maxConnections = maxConnections;
    this.createdAt = new Date().toISOString();
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool(Number(process.env.DB_POOL_MAX) || 20);
    }
    return DatabasePool.instance;
  }

  public async query(sql: string, params: unknown[] = []): Promise<{
    rows: Record<string, unknown>[];
    rowCount: number;
  }> {
    if (this.activeConnections >= this.maxConnections) {
      throw new Error(`Pool exhausted (${this.activeConnections}/${this.maxConnections} active)`);
    }

    this.activeConnections++;
    try {
      await new Promise((r) => setTimeout(r, 10));
      return {
        rows: [{ executedSql: sql, params, executedAt: new Date().toISOString() }],
        rowCount: 1,
      };
    } finally {
      this.activeConnections--;
    }
  }

  public getStatus() {
    return {
      maxConnections: this.maxConnections,
      activeConnections: this.activeConnections,
      createdAt: this.createdAt,
    };
  }
}
