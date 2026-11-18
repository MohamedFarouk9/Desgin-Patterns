# 🏛️ Singleton Pattern: Database Connection Pool Manager

## 1. 🚨 The Real Production Problem
In server applications (Node.js/Express, microservices), every incoming HTTP request often needs to query a relational or document database (PostgreSQL, MySQL, MongoDB).

### What happens without Singleton?
* Developers instantiate a new database client instance (`new Client()` or `new Pool()`) inside each controller, route, or service function.
* **Connection Explosion:** A traffic spike of 500 concurrent requests opens 500 open TCP sockets to Postgres. The database quickly exhausts `max_connections` (e.g., throwing `FATAL: sorry, too many clients already`).
* **Memory Leaks & Latency:** TLS handshakes and connection authentication repeat on every request, spiking latency and memory usage.

```
[Request 1] ──> new DatabasePool() ──> TCP Connection #1 ──┐
[Request 2] ──> new DatabasePool() ──> TCP Connection #2 ──┼─> [Database Server] (CRASH: max_connections exceeded!)
[Request 3] ──> new DatabasePool() ──> TCP Connection #3 ──┘
```

---

## 2. 💡 How Singleton Solves It
The **Singleton Pattern** ensures that a class has **only one instance** throughout the application lifecycle and provides a global, unified point of access to that instance.

### Solution Architecture:
* Mark constructor as `private` to prevent arbitrary `new DatabasePoolManager()`.
* Store a cached static instance `DatabasePoolManager.instance`.
* Expose `static getInstance()`: creates the pool on the first call and returns the existing pool on subsequent calls.

---

## 3. 📊 Visual Diagram (Flow & Structure)

### Class Diagram
```mermaid
classDiagram
    class DatabasePoolManager {
        -static instance: DatabasePoolManager
        -isConnected: boolean
        -maxPoolSize: number
        -activeConnections: number
        -createdAt: string
        -constructor()
        +static getInstance() DatabasePoolManager
        +query(sql: string, params: any[]) Promise
        +getStatus() Object
        +close() Promise
    }
```

### Execution Flow
```mermaid
sequenceDiagram
    autonumber
    actor Controller1 as UserController
    actor Controller2 as OrderController
    participant Singleton as DatabasePoolManager
    participant DB as Postgres Engine

    Controller1->>Singleton: DatabasePoolManager.getInstance()
    Note over Singleton: Instance does not exist.<br/>Instantiate new pool & establish shared TCP connections.
    Singleton-->>Controller1: Shared Pool Instance #A

    Controller2->>Singleton: DatabasePoolManager.getInstance()
    Note over Singleton: Instance already exists.<br/>Return cached Instance #A.
    Singleton-->>Controller2: Shared Pool Instance #A

    Controller1->>Singleton: query("SELECT * FROM users")
    Singleton->>DB: Reused Connection from pool
    DB-->>Singleton: Rows
    Singleton-->>Controller1: Result
```

---

## 4. 💻 Code Explanation

### Core Implementation: [DatabaseSingleton.ts](file:///d:/Desgin-Patterns/src/Creational-Patterns/Singlton/DatabaseSingleton.ts)
```typescript
export class DatabasePoolManager {
  private static instance: DatabasePoolManager | null = null;

  // 1. Private constructor: Enforces no external instantiation
  private constructor() {
    this.initPool();
  }

  // 2. Controlled access point: Returns the same instance everywhere
  public static getInstance(): DatabasePoolManager {
    if (!DatabasePoolManager.instance) {
      DatabasePoolManager.instance = new DatabasePoolManager();
    }
    return DatabasePoolManager.instance;
  }
}
```

### Key Production Features Included:
1. **Connection Pool Management:** Enforces a maximum connection ceiling (`maxPoolSize`).
2. **Safe Disconnect / Teardown:** Provides `.close()` to flush pool connections during graceful server shutdown (`SIGTERM`).
3. **Status Inspection:** Exposes active connections and connection state for health checks (`/health/db`).

---

## 5. 🧪 How to Test

### Prerequisites
```bash
# Build and start the server
npm run build
npm start
# Server runs on http://localhost:3000
```

### Test 1: Verify Singleton Instance Sharing
```bash
# Check pool status - first call creates the instance
curl -X GET http://localhost:3000/api/singleton/status

# Check pool status - second call returns same instance
curl -X GET http://localhost:3000/api/singleton/status
```

**Expected Result:** Both calls return the same `createdAt` timestamp and `poolSize`, proving the same instance is reused.

### Test 2: Execute Queries on Shared Pool
```bash
# Execute a query through the shared pool
curl -X POST http://localhost:3000/api/singleton/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users WHERE active = true"}'
```

**Expected Result:** Response shows `isExactSameReference: true` confirming both `getInstance()` calls returned the identical object.

### Test 3: Verify Connection Pool Limits
```bash
# The pool has maxPoolSize: 10. You can test pool exhaustion by making 
# more than 10 concurrent requests (requires load testing tool)
```

### Test 4: Graceful Shutdown
```bash
# Send SIGTERM to trigger graceful pool closure
kill -TERM <server-pid>
# Check logs for: "[DatabasePoolManager] Pool connections gracefully closed."
```
