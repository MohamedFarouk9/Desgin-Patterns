# 📘 Gang of Four (GoF) Design Patterns Handbook — Node.js & TypeScript

A clean, simple, **production-first handbook** implementing all **23 Gang of Four Design Patterns** in Node.js + TypeScript + Express.

Every single pattern lives in its own self-contained folder with:
- `index.ts` — Clean, readable TypeScript solving a **real production problem**
- `route.ts` — Live Express HTTP endpoint
- `README.md` — Problem, Solution, **Mermaid Class & Sequence Diagrams**, Code Walkthrough, `curl` tests, and When to Use / Avoid

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Server runs on http://localhost:3000
```

Import [design-patterns-api-test-suite.postman_collection.json](file:///d:/Desgin-Patterns/design-patterns-api-test-suite.postman_collection.json) into Postman, or test any endpoint with `curl`.

---

## 1️⃣ Creational Patterns (5) — *How objects are created*

| # | Pattern | Real Production Problem Solved | Endpoint | Guide |
|---|---------|-------------------------------|----------|-------|
| 01 | **Singleton** | Prevents DB connection explosion under high concurrency | `GET /api/singleton/status`, `POST /api/singleton/query` | [README](file:///d:/Desgin-Patterns/src/01-creational/01-singleton/README.md) |
| 02 | **Factory Method** | Multi-channel notifications (Email, SMS, Slack) without `if/else` SDK coupling | `POST /api/factory-method/send` | [README](file:///d:/Desgin-Patterns/src/01-creational/02-factory-method/README.md) |
| 03 | **Abstract Factory** | Swappable cloud suites (AWS, GCP, Local) for Storage + Queue + CDN | `POST /api/abstract-factory/process-media` | [README](file:///d:/Desgin-Patterns/src/01-creational/03-abstract-factory/README.md) |
| 04 | **Builder** | Complex CMS Article + SEO construction without telescoping constructors | `POST /api/builder/create` | [README](file:///d:/Desgin-Patterns/src/01-creational/04-builder/README.md) |
| 05 | **Prototype** | Sub-millisecond deep cloning of campaign blueprints without shared-state bugs | `GET /api/prototype/templates`, `POST /api/prototype/clone` | [README](file:///d:/Desgin-Patterns/src/01-creational/05-prototype/README.md) |

---

## 2️⃣ Structural Patterns (7) — *How classes & objects are composed*

| # | Pattern | Real Production Problem Solved | Endpoint | Guide |
|---|---------|-------------------------------|----------|-------|
| 06 | **Adapter** | Bridges modern dollar-based checkout to a cents-based legacy gateway | `POST /api/adapter/process` | [README](file:///d:/Desgin-Patterns/src/02-structural/06-adapter/README.md) |
| 07 | **Bridge** | Decouples alert severity from delivery channel (avoids $M \times N$ classes) | `POST /api/bridge/alert` | [README](file:///d:/Desgin-Patterns/src/02-structural/07-bridge/README.md) |
| 08 | **Composite** | Uniform budget aggregation across nested departments & employees | `POST /api/composite/budget` | [README](file:///d:/Desgin-Patterns/src/02-structural/08-composite/README.md) |
| 09 | **Decorator** | Dynamically stacks Rate Limiting + Caching + Logging on a data service | `POST /api/decorator/fetch` | [README](file:///d:/Desgin-Patterns/src/02-structural/09-decorator/README.md) |
| 10 | **Facade** | Single `placeOrder()` entry point orchestrating Inventory, Billing, Shipping, Mail | `POST /api/facade/checkout` | [README](file:///d:/Desgin-Patterns/src/02-structural/10-facade/README.md) |
| 11 | **Flyweight** | Shares immutable media asset metadata across thousands of renders | `POST /api/flyweight/render`, `GET /api/flyweight/stats` | [README](file:///d:/Desgin-Patterns/src/02-structural/11-flyweight/README.md) |
| 12 | **Proxy** | Adds RBAC guard, lazy init, and caching in front of financial reports | `GET /api/proxy/report` | [README](file:///d:/Desgin-Patterns/src/02-structural/12-proxy/README.md) |

---

## 3️⃣ Behavioral Patterns (11) — *How objects communicate & delegate*

| # | Pattern | Real Production Problem Solved | Endpoint | Guide |
|---|---------|-------------------------------|----------|-------|
| 13 | **Chain of Responsibility** | Auth → Validation → Fraud pipeline that short-circuits on failure | `POST /api/chain-of-responsibility/process` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/13-chain-of-responsibility/README.md) |
| 14 | **Command** | Undoable/Redoable user management operations with audit history | `POST /api/command/create`, `/undo`, `/redo` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/14-command/README.md) |
| 15 | **Interpreter** | Safe feature-flag rule engine (`"country == US AND plan == pro"`) without `eval()` | `POST /api/interpreter/evaluate` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/15-interpreter/README.md) |
| 16 | **Iterator** | Cursor-based paginated log streaming without loading millions of rows | `GET /api/iterator/demo` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/16-iterator/README.md) |
| 17 | **Mediator** | Centralizes Auth, User Profile, and Audit coordination without circular imports | `POST /api/mediator/login` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/17-mediator/README.md) |
| 18 | **Memento** | Form/document draft checkpoints with opaque undo/redo snapshots | `POST /api/memento/save`, `/undo`, `/redo` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/18-memento/README.md) |
| 19 | **Observer** | Event-driven pub/sub notifying Email & Analytics when an order is placed | `POST /api/observer/order-placed` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/19-observer/README.md) |
| 20 | **State** | Order lifecycle (`PENDING → PAID → SHIPPED → DELIVERED`) blocking illegal transitions | `POST /api/state/reset`, `/pay`, `/ship`, `/deliver` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/20-state/README.md) |
| 21 | **Strategy** | Swappable e-commerce pricing engines (Regular, Percentage, Bulk Tiered) | `POST /api/strategy/calculate` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/21-strategy/README.md) |
| 22 | **Template Method** | Shared `parse → validate → transform` pipeline for CSV and JSON importers | `POST /api/template-method/import` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/22-template-method/README.md) |
| 23 | **Visitor** | Adds Tax & Invoice formatting across cart items without modifying item classes | `POST /api/visitor/invoice` | [README](file:///d:/Desgin-Patterns/src/03-behavioral/23-visitor/README.md) |
