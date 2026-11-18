# 🧬 Prototype Pattern: Deep Cloning Document & Campaign Blueprints

## 1. 🚨 The Real Production Problem
In marketing, e-commerce, and enterprise workflow engines, users frequently create new campaigns, pages, or email workflows starting from a standardized blueprint or existing template.

### What happens without Prototype?
1. **Costly Repetitive Queries & Parsing:**
   Every time an editor creates a new campaign, the backend must execute heavy relational joins across multiple tables (`templates`, `sections`, `permissions`, `custom_field_schemas`), followed by complex JSON deserialization and validation.
2. **The Shallow Copy Reference Bug (Shared State Mutation):**
   Developers often write naive copies (`Object.assign()` or `{ ...template }`).
   ```typescript
   // ❌ Severe Production Bug: Shallow Copy
   const newCampaign = { ...masterTemplate };
   newCampaign.sections[0].heading = "Flash Sale";
   // BUG: masterTemplate.sections[0].heading was also changed!
   // All future users now get the corrupted template!
   ```

---

## 2. 💡 How Prototype Solves It
The **Prototype Pattern** allows cloning existing objects without making your code dependent on their concrete classes or re-running expensive initialization logic from scratch.

### Architectural Solution:
* Implement a `Cloneable<T>` contract with an explicit `.clone()` method.
* **Deep Copying:** Ensures nested reference structures (sections arrays, permission lists, metadata dictionaries) are completely duplicated in memory.
* **Prototype Registry:** Pre-loads and caches heavy blueprints once in memory (`TemplateRegistry`). When a user needs a template, the registry returns a fresh, isolated clone in sub-millisecond time.

---

## 3. 📊 Visual Diagram (Flow & Structure)

### Class Diagram
```mermaid
classDiagram
    class Cloneable~T~ {
        <<interface>>
        +clone() T
    }

    class CampaignDocumentTemplate {
        +id: string
        +name: string
        +themeColor: string
        +sections: DocumentSection[]
        +metadata: DocumentMetadata
        +createdAt: Date
        +clone() CampaignDocumentTemplate
    }

    class TemplateRegistry {
        -static registry: Map~string, CampaignDocumentTemplate~
        +initializeDefaults()$ void
        +getTemplate(key: string)$ CampaignDocumentTemplate
        +registerTemplate(key: string, template: CampaignDocumentTemplate)$ void
    }

    Cloneable <|.. CampaignDocumentTemplate
    TemplateRegistry o-- CampaignDocumentTemplate : caches & clones
```

### Flow Sequence
```mermaid
sequenceDiagram
    autonumber
    actor User as Content Editor
    participant API as PrototypeController
    participant Registry as TemplateRegistry
    participant Proto as Master Prototype (In Memory)
    participant Clone as Cloned Document

    User->>API: POST /prototype/clone { templateKey: "black-friday", newName: "Cyber Monday 2026" }
    API->>Registry: getTemplate("black-friday")
    Registry->>Proto: clone() [Deep Copy]
    Proto-->>Clone: Instantiates new copy with cloned nested arrays/objects
    Clone-->>Registry: Returns isolated clone
    Registry-->>API: Returns cloned instance
    API->>Clone: Mutate (newName, custom promoCode)
    Note over Proto: Master Prototype remains completely untouched!
    API-->>User: 201 Created (Cloned Document JSON)
```

---

## 4. 💻 Code Explanation

### Core Implementation: [Article.ts](file:///d:/Desgin-Patterns/src/Creational-Patterns/Prototype/Article.ts)
1. **Deep Cloning Logic:**
   ```typescript
   public clone(): CampaignDocumentTemplate {
     const clonedSections = this.sections.map((section) => ({ ...section }));
     const clonedMetadata = {
       ...this.metadata,
       permissions: {
         canEdit: [...this.metadata.permissions.canEdit],
         canView: [...this.metadata.permissions.canView],
       },
       customFields: JSON.parse(JSON.stringify(this.metadata.customFields)),
     };
     return new CampaignDocumentTemplate(`Copy of ${this.name}`, this.themeColor, clonedSections, clonedMetadata);
   }
   ```
2. **Template Registry Cache:**
   `TemplateRegistry.getTemplate(key)` serves ready-to-use clones instantly from memory without hitting the database, drastically reducing latency under high concurrent load.

---

## 5. 🧪 How to Test

### Prerequisites
```bash
# Build and start the server
npm run build
npm start
# Server runs on http://localhost:3000
```

### Test 1: List Available Templates
```bash
curl -X GET http://localhost:3000/api/prototype/templates
```

**Expected Result:** Returns list of available templates (e.g., "black-friday", "summer-sale", "newsletter-weekly") with their section counts and metadata.

### Test 2: Clone a Template (Black Friday Campaign)
```bash
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "black-friday",
    "newName": "Cyber Monday 2026 Campaign",
    "overrides": {
      "themeColor": "#8B5CF6",
      "promoCode": "CYBER2026"
    }
  }'
```

**Expected Result:** Returns a fully cloned `CampaignDocumentTemplate` with:
- New unique `id` (not the same as master)
- Updated `name: "Cyber Monday 2026 Campaign"`
- Updated `themeColor: "#8B5CF6"`
- Deep-copied `sections` array (independent from master)
- Deep-copied `metadata.permissions` arrays (independent from master)

### Test 3: Clone Summer Sale Template
```bash
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "summer-sale",
    "newName": "End of Season Clearance",
    "overrides": {
      "themeColor": "#F97316"
    }
  }'
```

### Test 4: Verify Deep Clone Independence (Mutation Test)
```bash
# Step 1: Clone the template
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{"templateKey": "black-friday", "newName": "Test Clone"}'
# Note the returned clone's ID

# Step 2: Clone again from same template
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{"templateKey": "black-friday", "newName": "Test Clone 2"}'
```

**Expected Result:** Both clones have different `id` values and independent `sections` arrays. Modifying one clone's sections does NOT affect the other clone or the master template in the registry.

### Test 5: Invalid Template Key (Error Handling)
```bash
curl -X POST http://localhost:3000/api/prototype/clone \
  -H "Content-Type: application/json" \
  -d '{
    "templateKey": "non-existent-template",
    "newName": "Test"
  }'
```

**Expected Result:** Returns `404 Not Found` with error: `"Template not found: non-existent-template. Available: black-friday, summer-sale, newsletter-weekly"`
