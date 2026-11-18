/**
 * Enterprise Database Connection Interface
 *
 * Defines the contract for database operations that the Singleton pool manager
 * exposes. This abstraction allows swapping PostgreSQL, MySQL, MongoDB, etc.
 * without changing the controller or singleton logic.
 */
export interface DatabaseConnection {
  /** Execute a SQL query with optional parameters */
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; rowCount: number }>;

  /** Get current connection pool status */
  getStatus(): {
    isConnected: boolean;
    poolSize: number;
    activeConnections: number;
    createdAt: string;
  };

  /** Gracefully close all pool connections */
  close(): Promise<void>;
}