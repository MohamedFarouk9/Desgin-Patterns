/**
 * Composite Pattern — Hierarchical Organization / Menu / File Tree
 * Treats individual items (Leaves) and nested groups (Composites) uniformly.
 */
export interface OrgComponent {
  getName(): string;
  getBudget(): number;
  toJSON(): Record<string, unknown>;
}

export class Employee implements OrgComponent {
  constructor(private readonly name: string, private readonly salary: number) {}

  public getName(): string { return this.name; }
  public getBudget(): number { return this.salary; }
  public toJSON() { return { type: "employee", name: this.name, budget: this.salary }; }
}

export class Department implements OrgComponent {
  private readonly children: OrgComponent[] = [];

  constructor(private readonly name: string) {}

  public add(component: OrgComponent): this {
    this.children.push(component);
    return this;
  }

  public getName(): string { return this.name; }

  public getBudget(): number {
    return this.children.reduce((sum, child) => sum + child.getBudget(), 0);
  }

  public toJSON() {
    return {
      type: "department",
      name: this.name,
      totalBudget: this.getBudget(),
      members: this.children.map((c) => c.toJSON()),
    };
  }
}
