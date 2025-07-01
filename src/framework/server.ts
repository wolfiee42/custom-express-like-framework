import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { EventEmitter } from "node:stream";
import { RequestImpl } from "./Request";
import { ResponseImpl } from "./Response";
import { Router } from "./Router";

export class Server extends EventEmitter {
  private server: ReturnType<typeof createServer>;
  private router: Router;

  constructor() {
    super();
    this.server = createServer(this.handleRequest.bind(this));
    this.router = new Router();
    console.log('Server initialized');
  }

  // method to start the server
  private async handleRequest(
    nodeReq: IncomingMessage,
    nodeRes: ServerResponse<IncomingMessage>
  ) {
    this.emit("request:received");

    // STEP 01 : Process the request and response and create own req and res object
    const request = new RequestImpl(nodeReq);
    const response = new ResponseImpl(nodeRes);

    // STEP 02: Parse the body
    await request.parseBody();
    // STEP 03: Match the route
    const matchedResult = this.router.match(request.method, request.path);
    request.params = matchedResult?.params || {};
    request.originalPath = matchedResult?.originalPath || '';

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

  // method
  listen(port: number, cb?: () => void) {
    this.server.listen(port, cb);
  }
}
