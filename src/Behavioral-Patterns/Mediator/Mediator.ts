import { Message } from "./Message.js";

export interface Mediator {
  register(serviceName: string, handler: (message: Message) => void): void;
  route(message: Message): void;
  notify(event: string, data: any): void;
}