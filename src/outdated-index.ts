import { createServer, IncomingMessage, ServerResponse } from "node:http";

const RequestListener = (req: IncomingMessage, res: ServerResponse) => {
  const path = req.url;
  const method = req.method;

  console.log(`${method} ${path}`);

  let response: Record<string, any> = {};

  if (path?.startsWith("/api/v1")) {
    response.statusCode = 200;
    response.message = "I am coming from API router";
  } else if (path?.startsWith("/api/v2")) {
    response.statusCode = 200;
    response.message = "I am coming from API router v2";
  } else if (path?.startsWith("/posts")) {
    response.statusCode = 200;
    response.message = "I am coming from posts router";
  } else {
    response.statusCode = 404;
    response.message = "Not Found";
  }

  res.writeHead(200, { "Content-Type": "Application/json" });
  res.write(JSON.stringify(response));

  res.end();
};

const server = createServer(RequestListener);

server.listen(4545, () => {
  console.log("Server is running on port 4545");
});
