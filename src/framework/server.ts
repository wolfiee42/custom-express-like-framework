import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { EventEmitter } from "node:stream";
import { RequestImpl } from "./Request";

export class Server extends EventEmitter {
  private server: ReturnType<typeof createServer>;

  constructor() {
    super();
    this.server = createServer(this.handleRequest.bind(this));
  }

  private async handleRequest(
    nodeReq: IncomingMessage,
    nodeRes: ServerResponse<IncomingMessage>
  ) {
    this.emit("request:received");

    // STEP 01 : Process the request and response and create own req and res object
    const request = new RequestImpl(nodeReq);
    // STEP 02: Parse the body
    await request.parseBody();
    // STEP 03: Match the route

    // STEP 04: Execute the handle or the middleware chain

    const response = {
      statusCode: 200,
      message: "Hello world",
    };
    nodeRes.writeHead(200, { "Content-Type": "Application/json" });
    nodeRes.write(JSON.stringify(response));

    nodeRes.end();
    this.emit("request:processed");
  }

  listen(port: number, cb?: () => void) {
    this.server.listen(port, cb);
  }
}

new Server();
