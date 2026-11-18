# 📮 Postman Collection Complete Testing Guide

This guide walks you through importing and testing every design pattern using the included **[design-patterns-api-test-suite.postman_collection.json](file:///d:/Desgin-Patterns/design-patterns-api-test-suite.postman_collection.json)**.

---

## ⚡ 1. Quick Setup & Import

1. **Start the API Server:**
   ```bash
   npm run dev
   # Server runs at http://localhost:3000
   ```
2. **Import into Postman:**
   * Open **Postman**.
   * Click **Import** (top left).
   * Drag and drop `design-patterns-api-test-suite.postman_collection.json` or choose the file.
   * Verify the collection variable `baseUrl` is set to `http://localhost:3000`.

---

## 🧭 2. Detailed Test Walkthrough by Pattern

### Category 1: Creational Design Patterns

#### 1️⃣ Singleton Pattern
* **Request 1: `GET /api/singleton/status`**
  * **Objective:** Verifies that the singleton pool manager is active and inspects pool metrics.
  * **Expected Status:** `200 OK`
  * **Expected Response:**
    ```json
    {
      "message": "✅ Database connection pool status retrieved via Singleton",
      "status": {
        "isConnected": true,
        "poolSize": 20,
        "activeConnections": 0
      }
    }
    ```
* **Request 2: `POST /api/singleton/query`**
  * **Body:**
    ```json
    {
      "sql": "SELECT * FROM users WHERE active = true",
      "params": []
    }
    ```
  * **Key Verification:** Look for `"isExactSameReference": true`. This proves both callers resolved the exact same memory instance of `DatabasePoolManager`.

---

#### 2️⃣ Factory Method Pattern
* **Request 1: `POST /api/factory-method/send` (Email)**
  * **Body:**
    ```json
    {
      "channel": "email",
      "recipient": "user@example.com",
      "subject": "Security Alert",
      "body": "Your password has been changed."
    }
    ```
  * **Key Verification:** Handled by `EmailDispatcher` returning `channel: "email"` and an SMTP message ID.
* **Request 2: `POST /api/factory-method/send` (SMS)**
  * **Body:**
    ```json
    {
      "channel": "sms",
      "recipient": "+15550192834",
      "body": "Your OTP code is 894321"
    }
    ```
  * **Key Verification:** Handled by `SMSDispatcher` returning `channel: "sms"` with Twilio details.
* **Request 3: `POST /api/factory-method/send` (Slack)**
  * **Body:**
    ```json
    {
      "channel": "slack",
      "recipient": "#dev-deployments",
      "body": "Production deploy v2.4.0 completed."
    }
    ```
  * **Key Verification:** Handled by `SlackDispatcher` posting to webhook targets.

---

#### 3️⃣ Abstract Factory Pattern
* **Request 1: `POST /api/abstract-factory/process-media` (AWS)**
  * **Body:**
    ```json
    {
      "provider": "aws",
      "fileName": "quarterly-report.pdf"
    }
    ```
  * **Key Verification:** Resolves the AWS product family:
    * `storage`: S3 bucket URL (`s3.amazonaws.com`)
    * `queue`: SQS message queue (`sqs_msg_...`)
    * `cdn`: CloudFront invalidation batch
* **Request 2: `POST /api/abstract-factory/process-media` (Local Mock)**
  * **Body:**
    ```json
    {
      "provider": "local",
      "fileName": "offline-test-asset.png"
    }
    ```
  * **Key Verification:** Executes 100% offline using `LocalDiskStorageService`, `InMemoryQueueService`, and `NoOpCDNService` without hitting external network services.

---

#### 4️⃣ Builder Pattern
* **Request 1: `POST /api/builder/create` (Fluent Builder)**
  * **Body:**
    ```json
    {
      "title": "Architecting Scalable Node.js Microservices",
      "content": "Designing high throughput systems requires reliable fault isolation...",
      "author": "Principal Architect",
      "summary": "Comprehensive architectural patterns guide.",
      "tags": ["architecture", "nodejs"],
      "featuredImage": "https://cdn.example.com/banner.png",
      "seo": {
        "metaTitle": "Node.js Microservices Architecture Guide",
        "metaDescription": "Master production distributed systems architecture.",
        "keywords": ["microservices", "scaling"]
      },
      "isFeatured": true,
      "publish": true
    }
    ```
  * **Key Verification:** Returns fully assembled `ArticleEntity` with computed slug (`architecting-scalable-nodejs-microservices`), calculated reading time, and immutable audit timestamps.
* **Request 2: `POST /api/builder/create` (Director Recipe: Breaking News)**
  * **Body:**
    ```json
    {
      "title": "Global Cloud Outage Mitigated",
      "content": "Engineers deployed an automated rollback within 4 minutes.",
      "author": "SRE Team",
      "recipe": "news-breaking"
    }
    ```
  * **Key Verification:** `ArticleDirector` automatically injects tags `["news", "breaking", "hot"]`, marks as featured, and sets status to published.

---

#### 5️⃣ Prototype Pattern
* **Request 1: `GET /api/prototype/templates`**
  * **Objective:** Lists available pre-warmed blueprints in `TemplateRegistry` (`black-friday`, `product-launch`).
* **Request 2: `POST /api/prototype/clone`**
  * **Body:**
    ```json
    {
      "templateKey": "black-friday",
      "newName": "Cyber Monday 2026 Mega Sale",
      "overrideCustomFields": {
        "discountPercent": 70,
        "promoCode": "CYBER70"
      }
    }
    ```
  * **Key Verification:** Creates a new independent object in sub-millisecond time. Modifying the clone does **not** mutate the registered master prototype.

---

### Category 2: Structural Design Patterns

#### 6️⃣ Adapter Pattern
* **Request: `POST /api/adapter/process`**
  * **Body:**
    ```json
    {
      "amount": 199.99,
      "currency": "USD"
    }
    ```
  * **Key Verification:** Translates modern dollar-based JSON parameters into the legacy payment gateway's cents-based contract (`amountInCents: 19999`) transparently.

---

#### 7️⃣ Composite Pattern
* **Request: `POST /api/composite/create-article`**
  * **Body:**
    ```json
    {
      "title": "Mastering Software Architecture",
      "content": "Overview",
      "sections": [
        {
          "title": "Part 1: Creational",
          "paragraphs": ["Singleton", "Factory Method"]
        },
        {
          "title": "Part 2: Structural",
          "paragraphs": ["Adapter", "Composite"]
        }
      ]
    }
    ```
  * **Key Verification:** Executes uniform `.operation()` traversing the tree hierarchy (Article composite -> Section composite -> Paragraph leaves).

---

### Category 3: Behavioral Design Patterns

#### 8️⃣ Chain of Responsibility Pattern
* **Request 1: `POST /api/chain-of-responsibility/process` (Passed)**
  * **Header:** `Authorization: Bearer valid-token-123`
  * **Body:**
    ```json
    {
      "name": "Alice Johnson",
      "email": "alice@example.com"
    }
    ```
  * **Expected Status:** `200 OK` (`"chainStatus": "ALL_HANDLERS_PASSED"`)
* **Request 2: `POST /api/chain-of-responsibility/process` (Short-Circuited)**
  * **Headers:** Omit the `Authorization` header.
  * **Expected Status:** `400 Bad Request` (`"chainStatus": "SHORT_CIRCUITED"`)
  * **Key Verification:** Request is blocked immediately by `AuthenticationHandler` before reaching validation, logging, or business logic.

---

#### 9️⃣ Command Pattern
* **Step 1: Execute Action (`POST /api/command/create`)**
  * **Body:** `{"name": "Charlie Brown"}`
  * **Verification:** User is added and command object is pushed onto the invoker history stack.
* **Step 2: Inspect History (`GET /api/command/history`)**
  * **Verification:** Confirms `canUndo: true` and `executedCommands: 1`.
* **Step 3: Undo (`POST /api/command/undo`)**
  * **Verification:** Reverses the user creation; current user list becomes empty and `canRedo: true`.
* **Step 4: Redo (`POST /api/command/redo`)**
  * **Verification:** Re-applies the creation from the redo stack.

---

## 🧪 3. Automated Run via Postman Collection Runner or Newman

You can run the entire collection automatically in one click:
1. In Postman, right-click **Design Patterns API Test Suite** folder -> **Run collection**.
2. Click **Run Design Patterns API Test Suite**.
3. Or via CLI using **Newman**:
   ```bash
   npx newman run design-patterns-api-test-suite.postman_collection.json --env-var "baseUrl=http://localhost:3000"
   ```
