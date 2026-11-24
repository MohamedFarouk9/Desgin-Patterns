# 8. Composite Pattern — Hierarchical Organization Budget Tree

## 🚨 The Real Production Problem
In enterprise apps (org charts, CMS folders, nested permissions, UI trees), a `Department` can contain both individual `Employee` records and nested sub-`Department`s. Writing `if (item instanceof Department) ... else ...` everywhere leads to brittle recursive code.

## 💡 How Composite Solves It
The **Composite Pattern** gives both leaves (`Employee`) and containers (`Department`) the same `OrgComponent` interface (`getBudget()`). Calling `engineering.getBudget()` recursively sums the entire tree uniformly without type checks.

## 📊 Diagrams

### Class Diagram
```mermaid
classDiagram
    class OrgComponent {
        <<interface>>
        +getName() string
        +getBudget() number
    }
    class Employee {
        +getBudget() number
    }
    class Department {
        -children: OrgComponent[]
        +add(c: OrgComponent) this
        +getBudget() number
    }
    OrgComponent <|.. Employee
    OrgComponent <|.. Department
    Department o-- OrgComponent : contains
```

### Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Finance
    participant Org as Engineering Org
    participant BE as Backend Team
    participant Emp as Alice
    Finance->>Org: getBudget()
    Org->>BE: getBudget()
    BE->>Emp: getBudget()
    Emp-->>BE: 180000
    BE-->>Org: 330000
    Org-->>Finance: 715000
```

## 💻 Code Walkthrough
- [index.ts](file:///d:/Desgin-Patterns/src/02-structural/08-composite/index.ts): `Department.getBudget()` delegates `reduce()` to all children, whether leaf or sub-department.
- [route.ts](file:///d:/Desgin-Patterns/src/02-structural/08-composite/route.ts): Builds a 3-level org tree and returns the aggregated budget and JSON tree.

## 🧪 How to Test
```bash
curl -X POST http://localhost:3000/api/composite/budget \
  -H "Content-Type: application/json" \
  -d '{"engineeringBonus": 10000}'
```

## ⚖️ When to Use / When NOT to Use
- **Use:** Tree structures (file systems, org charts, nested menus, ASTs).
- **Avoid:** Flat lists where parent/child nesting doesn't exist.
