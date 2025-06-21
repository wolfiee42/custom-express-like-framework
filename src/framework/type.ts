import { IncomingMessage, ServerResponse } from "node:http";

/**
 * Methods: get, post, put, patch, delete
 * */

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Request {
  nodeReq: IncomingMessage;
  method: Method;
  headers: Record<string, string>;
  path: string; // /posts/234
  originalPath: string; // /posts/:id
  query: Record<string, string>;
  params: Record<string, string>;
  body: string | object | null;
}

export interface Response {
  nodeRes: ServerResponse<IncomingMessage>;
  statusCode: number;
  headers: Record<string, string>;
  status(code: number): this;
  setHeader(key: string, value: string): this;
  send(body?: string | object | Buffer | null): this;
  json(body: object): this;
}

export type Handler = (req: Request, res: Response) => void | Promise<void>;
