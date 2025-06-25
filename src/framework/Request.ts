import { IncomingMessage } from "node:http";
import { Method, Request } from "./type";
import { parse } from "node:url";

// RequestImpl is an implementation of the Request interface
export class RequestImpl implements Request {
  method: Method; // GET, POST, PUT, PATCH, DELETE
  headers: Record<string, string>;
  path: string; // /posts/234
  originalPath: string = ""; // /posts/:id
  query: Record<string, string>;
  params: Record<string, string> = {};
  body: string | object | null = null;

  constructor(public nodeReq: IncomingMessage) {
    this.method = nodeReq.method as Method;
    this.headers = nodeReq.headers as Record<string, string>;

    const parsedUrl = parse(nodeReq.url!, true);
    this.path = parsedUrl.pathname!;
    this.query = parsedUrl.query as Record<string, string>;
  }

  // method to parse the body of the request
  async parseBody() {
    const allowedMethods = ["POST", "PUT", "PATCH"];

    // Check if the method is allowed to have a body
    if (!allowedMethods.includes(this.method)) {
      this.body = null;
      return;
    }

    // Check if the content type is supported
    const contentType = this.headers["content-type"].toLowerCase();

    if (!contentType) {
      this.body = null;
      return;
    }

    // Read the body as Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of this.nodeReq) {
      chunks.push(chunk);
    }

    // Convert the chunks to a string
    const buffer = Buffer.concat(chunks).toString();

    // Parse the body based on the content type
    if (contentType.includes("application/json")) {
      try {
        this.body = JSON.parse(buffer);
      } catch {
        this.body = null;
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      try {
        const urlEncodedData = new URLSearchParams(buffer); // get this: name=John&age=25&country=Bangladesh

        this.body = Object.fromEntries(urlEncodedData.entries()); // Raw: "username=saif&password=1234" // Becomes: // { username: "saif", password: "1234" }
      } catch {
        this.body = null;
      }
    } else if (contentType.includes("multipart/form-data")) {
      // TODO: handle multipart/form-data
      this.body = null;
    } else if (contentType.includes("text/plain")) {
      this.body = buffer;
    } else {
      this.body = null;
    }
  }
}
