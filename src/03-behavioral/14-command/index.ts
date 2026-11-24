/**
 * Command Pattern — Undoable User Management Operations
 * Encapsulates actions as objects with execute() and undo() so an Invoker can maintain undo/redo stacks.
 */
export interface Command {
  readonly label: string;
  execute(): void;
  undo(): void;
}

export class UserStore {
  private users: string[] = [];
  add(name: string) { if (!this.users.includes(name)) this.users.push(name); }
  remove(name: string) { this.users = this.users.filter((u) => u !== name); }
  list() { return [...this.users]; }
}

export class CreateUserCommand implements Command {
  public readonly label: string;
  constructor(private readonly store: UserStore, private readonly name: string) {
    this.label = `CreateUser(${name})`;
  }
  execute() { this.store.add(this.name); }
  undo() { this.store.remove(this.name); }
}

export class CommandInvoker {
  private history: Command[] = [];
  private redoStack: Command[] = [];

  run(cmd: Command) {
    cmd.execute();
    this.history.push(cmd);
    this.redoStack = [];
  }

  undo() {
    const cmd = this.history.pop();
    if (!cmd) return null;
    cmd.undo();
    this.redoStack.push(cmd);
    return cmd.label;
  }

  redo() {
    const cmd = this.redoStack.pop();
    if (!cmd) return null;
    cmd.execute();
    this.history.push(cmd);
    return cmd.label;
  }

  stats() {
    return {
      history: this.history.map((c) => c.label),
      redoStack: this.redoStack.map((c) => c.label),
    };
  }
}
