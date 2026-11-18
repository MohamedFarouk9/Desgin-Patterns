import { ExpressResponse } from "./ExpressResponse.js";

export class BaseExpressResponse implements ExpressResponse {
  private response: any;

  constructor(response: any) {
    this.response = response;
  }

  public json(body: any): void {
    this.response.json(body);
  }

  public send(body: string): void {
    this.response.send(body);
  }

  public status(code: number): this {
    this.response.status(code);
    return this;
  }

  public setHeader(name: string, value: string): void {
    this.response.setHeader(name, value);
  }
}