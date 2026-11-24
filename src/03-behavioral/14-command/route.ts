import { Router, type Request, type Response } from "express";
import { CommandInvoker, CreateUserCommand, UserStore } from "./index.js";

const router = Router();
const store = new UserStore();
const invoker = new CommandInvoker();

router.post("/create", (req: Request, res: Response) => {
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: "name is required." });
    return;
  }
  invoker.run(new CreateUserCommand(store, name));
  res.json({ pattern: "Command", users: store.list(), ...invoker.stats() });
});

router.post("/undo", (_req: Request, res: Response) => {
  const undone = invoker.undo();
  res.json({ pattern: "Command", undone, users: store.list(), ...invoker.stats() });
});

router.post("/redo", (_req: Request, res: Response) => {
  const redone = invoker.redo();
  res.json({ pattern: "Command", redone, users: store.list(), ...invoker.stats() });
});

router.get("/history", (_req: Request, res: Response) => {
  res.json({ pattern: "Command", users: store.list(), ...invoker.stats() });
});

export default router;
