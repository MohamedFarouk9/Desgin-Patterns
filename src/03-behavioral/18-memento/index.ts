/**
 * Memento Pattern — Document / Form Draft Snapshot History
 * Saves and restores opaque state snapshots without exposing the Originator's internal fields.
 */
export class FormMemento {
  public readonly savedAt = new Date().toISOString();
  constructor(private readonly snapshot: Record<string, string>) {}

  public getSnapshot(): Record<string, string> {
    return { ...this.snapshot };
  }
}

export class FormOriginator {
  private fields: Record<string, string> = {};

  public update(data: Record<string, string>) {
    this.fields = { ...this.fields, ...data };
  }

  public getState(): Record<string, string> {
    return { ...this.fields };
  }

  public save(): FormMemento {
    return new FormMemento(this.fields);
  }

  public restore(memento: FormMemento) {
    this.fields = memento.getSnapshot();
  }
}

export class DraftCaretaker {
  private undoStack: FormMemento[] = [];
  private redoStack: FormMemento[] = [];

  public checkpoint(originator: FormOriginator) {
    this.undoStack.push(originator.save());
    this.redoStack = [];
  }

  public undo(originator: FormOriginator): boolean {
    if (this.undoStack.length <= 1) return false;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1]!;
    originator.restore(previous);
    return true;
  }

  public redo(originator: FormOriginator): boolean {
    const next = this.redoStack.pop();
    if (!next) return false;
    this.undoStack.push(next);
    originator.restore(next);
    return true;
  }
}
