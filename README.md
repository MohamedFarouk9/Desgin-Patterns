# 🏗️ Production Design Patterns: Enterprise Creational Patterns Suite

A battle-tested, enterprise-grade implementation of all **Creational Design Patterns** in Node.js and TypeScript, designed around real-world high-scale production challenges.

Each pattern is implemented with:
1. **Real Production Problem:** High-concurrency pitfalls, memory leaks, coupling, and scaling bottlenecks.
2. **Enterprise Solution:** Strict SOLID principles, thread safety, and encapsulation.
3. **Mermaid Diagrams:** Architectural Class Diagrams and Sequence Flow Diagrams.
4. **Code Explanation:** Breakdown of interfaces, constructors, and edge cases.
5. **How to Test:** Ready-to-run curl commands and expected JSON responses.

---

## 🗂️ Clean Project Directory Structure

```
src/
├── Creational-Patterns/
│   ├── Singleton/
│   │   ├── DatabaseConnection.ts         # Enterprise Database Connection Contract
│   │   ├── DatabaseSingleton.ts          # Pool Manager, thread-safe lazy init & metrics
│   │   ├── test.sh                       # Automated bash test suite
│   │   └── readme.md                     # Deep dive & test instructions
│   ├── Factory-method/
│   │   ├── Notification.ts               # Channels: Email, SMS, Push, Slack
│   │   ├── NotificationFactory.ts        # Abstract Dispatcher & Dynamic Resolver
│   │   └── readme.md                     # Deep dive & test instructions
│   ├── Abstract-Factory/
│   │   ├── CloudInfrastructureFactory.ts # Multi-Cloud Suite (AWS, GCP, Local)
│   │   └── readme.md                     # Deep dive & test instructions
│   ├── Builder/
│   │   ├── ArticleBuilder.ts             # Fluent Builder & ArticleDirector recipes
│   │   └── readme.md                     # Deep dive & test instructions
│   └── Prototype/
│       ├── Article.ts                    # Deep-cloneable Document & TemplateRegistry
│       └── readme.md                     # Deep dive & test instructions
├── controllers/
│   ├── singletonController.ts            # /api/singleton
│   ├── factoryController.ts              # /api/factory-method
│   ├── AbstractFactoryController.ts      # /api/abstract-factory
│   ├── BuilderController.ts              # /api/builder
│   └── PrototypeController.ts            # /api/prototype
├── app.ts                                # Central Express application
└── server.ts                             # Server entry point (Default Port: 3000)
```

---

## 🧭 Creational Patterns Summary & Testing Matrix

| Pattern | Enterprise Problem Solved | Key Production Feature | Documentation & Testing |
| :--- | :--- | :--- | :--- |
| **Singleton** | **Database Connection Exhaustion:** 500+ concurrent requests opening separate sockets crashing the DB server. | Centralized pool manager, connection ceiling, thread-safe init, and serialization defense. | [Singleton Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Singleton/readme.md) |
| **Factory Method** | **Sprawling Multi-Provider Dispatchers:** Nested `switch`/`if-else` blocks violating the Open/Closed Principle when adding channels. | Abstract `NotificationDispatcher` with dynamic `Resolver` allowing zero-edit extensions. | [Factory Method Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Factory-method/readme.md) |
| **Abstract Factory** | **Cloud Vendor Lock-In & Testing Obstacles:** Tight coupling to AWS SDKs making local integration testing or multi-cloud impossible. | Interconnected product families (`Storage + Queue + CDN`) switchable via single environment flag. | [Abstract Factory Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Abstract-Factory/readme.md) |
| **Builder** | **Telescoping Constructors in Complex Aggregates:** Domain models with 15+ optional fields, slug generation, SEO, and invariants. | Fluent method chaining, computed derived properties, and pre-packaged `Director` recipes. | [Builder Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Builder/readme.md) |
| **Prototype** | **Expensive DB Queries & Shallow Copy Bugs:** Heavy relational queries for blueprints + state pollution from shallow copies. | Sub-millisecond true deep cloning of in-memory template prototypes (`TemplateRegistry`). | [Prototype Readme](file:///d:/Desgin-Patterns/src/Creational-Patterns/Prototype/readme.md) |

---

## 🚀 Server Startup

### 1. Build & Run
```bash
# Verify TypeScript compilation
npx tsc --noEmit

# Run Development Server
npm run dev
# Server will start on http://localhost:3000
```

---

## 🧪 Quick Test Guide for All 5 Patterns

### 1️⃣ Singleton Pattern (`/api/singleton`)
```bash
# Check Pool Status & Connection Health
curl -X GET http://localhost:3000/api/singleton/status

# Execute Query over Shared Pool (Verifies instance reference identity)
curl -X POST http://localhost:3000/api/singleton/query \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users WHERE active = true"}'

# Test Monitoring State Serialization
curl -X GET http://localhost:3000/api/singleton/serialize
```

### 2️⃣ Factory Method Pattern (`/api/factory-method`)
```bash
# Dispatch Email
curl -X POST http://localhost:3000/api/factory-method/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "email",
    "recipient": "user@example.com",
    "subject": "Security Alert",
    "body": "New login detected."
  }'

# Dispatch SMS
curl -X POST http://localhost:3000/api/factory-method/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "sms",
    "recipient": "+15550192834",
    "body": "Your one-time code is 782103"
  }'

# Dispatch Slack Webhook
curl -X POST http://localhost:3000/api/factory-method/send \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "slack",
    "recipient": "#dev-alerts",
    "body": "Database migration v4 completed."
  }'
```

### 3️⃣ Abstract Factory Pattern (`/api/abstract-factory`)
```bash
# Execute Full Media Pipeline on AWS (S3 + SQS + CloudFront)
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "aws",
    "fileName": "report-2026.pdf"
  }'

# Execute Full Media Pipeline on GCP (GCS + Pub/Sub + Cloud CDN)
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "gcp",
    "fileName": "marketing-video.mp4"
  }'

# Execute Pipeline Completely Offline (Local Disk + In-Memory Queue + Mock CDN)
curl -X POST http://localhost:3000/api/abstract-factory/process-media \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "local",
    "fileName": "test-fixture.png"
  }'
```

### 4️⃣ Builder Pattern (`/api/builder`)
```bash
# Custom Article Construction (Fluent Chaining)
curl -X POST http://localhost:3000/api/builder/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Architecting Scalable Node.js Microservices",
    "content": "Designing high throughput systems requires reliable fault isolation...",
    "author": "System Architect",
    "tags": ["nodejs", "architecture"],
    "isFeatured": true,
    "publish": true
  }'

# Director Recipe: Breaking News
curl -X POST http://localhost:3000/api/builder/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Critical Patch Released",
    "content": "Security teams have resolved the issue.",
    "author": "Security Lead",
    "recipe": "news-breaking"
  }'

# Director Recipe: SEO-Optimized Article
curl -X POST http://localhost:3000/api/builder/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Guide to Design Patterns",
    "content": "Design patterns are reusable solutions...",
    "author": "Tech Lead",
    "summary": "Master all creational patterns with TypeScript.",
    "tags": ["patterns", "typescript"],
    "recipe": "seo-optimized"
  }'
```

### 5️⃣ Prototype Pattern (`/api/prototype`)
```bash
# List Master Blueprints in In-Memory Registry
curl -X GET http://localhost:3000/api/prototype/templates

# Clone "black-friday" Campaign Blueprint with Custom Overrides
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "black-friday",
    "newName": "Cyber Monday 2026 Mega Sale",
    "overrideCustomFields": {
      "discountPercent": 70,
      "promoCode": "CYBER70"
    }
  }'

# Clone "product-launch" Blueprint
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "product-launch",
    "newName": "Enterprise AI Cloud Launch",
    "overrideCustomFields": {
      "sla": "99.999%"
    }
  }'
```
