/**
 * Interpreter Pattern — Feature-Flag & Rule-Engine Expression Evaluator
 * Evaluates simple boolean rules like "country == US AND plan == pro" against a user context.
 */
export type EvalContext = Record<string, string | number | boolean>;

export interface Expression {
  interpret(ctx: EvalContext): boolean;
}

export class EqualsExpression implements Expression {
  constructor(private readonly key: string, private readonly value: string) {}
  interpret(ctx: EvalContext): boolean {
    return String(ctx[this.key] ?? "") === this.value;
  }
}

export class AndExpression implements Expression {
  constructor(private readonly left: Expression, private readonly right: Expression) {}
  interpret(ctx: EvalContext): boolean {
    return this.left.interpret(ctx) && this.right.interpret(ctx);
  }
}

export class OrExpression implements Expression {
  constructor(private readonly left: Expression, private readonly right: Expression) {}
  interpret(ctx: EvalContext): boolean {
    return this.left.interpret(ctx) || this.right.interpret(ctx);
  }
}

// Parses simple expressions: "key == val" joined by "AND" / "OR"
export function parseRule(rule: string): Expression {
  const orParts = rule.split(/\s+OR\s+/i);
  const orExprs = orParts.map((part) => {
    const andParts = part.split(/\s+AND\s+/i);
    const andExprs: Expression[] = andParts.map((atom) => {
      const match = atom.trim().match(/^(\w+)\s*==\s*(\S+)$/);
      if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid rule token: "${atom}". Expected "key == value"`);
      }
      return new EqualsExpression(match[1], match[2]);
    });
    return andExprs.reduce((acc, cur) => new AndExpression(acc, cur));
  });
  return orExprs.reduce((acc, cur) => new OrExpression(acc, cur));
}
