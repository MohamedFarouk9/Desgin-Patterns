
```markdown
# 🔒 Singleton Pattern

## 🎯 Intent
The **Singleton Pattern** is a **creational design pattern** that ensures a class has **only one instance** throughout the application — and provides a **global point of access** to that instance.

This is useful when you want to **control shared resources** such as a database connection, logger, or configuration service.

---

## 💡 Key Concepts

- **Single Instance:** Only one object of the class can exist.
- **Global Access Point:** The instance can be accessed globally through a static method.
- **Lazy Initialization:** The instance is created only when needed.

---

## 🏗️ Structure

```

src/
┣ controllers/
|  |singletonController
┣ patterns/
┃ ┣ singleton/
┃ ┃ ┣ Database.ts
┃ ┃ ┗ README.md
┣ app.ts
┣ server.ts

````

---

## 🧱 Example

### `Database.ts`
```typescript
export class Database {
  private static instance: Database;
  private connection: string;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.connection = "Database connection established!";
  }

  // Public static method to get the instance
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      console.log("New Database instance created");
    }
    return Database.instance;
  }

  // Example method
  public query(sql: string) {
    console.log(`Executing SQL: ${sql}`);
  }
}
````

---

### Example Usage

```typescript
import { Database } from "./Database";

// Get single instance
const db1 = Database.getInstance();
db1.query("SELECT * FROM users");

// Get same instance
const db2 = Database.getInstance();
db2.query("SELECT * FROM products");

console.log(db1 === db2); // ✅ true (both are the same instance)
```

---

## ✅ Benefits

* Ensures **only one instance** of a class exists.
* Provides **global access** to the instance.
* Useful for **shared resources** (e.g., config, logger, cache).

---

## ⚠️ Drawbacks

* Can make **unit testing harder** (shared global state).
* Can introduce **hidden dependencies**.
* Must be used carefully to avoid **tight coupling**.

---

## 🧩 Real-world Analogy

Think of a **database connection**:
you don’t want every request to create a new connection;
you just want **one shared connection** reused by all parts of the app.

---

## 🧠 When to Use

* When you need a **single access point** to a resource.
* When managing **global state or configuration**.
* When multiple instances could cause **resource conflicts**.

```