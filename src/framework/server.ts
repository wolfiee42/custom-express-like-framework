import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { EventEmitter } from "node:stream";

export class Server extends EventEmitter {
  private server: ReturnType<typeof createServer>;

  constructor() {
    super();
    this.server = createServer(this.handleRequest.bind(this));
  }

  private handleRequest(nodeReq: IncomingMessage, nodeRes: ServerResponse) {
    this.emit("request:received");
  }
}

new Server();
