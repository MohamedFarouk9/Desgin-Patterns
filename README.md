# 🏗️ Production Design Patterns: Creational Patterns Suite

A production-grade implementation of all **Creational Design Patterns** in Node.js and TypeScript, designed around real-world high-scale production challenges.

Each pattern is implemented with complete production architecture:
1. **Real Production Problem:** High-concurrency pitfalls, memory leaks, coupling, and scaling bottlenecks.
2. **Design Pattern Solution:** Strict SOLID alignment and encapsulation.
3. **Mermaid Diagrams:** Architectural Class Diagrams and Sequence Flow Diagrams.
4. **Clean Code & API Endpoints:** Clean code with Express API controllers for testing.

---

## 🗂️ Project Directory Structure

```
src/
├── Creational-Patterns/
│   ├── Singlton/
│   │   ├── DatabaseSingleton.ts    # Connection Pool Manager & Query Runner
│   │   └── readme.md               # DB connection exhaustion, diagrams & solution
│   ├── Factory-method/
│   │   ├── Notification.ts         # Channels: Email, SMS, Push, Slack
│   │   ├── NotificationFactory.ts  # Abstract Dispatcher & Dynamic Resolver
│   │   └── readme.md               # Multi-channel notification dispatching & OCP
│   ├── Abstract-Factory/
│   │   ├── CloudInfrastructureFactory.ts # Multi-Cloud Suite (AWS, GCP, Local)
│   │   └── readme.md                     # Vendor lock-in & cross-service families
│   ├── Builder/
│   │   ├── ArticleBuilder.ts       # Fluent Builder & ArticleDirector recipes
│   │   └── readme.md               # Complex content aggregates, SEO & validation
│   └── Prototype/
│       ├── Article.ts              # Cloneable Campaign & Document Registry
│       └── readme.md               # Heavy object hydration & shallow-copy reference bugs
├── controllers/
│   ├── singletonController.ts       # /api/singleton
│   ├── factoryController.ts         # /api/factory-method
│   ├── AbstractFactoryController.ts # /api/abstract-factory
│   ├── BuilderController.ts         # /api/builder
│   └── PrototypeController.ts       # /api/prototype
├── app.ts                           # Express app with registered pattern endpoints
└── server.ts                        # Server entry point
```

---

## 🧭 Creational Patterns Summary Table

| Pattern | Real Production Problem Solved | Key Production Benefit | Documentation |
| :--- | :--- | :--- | :--- |
| **Singleton** | **Database Connection Exhaustion:** Unchecked `new Pool()` instantiations under 500+ concurrent requests exhaust database max connections. | Single shared connection pool with graceful teardown (`SIGTERM`) and active connection tracking. | [Singleton Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Singlton/readme.md) |
| **Factory Method** | **Sprawling Multi-Provider Notification Dispatchers:** Massive `switch/if-else` blocks violating the Open/Closed Principle when adding channels. | Extensible dispatchers where new channels (e.g. WhatsApp) can be added without altering existing core services. | [Factory Method Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Factory-method/readme.md) |
| **Abstract Factory** | **Cloud Vendor Lock-In & Testing Obstacles:** Tight coupling to AWS SDKs making local dev, testing, or multi-cloud migration impossible. | Interconnected product families (Storage + Queues + CDN) switchable via one configuration (`AWS`, `GCP`, `Local`). | [Abstract Factory Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Abstract-Factory/readme.md) |
| **Builder** | **Telescoping Constructors in Complex Content Aggregates:** Articles with 15+ optional fields, slug generation, SEO, and invariants. | Fluent, self-documenting method chaining with pre-packaged `Director` recipes and final invariant checks. | [Builder Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Builder/readme.md) |
| **Prototype** | **Expensive DB Queries & Shallow Copy State Corruption:** Repeated database joins and JSON parsing to duplicate campaign blueprints. | Sub-millisecond deep cloning of pre-warmed memory blueprints avoiding shared reference bugs. | [Prototype Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Prototype/readme.md) |

---

## 🚀 Running & Testing the Project

### 1. Build and Run Server
```bash
# Compile TypeScript
npm run dev
# or
npx tsc && node ./dist/server.js
```

### 2. Live API Test Examples

#### 1️⃣ Test Singleton (Shared DB Connection Pool)
```bash
# Check Pool Status
curl -X GET http://localhost:4000/api/singleton/status

# Execute Query over Shared Pool
curl -X POST http://localhost:4000/api/singleton/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users WHERE active = true"}'
```

#### 2️⃣ Test Factory Method (Multi-Channel Notification Dispatcher)
```bash
# Dispatch via Email
curl -X POST http://localhost:4000/api/factory-method/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "email",
    "recipient": "user@example.com",
    "subject": "Weekly Digest",
    "body": "Here is your latest newsletter!"
  }'

# Dispatch via Slack
curl -X POST http://localhost:4000/api/factory-method/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "slack",
    "recipient": "#engineering-alerts",
    "body": "Deployment succeeded."
  }'
```

#### 3️⃣ Test Abstract Factory (Multi-Cloud Infrastructure)
```bash
# Execute media upload, job queuing, and CDN purge on AWS
curl -X POST http://localhost:4000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "fileName": "hero-banner.png"
  }'

# Execute media processing pipeline on Local mock environment
curl -X POST http://localhost:4000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "local",
    "fileName": "local-test.png"
  }'
```

#### 4️⃣ Test Builder (Complex Article Construction)
```bash
# Standard Fluent Builder
curl -X POST http://localhost:4000/api/builder/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mastering Microservices Architecture",
    "content": "A deep dive into distributed systems...",
    "author": "Architect Lead",
    "tags": ["cloud", "architecture"],
    "publish": true
  }'

# Standardized Director Recipe (Breaking News)
curl -X POST http://localhost:4000/api/builder/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Major Release 3.0 Launched",
    "content": "Details on the latest features...",
    "author": "News Editor",
    "recipe": "news-breaking"
  }'
```

#### 5️⃣ Test Prototype (Deep Cloned Campaign Blueprints)
```bash
# Clone "black-friday" blueprint from in-memory Registry
curl -X POST http://localhost:4000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "black-friday",
    "newName": "Cyber Monday Mega Sale 2026",
    "overrideCustomFields": {
      "discountPercent": 70,
      "promoCode": "CYBER70"
    }
  }'
```
