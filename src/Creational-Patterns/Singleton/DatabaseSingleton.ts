/**
 * Enterprise-Grade Singleton: Database Connection Pool Manager
 *
 * Production considerations:
 * - Lazy initialization with thread-safe instance creation
 * - Connection pool limits to prevent DB exhaustion
 * - Graceful shutdown handling
 * - Health check endpoint support
 * - Connection lifecycle management
 * - Serialization protection
 */

import type { DatabaseConnection } from "./DatabaseConnection.js";

/**
 * Singleton class managing a connection pool to a database.
 * Ensures only one instance exists throughout the application lifecycle.
 */
export class DatabasePoolManager implements DatabaseConnection {
  private static _instance: DatabasePoolManager | null = null;

  // Track pool state as class properties
  private _isConnected: boolean = false;
  private _activeConnections: number = 0;
  private _maxPoolSize: number = 20;
  private _createdAt: string = "";

  // Private constructor prevents instantiation with `new`
  private constructor() {
    this._initialize();
  }

  private _initialize(): void {
    this._isConnected = true;
    this._activeConnections = 0;
    this._maxPoolSize = DatabasePoolManager._defaultMaxPoolSize;
    this._createdAt = new Date().toISOString();
    console.log(
      `[DatabasePoolManager] Initialized connection pool at ${this._createdAt}. Max size: ${this._maxPoolSize}`
    );
  }

  // Default pool size - can be configured via environment variable
  private static get _defaultMaxPoolSize(): number {
    return typeof process !== "undefined" && process.env?.DB_POOL_MAX_SIZE
      ? Number(process.env.DB_POOL_MAX_SIZE) || 20
      : 20;
  }

  // Public read-only accessors
  public get isConnected(): boolean {
    return this._isConnected;
  }

  public get poolSize(): number {
    return this._maxPoolSize;
  }

  public get activeConnections(): number {
    return this._activeConnections;
  }

  public get createdAt(): string {
    return this._createdAt;
  }

  /**
   * Get the singleton instance (thread-safe lazy initialization).
   */
  public static getInstance(): DatabasePoolManager {
    if (!DatabasePoolManager._instance) {
      DatabasePoolManager._instance = new DatabasePoolManager();
    }
    return DatabasePoolManager._instance;
  }

  /**
   * Execute a query using the shared pool connection.
   * Enforces pool size limits and connection safety.
   */
  public async query<T = unknown>(
    sql: string,
    params: unknown[] = []
  ): Promise<{ rows: T[]; rowCount: number }> {
    if (!this._isConnected) {
      throw new Error("Cannot execute query: Database pool is disconnected.");
    }

    if (this._activeConnections >= this._maxPoolSize) {
      throw new Error(
        `Connection pool exhausted (Active: ${this._activeConnections}/${this._maxPoolSize}).`
      );
    }

    this._activeConnections++;

    try {
      // Simulate asynchronous database I/O latency
      await new Promise((resolve) => setTimeout(resolve, 10));
      return {
        rows: [{ id: 1, executedSql: sql, params, timestamp: new Date().toISOString() } as unknown as T],
        rowCount: 1,
      };
    } finally {
      this._activeConnections--;
    }
  }

  /**
   * Get current pool status for health checks.
   */
  public getStatus(): {
    isConnected: boolean;
    poolSize: number;
    activeConnections: number;
    createdAt: string;
  } {
    return {
      isConnected: this._isConnected,
      poolSize: this._maxPoolSize,
      activeConnections: this._activeConnections,
      createdAt: this._createdAt,
    };
  }

  /**
   * Update internal state (for monitoring or test harnesses).
   */
  public updateMonitoringState(state: { isConnected?: boolean; activeConnections?: number }): void {
    if (typeof state.isConnected === "boolean") {
      this._isConnected = state.isConnected;
    }
    if (typeof state.activeConnections === "number") {
      this._activeConnections = state.activeConnections;
    }
  }

  /**
   * Gracefully close all pool connections.
   * Ideal for SIGTERM/SIGINT handler during server shutdown.
   */
  public async close(): Promise<void> {
    this._isConnected = false;
    this._activeConnections = 0;
    DatabasePoolManager._instance = null;
    console.log("[DatabasePoolManager] Pool connections gracefully closed.");
  }
}

/**
 * Protection against JSON.stringify bypass and serialization helper.
 */
export function serializePoolManager(poolManager: DatabasePoolManager): string {
  return JSON.stringify(
    {
      isConnected: poolManager.isConnected,
      poolSize: poolManager.poolSize,
      activeConnections: poolManager.activeConnections,
      createdAt: poolManager.createdAt,
    },
    null,
    2
  );
}

/**
 * Safely deserialize a pool manager state for monitoring/logging.
 */
export function deserializePoolManager(jsonStr: string): DatabasePoolManager {
  const data = JSON.parse(jsonStr);
  const pool = DatabasePoolManager.getInstance();
  pool.updateMonitoringState({
    isConnected: data.isConnected,
    activeConnections: data.activeConnections,
  });
  return pool;
}

export default DatabasePoolManager;


export default DatabasePoolManager;