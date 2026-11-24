import { Router, type Request, type Response } from "express";
import { DraftCaretaker, FormOriginator } from "./index.js";

const router = Router();
const form = new FormOriginator();
const caretaker = new DraftCaretaker();
caretaker.checkpoint(form);

router.post("/save", (req: Request, res: Response) => {
  const data = req.body as Record<string, string>;
  form.update(data);
  caretaker.checkpoint(form);
  res.json({ pattern: "Memento", state: form.getState() });
});

router.post("/undo", (_req: Request, res: Response) => {
  const ok = caretaker.undo(form);
  res.json({ pattern: "Memento", undone: ok, state: form.getState() });
});

router.post("/redo", (_req: Request, res: Response) => {
  const ok = caretaker.redo(form);
  res.json({ pattern: "Memento", redone: ok, state: form.getState() });
});

export default router;
