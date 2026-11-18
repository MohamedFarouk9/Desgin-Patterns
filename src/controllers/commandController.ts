import { Router, type Request, type Response } from "express";
import { UserService } from "../Behavioral-Patterns/Command/UserService.js";
import { CreateUserCommand } from "../Behavioral-Patterns/Command/CreateUserCommand.js";
import { DeleteUserCommand } from "../Behavioral-Patterns/Command/DeleteUserCommand.js";

const router = Router();
const userService = new UserService();
const invoker = new (class {
  private history: { execute: () => void; undo: () => void }[] = [];
  private redoStack: { execute: () => void; undo: () => void }[] = [];
  private maxHistory: number = 100;

  public executeCommand(cmd: { execute: () => void; undo: () => void }): void {
    cmd.execute();
    this.history.push(cmd);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.redoStack = [];
  }

  public undoLast(): void {
    const lastCmd = this.history.pop();
    if (lastCmd) {
      lastCmd.undo();
      this.redoStack.push(lastCmd);
    }
  }

  public redoLast(): void {
    const lastRedo = this.redoStack.pop();
    if (lastRedo) {
      lastRedo.execute();
      this.history.push(lastRedo);
    }
  }

  public getHistory(): { execute: () => void; undo: () => void }[] {
    return [...this.history];
  }

  public getRedoStack(): { execute: () => void; undo: () => void }[] {
    return [...this.redoStack];
  }
})();

router.post("/command/create", (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required." });
    }

    // Create and execute command
    const createCmd = new CreateUserCommand(userService, name);
    invoker.executeCommand(createCmd);

    return res.status(200).json({
      message: `✅ User "${name}" created via Command Pattern`,
      currentUsers: userService.getUsers(),
      historyLength: invoker.getHistory().length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

router.post("/command/undo", (req: Request, res: Response) => {
  try {
    invoker.undoLast();

    return res.status(200).json({
      message: "✅ Undo executed via Command Pattern",
      currentUsers: userService.getUsers(),
      historyLength: invoker.getHistory().length,
      redoStackLength: invoker.getRedoStack().length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

router.post("/command/redo", (req: Request, res: Response) => {
  try {
    invoker.redoLast();

    return res.status(200).json({
      message: "✅ Redo executed via Command Pattern",
      currentUsers: userService.getUsers(),
      historyLength: invoker.getHistory().length,
      redoStackLength: invoker.getRedoStack().length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

router.get("/command/history", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Command history",
      executedCommands: invoker.getHistory().length,
      canUndo: invoker.getHistory().length > 0,
      canRedo: invoker.getRedoStack().length > 0,
      currentUsers: userService.getUsers(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return res.status(500).json({ error: message });
  }
});

export default router;