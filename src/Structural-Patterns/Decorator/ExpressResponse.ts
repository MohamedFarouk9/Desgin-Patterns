export interface ExpressResponse {
  json(body: any): void;
  send(body: string): void;
  status(code: number): this;
  setHeader(name: string, value: string): void;
}