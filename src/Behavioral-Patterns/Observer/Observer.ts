import { Subject } from "./Subject.js";

export interface Observer {
  update(subject: Subject): void;
}