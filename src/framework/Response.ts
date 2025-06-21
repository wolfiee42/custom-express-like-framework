import { IncomingMessage, ServerResponse } from "node:http";
import { Response } from "./type";

export class ResponseImpl implements Response {
  statusCode: number = 200;
  headers: Record<string, string> = {};

  constructor(public nodeRes: ServerResponse<IncomingMessage>) {}

  status(code: number): this {
    this.statusCode = code;
    return this;
  }
  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }
  send(body?: string | object | Buffer | null): this {
    throw new Error("Method not implemented.");
  }
  json(body: object): this {
    throw new Error("Method not implemented.");
  }
}
